const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");

function getCourseGroups() {
  return prisma.courseGroup.findMany();
}

function getCourses() {
  return prisma.course.findMany({
    include: { courseGroup: true },
  });
}

function getCourseById(id) {
  return prisma.course.findUnique({
    where: { id },
    include: { courseGroup: true },
  });
}

function getCourseModules(courseId) {
  return prisma.module.findMany({
    where: { courseId },
    orderBy: { orderIndex: "asc" },
    include: { theory: true },
  });
}

async function isUserEnrolled(userId, courseId) {
  const progress = await prisma.userProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  return Boolean(progress);
}

async function ensureCourseEnrollment(userId, courseId) {
  await prisma.userProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      percentage: 0,
      startDate: new Date(),
    },
    update: {},
  });
}

async function enrollCourse(userId, courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const existing = await prisma.userProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existing) {
    return {
      courseId,
      enrolled: true,
      percentage: existing.percentage,
      alreadyEnrolled: true,
    };
  }

  await ensureCourseEnrollment(userId, courseId);

  return { courseId, enrolled: true, percentage: 0, alreadyEnrolled: false };
}

async function getCourseDetails(userId, courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { courseGroup: true },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const enrolled = await isUserEnrolled(userId, courseId);
  const courseProgress = enrolled
    ? await prisma.userProgress.findUnique({
        where: { userId_courseId: { userId, courseId } },
      })
    : null;

  if (!enrolled) {
    return {
      enrolled: false,
      course: {
        id: course.id,
        courseGroupId: course.courseGroupId,
        title: course.title,
        description: course.description,
        language: course.language,
        level: course.level,
        points: course.points,
        percentage: 0,
        courseGroup: course.courseGroup,
      },
      modules: [],
    };
  }

  const [modules, moduleProgress, completedTaskRows, completedQuizRows] = await Promise.all([
    prisma.module.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
      include: {
        tasks: { select: { id: true }, orderBy: { id: "asc" } },
        quizzes: { select: { id: true }, orderBy: { id: "asc" } },
      },
    }),
    prisma.userModuleProgress.findMany({
      where: {
        userId,
        module: { courseId },
      },
    }),
    prisma.userTaskProgress.findMany({
      where: { userId, isCompleted: true, task: { module: { courseId } } },
      select: { taskId: true },
    }),
    prisma.userQuizProgress.findMany({
      where: { userId, isCompleted: true, quiz: { module: { courseId } } },
      select: { quizId: true },
    }),
  ]);

  const progressMap = new Map(
    moduleProgress.map((item) => [item.moduleId, item.isCompleted])
  );
  const completedTaskIds = new Set(completedTaskRows.map((row) => row.taskId));
  const completedQuizIds = new Set(completedQuizRows.map((row) => row.quizId));

  const modulesWithStatus = modules.map((module, index) => {
    const isCompleted = progressMap.get(module.id) || false;
    const isLocked = index > 0 && !progressMap.get(modules[index - 1].id);

    const taskIds = module.tasks.map((t) => t.id);
    const quizIds = module.quizzes.map((q) => q.id);
    const taskCompleted =
      taskIds.length > 0 && taskIds.every((id) => completedTaskIds.has(id));
    const quizCompleted =
      quizIds.length > 0 && quizIds.every((id) => completedQuizIds.has(id));

    return {
      id: module.id,
      title: module.title,
      orderIndex: module.orderIndex,
      isCompleted,
      isLocked,
      quizId: module.quizzes[0]?.id ?? null,
      taskId: module.tasks[0]?.id ?? null,
      quizCompleted,
      taskCompleted,
    };
  });

  return {
    enrolled: true,
    course: {
      id: course.id,
      courseGroupId: course.courseGroupId,
      title: course.title,
      description: course.description,
      language: course.language,
      level: course.level,
      points: course.points,
      percentage: courseProgress?.percentage ?? 0,
      courseGroup: course.courseGroup,
    },
    modules: modulesWithStatus,
  };
}

module.exports = {
  getCourseGroups,
  getCourses,
  getCourseById,
  getCourseModules,
  isUserEnrolled,
  ensureCourseEnrollment,
  enrollCourse,
  getCourseDetails,
};
