const Post = require("../models/posts");

// For creating a Post
exports.addPost = async (req, res) => {
  const { title, description, image, postStatus } = req.body;
  const newUser = new Post({
    title,
    description,
    image,
    postStatus,
    userId: req.user.id,
  });

  try {
    const post = await newUser.save();
    res.status(200).json("Post Successfully added");
  } catch (e) {
    res.status(500).json(e);
  }
};

// For getting the post
exports.getPosts = async (req, res) => {
  try {
    const getPost = await Post.find({ userId: req.user.id });
    // .select is used to get specific fields from documents
    // const getPost = await Post.find({ userId: req.user.id }).select("description title");
    res.status(200).json(getPost);
  } catch (e) {
    console.log(e);
  }
};

// For updating the Post
exports.updatePost = async (req, res) => {
  try {
    const updatePost = await Post.findByIdAndUpdate(
      { _id: req.body.id },
      req.body
    );
    res.status(200).json("Post updated Successfully");
  } catch (e) {
    console.log(e);
  }
};

// For deleting the Post
exports.deletePost = async (req, res) => {
  try {
    const deletePost = await Post.findOneAndRemove({ _id: req.body.id });
    res.status(200).json("Post deleted Successfully");
  } catch (e) {
    console.log(e);
  }
};

// For Liking the Post
exports.postLike = async (req, res) => {
  const postUser = await Post.findById({ _id: req.body.id });
  let userCondition = 0;
  postUser.likes.forEach((item) => {
    if (JSON.stringify(item.userId) === JSON.stringify(req.user.id)) {
      userCondition = 1;
    }
  });

  if (userCondition !== 1) {
    const user = await Post.findByIdAndUpdate(
      { _id: req.body.id },
      { $push: { likes: { userId: req.user.id } } }
    );
    const likeCount = await Post.findById({ _id: req.body.id });
    // console.log("hello", hello.likes.length);
    return res.status(200).json({
      likesCount: likeCount.likes.length,
      message: "Like Added Successfully",
    });
  } else {
    const user = await Post.findByIdAndUpdate(
      { _id: req.body.id },
      { $pull: { likes: { userId: req.user.id } } }
    );
    const likeCount = await Post.findById({ _id: req.body.id });
    // console.log("hello", hello.disLikes.length);
    return res.status(200).json({
      likesCount: likeCount.likes.length,
      message: "Like Deleted Successfully",
    });
  }
};

// For adding the comment to a specific post
exports.addComment = async (req, res) => {
  try {
    const comment = await Post.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $push: { comments: { comment: req.body.comment, userId: req.user.id } },
      }
    );
    return res.status(200).json({
      message: "comment add Successfully",
    });
  } catch (e) {
    console.log(e);
  }
};

// For adding the specific comment to a specific post
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Post.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $pull: { comments: { _id: req.body.commentId } },
      }
    );
    return res.status(200).json({
      message: "comment delete Successfully",
    });
  } catch (e) {
    console.log(e);
  }
};
