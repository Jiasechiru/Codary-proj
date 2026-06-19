const prisma = require("../prisma/client");

async function isModuleAccessible(userId, moduleId) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { id: true, courseId: true },
  });

  if (!module) {
    return false;
  }

  const enrolled = await prisma.userProgress.findUnique({
    where: { userId_courseId: { userId, courseId: module.courseId } },
  });

  if (!enrolled) {
    return false;
  }

  const modules = await prisma.module.findMany({
    where: { courseId: module.courseId },
    orderBy: { orderIndex: "asc" },
    select: { id: true },
  });

  const index = modules.findIndex((item) => item.id === moduleId);
  if (index <= 0) {
    return true;
  }

  const previousModuleId = modules[index - 1].id;
  const previousProgress = await prisma.userModuleProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId: previousModuleId } },
  });

  return previousProgress?.isCompleted === true;
}

module.exports = { isModuleAccessible };
