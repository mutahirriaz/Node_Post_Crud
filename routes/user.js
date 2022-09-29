const router = require("express").Router();
const {
  register,
  login,
  getuser,
  followRequest,
  getFollowersFollowing,
  unFollowRequest,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/verifyToken");
const { adminAuthorization } = require("../middleware/adminToken");

router.post("/register", register);
router.post("/login", login);
router.post("/getuser", adminAuthorization, getuser);
router.post("/followrequest", verifyToken, followRequest);
router.post("/unfollowrequest", verifyToken, unFollowRequest);
router.post("/findfollowers", verifyToken, getFollowersFollowing);

module.exports = router;
