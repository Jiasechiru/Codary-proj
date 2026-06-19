const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const { isModuleAccessible } = require("./moduleAccess.service");

async function getModuleById(id, userId) {
  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      theory: true,
      tasks: true,
      quizzes: true,
    },
  });

  if (!module) {
    return null;
  }

  const accessible = await isModuleAccessible(userId, id);
  if (!accessible) {
    throw new AppError("Enroll in the course or complete the previous module to access this content.", 403);
  }

  return module;
}

module.exports = { getModuleById };
