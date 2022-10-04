const User = require("../models/user");
const Session = require("../models/session");
const jwt = require("jsonwebtoken");
const conn = require("../connection");
const { body, validationResult } = require("express-validator");

// For Register the User
exports.register = async (req, res) => {
  const { userName, mobile, email, password } = req.body;

  const newUser = new User({
    userName,
    mobile,
    email,
    password,
  });

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e && e.errors && e.errors.email.message });
  }

  console.log("ended");
};

// For Login the User
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  const user = await User.find();
  return res.status(200).json({ user });
};

// For Follow and Following the User
exports.followRequest = async (req, res) => {
  // session is used to check if all mongoose function and it's response fine so its continue its working behalf
  // of mongoose function if not so it's revert all functionality and delete currently saving data in mongodb database

  const session = await conn.startSession();

  try {
    session.startTransaction();

    const newUser = new Session({
      name: "Mutahir",
    });

    const user = await newUser.save({ session });

    const forFollowers = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { $push: { followers: { userId: req.user.id } } },
      { session }
    );

    const forFollowing = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { $push: { folowing: { userId: req.body.id } } },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json("Follow Successfully");
  } catch (e) {
    await session.abortTransaction();
    console.log(e);
  }
  session.endSession();
};

// For UnFollow the User
exports.unFollowRequest = async (req, res) => {
  try {
    const forFollowers = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { $pull: { followers: { userId: req.user.id } } }
    );

    const forFollowing = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { $pull: { folowing: { userId: req.body.id } } }
    );
    return res.status(200).json("unFollow Successfully");
  } catch (e) {
    console.log(e);
  }
};

// For getting the Following and Followers Users
exports.getFollowersFollowing = async (req, res) => {
  try {
    if (req.body.followerRequest === 0) {
      const user = await User.findById({ _id: req.body.id }).populate({
        path: "followers.userId",
        select: { userName: 1, email: 1 },
      });

      const userFollowers = [];

      user.followers.forEach((item) => {
        userFollowers.push(item.userId);
      });

      return res.status(400).json({
        status: "success",
        followers: userFollowers,
      });
    } else {
      const user = await User.findById({ _id: req.body.id }).populate({
        path: "folowing.userId",
        select: { userName: 1, email: 1 },
      });

      const userFollowing = [];

      user.folowing.forEach((item) => {
        userFollowing.push(item.userId);
      });

      return res.status(400).json({
        status: "success",
        following: userFollowing,
      });
    }

    // const user = await User.findById({ _id: req.body.id })
    // !user && res.status(500).json("User Not Found");
    // let followers = [];
    // let following = [];
    // console.log("user", user.followers[0]);
    // if (user !== null) {
    //   user.followers &&
    //     user.followers.forEach((item) => {
    //       followers.push(item.userId);
    //     });

    //   user.folowing &&
    //     user.folowing.forEach((item) => {
    //       following.push(item.userId);
    //     });

    // }
    // let yourFollowers = await User.find(
    //   { _id: { $in: followers } },
    //   { _id: 1, userName: 1 }
    // );

    // let yourFollowing = await User.find(
    //   { _id: { $in: following } },
    //   { _id: 1, userName: 1 }
    // );

    // let newObj = {};
    // newObj.userFollowers = yourFollowers;
    // newObj.yourFollowing = yourFollowing;
    // res.status(200).json({
    //   status: "Success",
    //   Data: newObj,
    // });
  } catch (e) {
    return res.status(400).json({
      status: "failed",
      message: "error",
      error: e,
    });
  }
};
