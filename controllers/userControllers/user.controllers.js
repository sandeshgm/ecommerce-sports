const User = require("../../models/user.models");

const getUser = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const users = await User.find({
    name: new RegExp(req.body.name, "i"),
    email: new RegExp(req.body.email),
  })
    .limit(limit)
    .skip((page - 1) * limit);

  const count = await User.countDocuments();

  res.status(200).json({
    message: "User Fetched successfully",
    data: users,
    count,
  });
};

const deleteUser = async (req, res) => {
  await User.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: "Deleted Successfully",
  });
};

const updateUser = async (req, res) => {
  await User.updateOne({ _id: req.params.id }, req.body);
  res.status(200).json({
    message: "Updated Successfully",
  });
};

const getSingleUser = async (req, res) => {
  const singleUser = await User.findById(req.params.id);
  res.status(200).json({
    message: "Singe user fetched successfully",
    data: singleUser,
  });
};

module.exports = {
  getUser,
  deleteUser,
  updateUser,
  getSingleUser,
};
