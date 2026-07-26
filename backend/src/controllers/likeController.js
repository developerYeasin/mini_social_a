const db = require("../../models");
const { sendPushNotification } = require("../utils/notifications");

exports.likePost = async (req, res) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (post) {
      const like = await db.Like.create({
        post_id: post.id,
        user_id: req.user.id,
      });
      const owner = await db.User.findByPk(post.user_id);
      if (owner && owner.id !== req.user.id) {
        await sendPushNotification(
          owner.fcm_token,
          "New Like ❤️",
          `${req.user.email} liked your post`,
        );
      }
      res.json({ like, message: "Like created successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const likes = await db.Like.findAll({
      where: {
        post_id: req.params.id,
      },
    });
    res.json({ likes, message: "Likes retrieved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteLike = async (req, res) => {
  try {
    const like = await db.Like.findOne({
      where: {
        post_id: req.params.id,
        user_id: req.user.id,
      },
    });
    if (like) {
      await like.destroy();
      res.json({ message: "Like deleted successfully" });
    } else {
      res.status(404).json({ message: "Like not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
