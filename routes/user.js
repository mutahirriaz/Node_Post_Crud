const router = require("express").Router();
const {
  register,
  login,
  getuser,
  followRequest,
  getFollowersFollowing,
  // followingRequest,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/verifyToken");
const { adminAuthorization } = require("../middleware/adminToken");

router.post("/register", register);
router.post("/login", login);
router.post("/getuser", adminAuthorization, getuser);
router.post("/followrequest", verifyToken, followRequest);
router.post("/findfollowers", verifyToken, getFollowersFollowing);
// router.post("/followingrequest", verifyToken, followingRequest);

module.exports = router;
