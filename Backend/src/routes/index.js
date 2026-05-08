const express = require("express");
const authRoutes = require("./auth.routes");
const usersRoutes = require("./users.routes");
const coursesRoutes = require("./courses.routes");
const modulesRoutes = require("./modules.routes");
const tasksRoutes = require("./tasks.routes");
const quizzesRoutes = require("./quizzes.routes");
const progressRoutes = require("./progress.routes");
const aiRoutes = require("./ai.routes");
const leaderboardRoutes = require("./leaderboard.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/courses", coursesRoutes);
router.use("/modules", modulesRoutes);
router.use("/tasks", tasksRoutes);
router.use("/quizzes", quizzesRoutes);
router.use("/progress", progressRoutes);
router.use("/ai", aiRoutes);
router.use("/leaderboard", leaderboardRoutes);

module.exports = router;
