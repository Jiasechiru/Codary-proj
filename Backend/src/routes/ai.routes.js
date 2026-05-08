const express = require("express");
const aiController = require("../controllers/ai.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/chat", aiController.chat);
router.get("/chat/history", aiController.history);
router.post("/tasks/:taskId/chat", aiController.taskChat);

module.exports = router;
