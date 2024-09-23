const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers/user.controllers");

const router = express.Router();

router.get("/", getUser);
router.patch("/", updateUser);
router.delete("/", deleteUser);

module.exports = router;
