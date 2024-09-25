const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    email: String,
    password: String,
    roles: {
      type: [String],
      default: ["Customer"],
    },
    image: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
