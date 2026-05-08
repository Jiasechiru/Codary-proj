const authService = require("../services/auth.service");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.register(username, password);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.login(username, password);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

function me(req, res) {
  res.json({ user: authService.me(req.user) });
}

function logout(_req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(204).send();
}

module.exports = {
  register,
  login,
  me,
  logout,
};
