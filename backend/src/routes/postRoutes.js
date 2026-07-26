const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/create", postController.createPost);
router.get("/get", postController.getPosts);
router.get("/get/:id", postController.getPost);
router.put("/update/:id", postController.updatePost);
router.delete("/delete/:id", postController.deletePost);

module.exports = router;
