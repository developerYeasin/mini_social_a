const { Op } = require("sequelize");
const db = require("../../models");

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (content) {
      const post = await db.Post.create({
        content,
        user_id: req.user.id,
      });
      res.json({ post, message: "Post created successfully" });
    } else {
      res.status(400).json({ message: "Content is required" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const userInclude = {
      model: db.User,
      attributes: ["id", "email"],
      ...(search && { where: { email: { [Op.like]: `%${search}%` } } }),
    };

    const { count, rows: posts } = await db.Post.findAndCountAll({
      include: [
        userInclude,
        { model: db.Like, attributes: ["user_id"] },
        { model: db.Comment, attributes: ["id"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    res.json({
      posts,
      page,
      limit,
      total: count,
      message: "Posts retrieved successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (post) {
      res.json({ post, message: "Post retrieved successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (post) {
      post.content = content;
      await post.save();
      res.json({ post, message: "Post updated successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (post) {
      await post.destroy();
      res.json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
