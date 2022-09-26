const router = require("express").Router();
const {
  register,
  login,
  getuser,
  followRequest,
} = require("../controllers/Controller");
const { verifyToken } = require("../middleware/verifyToken");
const { adminAuthorization } = require("../middleware/adminToken");

router.post("/register", register);
router.post("/login", login);
router.post("/getuser", adminAuthorization, getuser);
router.post("/followrequest", verifyToken, followRequest);

module.exports = router;
