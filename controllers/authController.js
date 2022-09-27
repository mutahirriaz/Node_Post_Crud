const User = require("../models/user");
const jwt = require("jsonwebtoken");

// For Register the User
exports.register = async (req, res) => {
  const { userName, mobile, email, password } = req.body;

  const newUser = new User({
    userName,
    mobile,
    email,
    password,
  });

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    try {
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(500).json("Email Already used");
  }
};

// For Login the User
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

// For getting the User
exports.getuser = async (req, res) => {
  // console.log("user");
  const user = await User.find();
  return res.status(200).json({ user });
  // console.log("user", user);
};

// For Follo and Following the User
exports.followRequest = async (req, res) => {
  try {
    const forFollowers = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { $push: { followers: { userId: req.user.id } } }
    );

    const forFollowing = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { $push: { folowing: { userId: req.body.id } } }
    );
    return res.status(200).json("Follow Successfully");
  } catch (e) {
    console.log(e);
  }
};

// For getting the Following and Followers Users
exports.getFollowersFollowing = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.body.id });
    !user && res.status(500).json("User Not Found");
    let followers = [];
    let following = [];
    console.log("user", user.followers[0]);
    if (user !== null) {
      user.followers &&
        user.followers.forEach((item) => {
          followers.push(item.userId);
        });

      user.folowing &&
        user.folowing.forEach((item) => {
          following.push(item.userId);
        });

      // console.log("followinf", user.folowing);
    }
    let yourFollowers = await User.find(
      { _id: { $in: followers } },
      { _id: 1, userName: 1 }
    );

    let yourFollowing = await User.find(
      { _id: { $in: following } },
      { _id: 1, userName: 1 }
    );

    let newObj = {};
    newObj.userFollowers = yourFollowers;
    newObj.yourFollowing = yourFollowing;
    res.status(200).json({
      status: "Success",
      Data: newObj,
    });
  } catch (e) {
    return res.status(400).json({
      status: "failed",
      message: "error",
      error: e,
    });
  }
};
