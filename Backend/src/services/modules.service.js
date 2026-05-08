const prisma = require("../prisma/client");

function getModuleById(id) {
  return prisma.module.findUnique({
    where: { id },
    include: {
      theory: true,
      tasks: true,
      quizzes: true,
    },
  });
}

module.exports = { getModuleById };
