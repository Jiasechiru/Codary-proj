const prisma = require("../prisma/client");

async function getProfile(userId) {
  const [user, completedTasks, totalTime, achievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        totalPoints: true,
        level: true,
        daysStreak: true,
      },
    }),
    prisma.userTaskProgress.count({
      where: { userId, isCompleted: true },
    }),
    prisma.activityHistory.aggregate({
      where: { userId },
      _sum: {
        timeSpentSeconds: true,
      },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    }),
  ]);

  if (!user) {
    return null;
  }

  const enrolledCourses = await prisma.userProgress.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          courseGroup: {
            select: { id: true, title: true, type: true },
          },
        },
      },
    },
    orderBy: { startDate: "desc" },
  });

  return {
    ...user,
    completedTasks,
    totalTimeSpentSeconds: totalTime._sum.timeSpentSeconds || 0,
    achievements: achievements.map((item) => item.achievement),
    enrolledCourses: enrolledCourses.map((entry) => ({
      courseId: entry.courseId,
      percentage: entry.percentage,
      startDate: entry.startDate,
      endDate: entry.endDate,
      title: entry.course.title,
      description: entry.course.description,
      level: entry.course.level,
      language: entry.course.language,
      groupTitle: entry.course.courseGroup?.title ?? null,
    })),
  };
}

async function getActivity(userId) {
  return prisma.activityHistory.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 30,
  });
}

async function getSettings(userId) {
  return prisma.userSettings.findUnique({
    where: { userId },
  });
}

async function updateSettings(userId, settings) {
  return prisma.userSettings.upsert({
    where: { userId },
    create: { userId, settings },
    update: { settings },
  });
}

module.exports = {
  getProfile,
  getActivity,
  getSettings,
  updateSettings,
};
