const express = require("express");
const aiController = require("../controllers/ai.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { requireFields } = require("../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/chat", aiController.chat);
router.post("/chat/stream", aiController.chatStream);
router.post("/chat/reset", aiController.resetContext);
router.get("/chat/history", aiController.history);
router.get("/tasks/:taskId/chat/history", aiController.taskChatHistory);
router.post("/tasks/:taskId/chat", requireFields(["message"]), aiController.taskChat);
router.post("/tasks/:taskId/chat/stream", requireFields(["message"]), aiController.taskChatStream);

module.exports = router;
