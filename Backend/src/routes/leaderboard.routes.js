const express = require("express");
const leaderboardController = require("../controllers/leaderboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, leaderboardController.getLeaderboard);

module.exports = router;
