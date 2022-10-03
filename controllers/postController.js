const Post = require("../models/posts");
// const { client } = require("../app");
const redis = require("redis");

let = client = redis.createClient({
  host: "127.0.0.1:6379",
  port: 6379,
  enableOfflineQueue: false,
});

async function start() {
  await client.connect();
  console.log(client.isOpen);
}

start();

// For creating a Post
exports.addPost = async (req, res) => {
  const { title, description, postStatus } = req.body;
  const newUser = new Post({
    title,
    description,
    image: req.file.path,
    postStatus,
    userId: req.user.id,
  });

  try {
    const post = await newUser.save();
    await client.del(req.user.id, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
      } else {
        console.log("Cannot delete");
      }
    });
    res.status(200).json("Post Successfully added");
  } catch (e) {
    res.status(500).json(e);
  }
};

// For getting the post
exports.getPosts = async (req, res) => {
  try {
    const cachedData = await client.get(req.user.id);

    if (cachedData === null) {
      const getPost = await Post.find({ userId: req.user.id });
      await client.set(req.user.id, JSON.stringify(getPost));
      console.log(getPost);
      return res.status(200).json(getPost);
    } else {
      res.status(200).json(JSON.parse(cachedData));
      // console.log("cachedData", cachedData);
    }
    // .select is used to get specific fields from documents
    // const getPost = await Post.find({ userId: req.user.id }).select("description title");
    // } else {
    //   res.status(200).json(JSON.parse(hello));
  } catch (e) {
    console.log("error", e);
  }
};

// For updating the Post
exports.updatePost = async (req, res) => {
  try {
    const updatePost = await Post.findByIdAndUpdate(
      { _id: req.body.id },
      req.body
    );

    await client.del(req.user.id, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
      } else {
        console.log("Cannot delete");
      }
    });

    res.status(200).json("Post updated Successfully");
  } catch (e) {
    console.log(e);
  }
};

// For deleting the Post
exports.deletePost = async (req, res) => {
  try {
    const deletePost = await Post.findOneAndRemove({ _id: req.body.id });

    await client.del(req.user.id, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
      } else {
        console.log("Cannot delete");
      }
    });
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

    await client.del(req.user.id, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
      } else {
        console.log("Cannot delete");
      }
    });

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

    await client.del(req.user.id, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
      } else {
        console.log("Cannot delete");
      }
    });
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

    await client.del(req.user.id, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
      } else {
        console.log("Cannot delete");
      }
    });

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

    await client.del(req.user.id, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
      } else {
        console.log("Cannot delete");
      }
    });

    return res.status(200).json({
      message: "comment delete Successfully",
    });
  } catch (e) {
    console.log(e);
  }
};
