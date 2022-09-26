const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
  },

  likes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],

  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now() },
    },
  ],

  postStatus: { type: String },
});

module.exports = mongoose.model("Post", postSchema);
