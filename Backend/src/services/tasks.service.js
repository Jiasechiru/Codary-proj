const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const {
  recomputeModuleCompletion,
  recomputeCourseProgress,
} = require("./progress.service");

async function getTaskById(id) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { codeTests: true },
  });
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return task;
}

async function submitTask(userId, taskId, code) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { module: true },
  });
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const isCorrect = code.includes("correct");

  const attempt = await prisma.attempt.create({
    data: { userId, taskId, code, isCorrect },
  });

  if (isCorrect) {
    await prisma.userTaskProgress.upsert({
      where: { userId_taskId: { userId, taskId } },
      create: {
        userId,
        taskId,
        isCompleted: true,
        completedAt: new Date(),
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { totalPoints: { increment: 10 } },
    });

    await prisma.pointsHistory.create({
      data: { userId, delta: 10 },
    });

    await recomputeModuleCompletion(userId, task.moduleId);
    await recomputeCourseProgress(userId, task.module.courseId);
  }

  return { attempt, isCorrect };
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
};
