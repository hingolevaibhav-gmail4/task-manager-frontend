const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    lastName: String,

    email: {
      type: String,
      unique: true
    },

    password: String,

    role: {
      type: String,
      default: "member"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);