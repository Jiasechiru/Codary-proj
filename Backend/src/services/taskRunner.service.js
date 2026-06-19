const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const prisma = require("../prisma/client");
const { getAdapter } = require("../adapters/adapter.factory");
const {
  recomputeModuleCompletion,
  recomputeCourseProgress,
} = require("./progress.service");

const STATUSES = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  TIME_LIMIT: "TIME_LIMIT",
  RUNTIME_ERROR: "RUNTIME_ERROR",
  COMPILATION_ERROR: "COMPILATION_ERROR",
};

/**
 * Detects the programming language from the task's starterCode.
 * Uses a simple heuristic: presence of #include → C, otherwise JavaScript.
 */
function detectLanguage(starterCode) {
  if (/#include\s*[<"]/.test(starterCode)) return "c";
  return "javascript";
}

/**
 * Parses the raw output lines (PASS / FAIL: ...) produced by adapter test scripts
 * and returns the aggregate result status.
 */
function evaluateOutput(rawOutput) {
  const lines = rawOutput
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return STATUSES.RUNTIME_ERROR;

  const allPass = lines.every((l) => l === "PASS");
  return allPass ? STATUSES.SUCCESS : STATUSES.FAILED;
}

async function process(attemptId) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      task: {
        include: { codeTests: true, module: true },
      },
    },
  });

  if (!attempt) {
    console.error(`[TaskRunner] Attempt ${attemptId} not found`);
    return { status: "RUNTIME_ERROR", isCorrect: false, attemptId };
  }

  const { task, code } = attempt;
  const language = detectLanguage(task.starterCode);
  const adapter = getAdapter(language);

  const tmpDir = await fs.mkdtemp(
    path.join(os.tmpdir(), `codary-attempt-${attemptId}-`)
  );

  let runResult;
  try {
    runResult = await adapter.run(code, task.codeTests, tmpDir);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }

  let finalStatus;
  if (runResult.status === "OK") {
    finalStatus = evaluateOutput(runResult.output);
  } else {
    finalStatus = runResult.status; // TIME_LIMIT | RUNTIME_ERROR | COMPILATION_ERROR
  }

  const isCorrect = finalStatus === STATUSES.SUCCESS;

  await prisma.attempt.update({
    where: { id: attemptId },
    data: { isCorrect },
  });

  if (isCorrect) {
    await prisma.userTaskProgress.upsert({
      where: { userId_taskId: { userId: attempt.userId, taskId: attempt.taskId } },
      create: {
        userId: attempt.userId,
        taskId: attempt.taskId,
        isCompleted: true,
        completedAt: new Date(),
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: attempt.userId },
      data: { totalPoints: { increment: 10 } },
    });

    await prisma.pointsHistory.create({
      data: { userId: attempt.userId, delta: 10 },
    });

    await recomputeModuleCompletion(attempt.userId, task.moduleId);
    await recomputeCourseProgress(attempt.userId, task.module.courseId);
  }

  console.log(
    `[TaskRunner] attempt=${attemptId} lang=${language} status=${finalStatus} isCorrect=${isCorrect}`
  );

  return { status: finalStatus, isCorrect, attemptId };
}

module.exports = { process };
