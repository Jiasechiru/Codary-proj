const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const {
  recomputeModuleCompletion,
  recomputeCourseProgress,
} = require("./progress.service");
const { isModuleAccessible } = require("./moduleAccess.service");

async function getQuizById(id, userId) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  const accessible = await isModuleAccessible(userId, quiz.moduleId);
  if (!accessible) {
    throw new AppError("Module is locked. Complete the previous module first.", 403);
  }

  return quiz;
}

async function submitQuiz(userId, quizId, answer) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { module: true },
  });
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  const accessible = await isModuleAccessible(userId, quiz.moduleId);
  if (!accessible) {
    throw new AppError("Module is locked. Complete the previous module first.", 403);
  }

  const isCorrect = answer === quiz.correctAnswer;

  if (isCorrect) {
    await prisma.userQuizProgress.upsert({
      where: { userId_quizId: { userId, quizId } },
      create: { userId, quizId, isCompleted: true },
      update: { isCompleted: true },
    });

    await recomputeModuleCompletion(userId, quiz.moduleId);
    await recomputeCourseProgress(userId, quiz.module.courseId);
  }

  return { isCorrect };
}

module.exports = {
  getQuizById,
  submitQuiz,
};
