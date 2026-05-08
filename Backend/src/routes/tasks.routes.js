const express = require("express");
const tasksController = require("../controllers/tasks.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { requireFields } = require("../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/:id", tasksController.getTask);
router.post("/:id/submit", requireFields(["code"]), tasksController.submitTask);
router.get("/:id/attempts", tasksController.getAttempts);

module.exports = router;
