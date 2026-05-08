const leaderboardService = require("../services/leaderboard.service");

async function getLeaderboard(_req, res, next) {
  try {
    res.json(await leaderboardService.getLeaderboard());
  } catch (error) {
    next(error);
  }
}

module.exports = { getLeaderboard };
