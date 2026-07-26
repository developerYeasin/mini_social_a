const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const postRoutes = require("./postRoutes");
const likeRoutes = require("./likeRoutes");
const commentRoutes = require("./commentRoutes");
const { protect } = require("../middleware/auth_middleware");

router.use("/auth", authRoutes);
router.use("/admin", protect, adminRoutes);
router.use("/user/post", protect, postRoutes);
router.use("/user/like", protect, likeRoutes);
router.use("/user/comment", protect, commentRoutes);

module.exports = router;
