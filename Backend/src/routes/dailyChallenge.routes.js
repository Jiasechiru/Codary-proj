const express = require("express");
const dailyChallengeController = require("../controllers/dailyChallenge.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { requireFields } = require("../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/status", dailyChallengeController.getStatus);
router.post("/submit", requireFields(["language", "code"]), dailyChallengeController.submit);
router.get("/:language", dailyChallengeController.getDailyChallenge);

module.exports = router;
