const prisma = require("../prisma/client");

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Upserts the activity record for the current day, incrementing the time spent.
 * ActivityHistory has no unique constraint on (userId, date), so we look up the
 * existing row for today's date range before deciding to update or create.
 */
async function recordActivity(userId, seconds) {
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await prisma.activityHistory.findFirst({
    where: { userId, date: { gte: today, lt: tomorrow } },
  });

  if (existing) {
    await prisma.activityHistory.update({
      where: { id: existing.id },
      data: { timeSpentSeconds: { increment: seconds } },
    });
  } else {
    await prisma.activityHistory.create({
      data: { userId, date: today, timeSpentSeconds: seconds },
    });
  }
}

/**
 * Recomputes the user's day streak: the number of consecutive days (ending today)
 * that have at least one activity record.
 */
async function recomputeStreak(userId) {
  const rows = await prisma.activityHistory.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  const days = new Set(rows.map((row) => startOfDay(row.date).getTime()));

  let streak = 0;
  const cursor = startOfDay(new Date());
  while (days.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { daysStreak: streak },
  });

  return streak;
}

/**
 * Records learning engagement (time + streak) for a user. Called when a user
 * completes a task or quiz so dashboards and charts reflect real activity.
 */
async function recordLearningActivity(userId, seconds) {
  await recordActivity(userId, seconds);
  await recomputeStreak(userId);
}

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
  recordLearningActivity,
};
