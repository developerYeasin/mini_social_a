const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models");

const expireTime = process.env.expire_time;
const secret = process.env.JWT_SECRET || "mini_social123456";

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const hash = bcrypt.hashSync(password, 10);
      const oldUser = await db.User.findOne({
        where: {
          email,
        },
      });
      if (oldUser) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
      const user = await db.User.create({
        email,
        password_hash: hash,
      });
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: expireTime },
      );
      res.json({
        message: "User created successfully",
        id: user.id,
        email: user.email,
        token,
      });
    } else {
      console.log("Username and password are required");
      res.status(400).json({ message: "Username and password are required" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (isMatch) {
        const token = jwt.sign({ id: user.id, email: user.email }, secret, {
          expiresIn: expireTime,
        });
        res.json({ token: token });
      } else {
        res.status(401).json({ message: "Incorrect email or password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkToken = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.status(200).json({ user, message: "Token is valid" });
    } else {
      res.status(401).json({ message: "No token provided" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.saveFcmToken = async (req, res) => {
  try {
    const { fcm_token } = req.body;
    await db.User.update({ fcm_token }, { where: { id: req.user.id } });
    res.json({ message: "FCM token saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
