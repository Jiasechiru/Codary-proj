const express = require("express");
const progressController = require("../controllers/progress.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/course/:id", progressController.getCourseProgress);
router.get("/module/:id", progressController.getModuleProgress);
router.get("/overview", progressController.getOverview);

module.exports = router;
