const prisma = require("../prisma/client");

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

module.exports = {
  getCourseGroups,
  getCourses,
  getCourseById,
  getCourseModules,
};
