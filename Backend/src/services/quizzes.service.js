const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const {
  recomputeModuleCompletion,
  recomputeCourseProgress,
  recordLearningActivity,
} = require("./progress.service");
const { isModuleAccessible } = require("./moduleAccess.service");

// Estimated learning time credited for completing a quiz.
const QUIZ_TIME_SECONDS = 5 * 60;

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

// A module's "quiz" is the full set of Quiz rows attached to it. It is
// considered passed when more than 50% of the questions are answered correctly.
async function getModuleQuiz(moduleId, userId) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { id: true },
  });
  if (!module) {
    throw new AppError("Module not found", 404);
  }

  const accessible = await isModuleAccessible(userId, moduleId);
  if (!accessible) {
    throw new AppError("Module is locked. Complete the previous module first.", 403);
  }

  const quizzes = await prisma.quiz.findMany({
    where: { moduleId },
    orderBy: { id: "asc" },
    select: { id: true, question: true, questionRu: true, answerVariants: true },
  });

  let isCompleted = false;
  if (quizzes.length > 0) {
    const completedCount = await prisma.userQuizProgress.count({
      where: {
        userId,
        isCompleted: true,
        quizId: { in: quizzes.map((q) => q.id) },
      },
    });
    isCompleted = completedCount === quizzes.length;
  }

  return {
    moduleId,
    isCompleted,
    questions: quizzes.map((quiz) => ({
      id: quiz.id,
      question: quiz.question,
      questionRu: quiz.questionRu,
      answerVariants: quiz.answerVariants,
    })),
  };
}

async function submitModuleQuiz(userId, moduleId, answers) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { id: true, courseId: true },
  });
  if (!module) {
    throw new AppError("Module not found", 404);
  }

  const accessible = await isModuleAccessible(userId, moduleId);
  if (!accessible) {
    throw new AppError("Module is locked. Complete the previous module first.", 403);
  }

  const quizzes = await prisma.quiz.findMany({
    where: { moduleId },
    select: { id: true, correctAnswer: true },
  });

  if (quizzes.length === 0) {
    throw new AppError("This module has no quiz.", 400);
  }

  const answerMap = new Map(
    (Array.isArray(answers) ? answers : []).map((item) => [Number(item.quizId), item.answer])
  );

  let correct = 0;
  for (const quiz of quizzes) {
    if (answerMap.get(quiz.id) === quiz.correctAnswer) {
      correct += 1;
    }
  }

  const total = quizzes.length;
  const required = Math.floor(total / 2) + 1; // strictly more than 50%
  const passed = correct >= required;

  if (passed) {
    const quizIds = quizzes.map((q) => q.id);
    const alreadyCompleted = await prisma.userQuizProgress.count({
      where: { userId, isCompleted: true, quizId: { in: quizIds } },
    });
    const firstCompletion = alreadyCompleted < quizIds.length;

    for (const quizId of quizIds) {
      await prisma.userQuizProgress.upsert({
        where: { userId_quizId: { userId, quizId } },
        create: { userId, quizId, isCompleted: true },
        update: { isCompleted: true },
      });
    }

    if (firstCompletion) {
      await recordLearningActivity(userId, QUIZ_TIME_SECONDS);
    }

    await recomputeModuleCompletion(userId, moduleId);
    await recomputeCourseProgress(userId, module.courseId);
  }

  return { passed, correct, total, required };
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
    const existingProgress = await prisma.userQuizProgress.findUnique({
      where: { userId_quizId: { userId, quizId } },
      select: { isCompleted: true },
    });
    const firstCompletion = !existingProgress?.isCompleted;

    await prisma.userQuizProgress.upsert({
      where: { userId_quizId: { userId, quizId } },
      create: { userId, quizId, isCompleted: true },
      update: { isCompleted: true },
    });

    if (firstCompletion) {
      await recordLearningActivity(userId, QUIZ_TIME_SECONDS);
    }

    await recomputeModuleCompletion(userId, quiz.moduleId);
    await recomputeCourseProgress(userId, quiz.module.courseId);
  }

  return { isCorrect };
}

module.exports = {
  getQuizById,
  submitQuiz,
  getModuleQuiz,
  submitModuleQuiz,
};
