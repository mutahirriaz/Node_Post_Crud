const router = require("express").Router();
const {
  addPost,
  getPosts,
  deletePost,
  postLike,
  updatePost,
  addComment,
  deleteComment,
} = require("../controllers/postController");

const { verifyToken } = require("../middleware/verifyToken");

router.post("/addpost", verifyToken, addPost);
router.post("/getposts", verifyToken, getPosts);
router.post("/deletepost", verifyToken, deletePost);
router.post("/postlike", verifyToken, postLike);
router.post("/updatePost", verifyToken, updatePost);
router.post("/addcomment", verifyToken, addComment);
router.post("/deletecomment", verifyToken, deleteComment);

module.exports = router;
