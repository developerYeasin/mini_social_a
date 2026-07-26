
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/create/:post_id", commentController.createComment);
router.get("/get/:id", commentController.getComments);
router.get("/get/:id/:cid", commentController.getComment);
router.put("/update/:id/:cid", commentController.updateComment);
router.delete("/delete/:id/:cid", commentController.deleteComment);    

module.exports = router;