const express = require("express");
const usersController = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { requireFields } = require("../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/profile", usersController.getProfile);
router.get("/activity", usersController.getActivity);
router.get("/settings", usersController.getSettings);
router.put("/settings", requireFields(["settings"]), usersController.updateSettings);

module.exports = router;
