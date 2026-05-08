const coursesService = require("../services/courses.service");

async function getGroups(_req, res, next) {
  try {
    res.json(await coursesService.getCourseGroups());
  } catch (error) {
    next(error);
  }
}

async function getCourses(_req, res, next) {
  try {
    res.json(await coursesService.getCourses());
  } catch (error) {
    next(error);
  }
}

async function getCourse(req, res, next) {
  try {
    res.json(await coursesService.getCourseById(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}

async function getModulesByCourse(req, res, next) {
  try {
    res.json(await coursesService.getCourseModules(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getGroups,
  getCourses,
  getCourse,
  getModulesByCourse,
};
