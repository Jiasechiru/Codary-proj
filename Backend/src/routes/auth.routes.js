const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { requireFields } = require("../middlewares/validate.middleware");

const router = express.Router();

router.post("/register", requireFields(["username", "password"]), authController.register);
router.post("/login", requireFields(["username", "password"]), authController.login);
router.get("/me", authMiddleware, authController.me);
router.post("/logout", authController.logout);

module.exports = router;
