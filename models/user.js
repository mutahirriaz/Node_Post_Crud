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
      validate: {
        validator: async function (email) {
          const user = await this.constructor.findOne({ email });
          if (user) {
            if (this.id === user.id) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: (props) => "The specified email address is already in use.",
      },
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

    folowing: [
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
