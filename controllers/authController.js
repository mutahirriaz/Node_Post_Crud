const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { userName, mobile, email, password } = req.body;

  const newUser = new User({
    userName,
    mobile,
    email,
    password,
  });

  try {
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(500).json("Wrong Email");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    user.password !== req.body.password &&
      res.status(500).json("Wrong Password");
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.getuser = async (req, res) => {
  // console.log("user");
  const user = await User.find();
  return res.status(200).json({ user });
  // console.log("user", user);
};

exports.followRequest = async (req, res) => {
  try {
    const follow = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { $push: { followers: { userId: req.user.id } } }
    );
    return res.status(200).json("Follow Successfully");
  } catch (e) {
    console.log(e);
  }
};
