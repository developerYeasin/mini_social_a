
const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

router.post("/like/:id", likeController.likePost);
router.get("/get/:id", likeController.getLikes);
router.delete("/delete/:id", likeController.deleteLike);    

module.exports = router;