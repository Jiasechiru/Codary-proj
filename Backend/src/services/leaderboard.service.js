const prisma = require("../prisma/client");

function getLeaderboard() {
  return prisma.user.findMany({
    orderBy: { totalPoints: "desc" },
    select: {
      id: true,
      username: true,
      totalPoints: true,
      level: true,
    },
  });
}

module.exports = { getLeaderboard };
