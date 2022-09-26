const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    followers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }

  // { strictPopulate: false },
  // { strict: false }
);

module.exports = mongoose.model("User", userSchema);
