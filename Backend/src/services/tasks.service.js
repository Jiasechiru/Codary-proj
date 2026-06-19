const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const submissionQueue = require("../queues/submission.queue");
const { isModuleAccessible } = require("./moduleAccess.service");

function toSubmissionJobId(attemptId) {
  return `attempt-${attemptId}`;
}

async function getTaskById(id, userId) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { codeTests: true },
  });
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const accessible = await isModuleAccessible(userId, task.moduleId);
  if (!accessible) {
    throw new AppError("Module is locked. Complete the previous module first.", 403);
  }

  return task;
}

async function submitTask(userId, taskId, code) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const accessible = await isModuleAccessible(userId, task.moduleId);
  if (!accessible) {
    throw new AppError("Module is locked. Complete the previous module first.", 403);
  }

  const attempt = await prisma.attempt.create({
    data: { userId, taskId, code, isCorrect: false },
  });

  await submissionQueue.add(
    "check",
    { attemptId: attempt.id },
    { jobId: toSubmissionJobId(attempt.id) }
  );

  return { attemptId: attempt.id, status: "pending" };
}

async function getAttemptStatus(userId, attemptId) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    select: { id: true, userId: true, isCorrect: true },
  });

  if (!attempt || attempt.userId !== userId) {
    throw new AppError("Attempt not found", 404);
  }

  const job = await submissionQueue.getJob(toSubmissionJobId(attemptId));

  if (!job) {
    return {
      attemptId,
      status: attempt.isCorrect ? "SUCCESS" : "FAILED",
      isCorrect: attempt.isCorrect,
    };
  }

  const state = await job.getState();

  if (state === "waiting" || state === "active" || state === "delayed") {
    return { attemptId, status: "pending", isCorrect: false };
  }

  if (state === "completed") {
    const result = job.returnvalue || {};
    return {
      attemptId,
      status: result.status || (attempt.isCorrect ? "SUCCESS" : "FAILED"),
      isCorrect: result.isCorrect ?? attempt.isCorrect,
    };
  }

  if (state === "failed") {
    return {
      attemptId,
      status: "RUNTIME_ERROR",
      isCorrect: false,
      message: job.failedReason || "Execution failed",
    };
  }

  return {
    attemptId,
    status: attempt.isCorrect ? "SUCCESS" : "FAILED",
    isCorrect: attempt.isCorrect,
  };
}

function getTaskAttempts(userId, taskId) {
  return prisma.attempt.findMany({
    where: { userId, taskId },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  getTaskById,
  submitTask,
  getTaskAttempts,
  getAttemptStatus,
};
