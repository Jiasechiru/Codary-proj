const prisma = require("../prisma/client");

async function getCourseProgress(req, res, next) {
  try {
    const progress = await prisma.userProgress.findUnique({
      where: { userId_courseId: { userId: req.user.id, courseId: Number(req.params.id) } },
    });
    res.json(progress || { percentage: 0 });
  } catch (error) {
    next(error);
  }
}

async function getModuleProgress(req, res, next) {
  try {
    const progress = await prisma.userModuleProgress.findUnique({
      where: { userId_moduleId: { userId: req.user.id, moduleId: Number(req.params.id) } },
    });
    res.json(progress || { isCompleted: false });
  } catch (error) {
    next(error);
  }
}

async function getOverview(req, res, next) {
  try {
    const userId = req.user.id;
    const [courses, modules, tasks, quizzes, totalAttempts, correctAttempts] =
      await Promise.all([
        prisma.userProgress.findMany({ where: { userId } }),
        prisma.userModuleProgress.findMany({ where: { userId } }),
        prisma.userTaskProgress.findMany({ where: { userId } }),
        prisma.userQuizProgress.findMany({ where: { userId } }),
        prisma.attempt.count({ where: { userId } }),
        prisma.attempt.count({ where: { userId, isCorrect: true } }),
      ]);
    res.json({
      courses,
      modules,
      tasks,
      quizzes,
      attempts: { total: totalAttempts, correct: correctAttempts },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCourseProgress,
  getModuleProgress,
  getOverview,
};
