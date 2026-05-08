const express = require("express");
const modulesController = require("../controllers/modules.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/:id", modulesController.getModule);

module.exports = router;
