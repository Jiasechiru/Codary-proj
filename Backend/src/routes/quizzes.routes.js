const express = require("express");
const quizzesController = require("../controllers/quizzes.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { requireFields } = require("../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/:id", quizzesController.getQuiz);
router.post("/:id/submit", requireFields(["answer"]), quizzesController.submitQuiz);

module.exports = router;
