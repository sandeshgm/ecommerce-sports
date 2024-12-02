const User = require("../../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../config/constants");

const signUp = async (req, res) => {
  //console.log(req.body);
  console.log(req.file);
  const { password, image, ...remaining } = req.body;
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    res.status(400).json({
      message: "User already exit!",
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  console.log(req.file);
  // if (!req?.file) {
  //   console.log("Image not found");
  //   return;
  // }
  await User.create({
    ...remaining,
    password: hashPassword,
    image: req?.file?.filename,
  });
  res.status(200).json({
    message: "User Successfully sign-up",
  });
};

const signIn = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).json({
      message: "Invalid Credentials!",
    });
    return;
  }

  const isValidPassword = bcrypt.compareSync(req.body.password, user.password);

  if (isValidPassword) {
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "20 days",
      }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 10);

    res.cookie("token", token, {
      httpOnly: true,
      expire: expiresAt,
    });

    res.status(200).json({
      message: "Successfully sign in",
      token,
      user,
      expiresAt,
    });
    return;
  }
  res.status(400).json({
    message: "Invalid Credentials",
  });
};

const logOut = async (req, res) => {
  res.clearCookie("token"),
    res.status(200).json({
      message: "User logout successfully",
    });
};

module.exports = {
  signUp,
  signIn,
  logOut,
};
