const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth_middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/checkToken", protect, authController.checkToken);
router.post("/fcm-token", protect, authController.saveFcmToken);

module.exports = router;
