const express = require("express");
const coursesController = require("../controllers/courses.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/groups", coursesController.getGroups);
router.get("/", coursesController.getCourses);
router.get("/:id/details", coursesController.getCourseDetails);
router.post("/:id/enroll", coursesController.enrollCourse);
router.get("/:id/modules", coursesController.getModulesByCourse);
router.get("/:id", coursesController.getCourse);

module.exports = router;
