const db = require("../../models");
const { sendPushNotification } = require("../utils/notifications");

exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (text) {
      const comment = await db.Comment.create({
        text,
        post_id: req.params.post_id,
        user_id: req.user.id,
      });
      const post = await db.Post.findByPk(req.params.post_id);
      const owner = post && (await db.User.findByPk(post.user_id));
      if (owner && owner.id !== req.user.id) {
        await sendPushNotification(
          owner.fcm_token,
          "New Comment 💬",
          `${req.user.email} commented on your post`,
        );
      }
      res.json({ comment, message: "Comment created successfully" });
    } else {
      res.status(400).json({ message: "Text is required" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await db.Comment.findAll({
      where: { post_id: req.params.id },
      include: [{ model: db.User, attributes: ["id", "email"] }],
    });
    res.json({ comments, message: "Comments retrieved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getComment = async (req, res) => {
  try {
    const comment = await db.Comment.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (comment) {
      res.json({ comment, message: "Comment retrieved successfully" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await db.Comment.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (comment) {
      comment.text = text;
      await comment.save();
      res.json({ comment, message: "Comment updated successfully" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await db.Comment.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (comment) {
      await comment.destroy();
      res.json({ message: "Comment deleted successfully" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
