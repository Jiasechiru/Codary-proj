const prisma = require("../prisma/client");

async function recomputeModuleCompletion(userId, moduleId) {
  const [tasks, quizzes] = await Promise.all([
    prisma.task.findMany({ where: { moduleId }, select: { id: true } }),
    prisma.quiz.findMany({ where: { moduleId }, select: { id: true } }),
  ]);

  const taskIds = tasks.map((t) => t.id);
  const quizIds = quizzes.map((q) => q.id);

  const completedTasks = taskIds.length
    ? await prisma.userTaskProgress.count({
        where: { userId, taskId: { in: taskIds }, isCompleted: true },
      })
    : 0;

  const completedQuizzes = quizIds.length
    ? await prisma.userQuizProgress.count({
        where: { userId, quizId: { in: quizIds }, isCompleted: true },
      })
    : 0;

  const isCompleted =
    taskIds.length > 0 &&
    quizIds.length > 0 &&
    completedTasks === taskIds.length &&
    completedQuizzes === quizIds.length;

  await prisma.userModuleProgress.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    create: { userId, moduleId, isCompleted },
    update: { isCompleted },
  });

  return isCompleted;
}

async function recomputeCourseProgress(userId, courseId) {
  const modules = await prisma.module.findMany({
    where: { courseId },
    select: { id: true },
  });

  const moduleIds = modules.map((m) => m.id);
  const totalModules = moduleIds.length;

  const completedModules = moduleIds.length
    ? await prisma.userModuleProgress.count({
        where: { userId, moduleId: { in: moduleIds }, isCompleted: true },
      })
    : 0;

  const percentage = totalModules === 0 ? 0 : (completedModules / totalModules) * 100;

  const existing = await prisma.userProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!existing) {
    return { totalModules, completedModules, percentage: 0 };
  }

  await prisma.userProgress.update({
    where: { userId_courseId: { userId, courseId } },
    data: {
      percentage,
      endDate: percentage === 100 ? new Date() : null,
    },
  });

  return { totalModules, completedModules, percentage };
}

module.exports = {
  recomputeModuleCompletion,
  recomputeCourseProgress,
};
