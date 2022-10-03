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
const { body, validationResult } = require("express-validator");

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  register
);
router.post("/login", body("email").isEmail(), login);
router.post("/getuser", adminAuthorization, getuser);
router.post("/followrequest", verifyToken, followRequest);
router.post("/unfollowrequest", verifyToken, unFollowRequest);
router.post("/findfollowers", verifyToken, getFollowersFollowing);

module.exports = router;
