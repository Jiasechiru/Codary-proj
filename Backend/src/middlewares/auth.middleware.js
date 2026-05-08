const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/jwt");

async function authMiddleware(req, _res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Unauthorized", 401));
  }
}

module.exports = authMiddleware;
