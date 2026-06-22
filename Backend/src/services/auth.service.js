const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const { generateToken } = require("../utils/jwt");

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    totalPoints: user.totalPoints,
    level: user.level,
    daysStreak: user.daysStreak,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(username, password) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new AppError("Username already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      settings: {
        create: {
          settings: {
            theme: "dark",
            language: "ru",
            notifications: true,
            aiEnabled: true,
            autoSuggestions: true,
            dailyReminders: true,
          },
        },
      },
    },
  });

  const token = generateToken({ userId: user.id });
  return { user: sanitizeUser(user), token };
}

async function login(username, password) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({ userId: user.id });
  return { user: sanitizeUser(user), token };
}

function me(user) {
  return sanitizeUser(user);
}

module.exports = {
  register,
  login,
  me,
};
