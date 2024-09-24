const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers/user.controllers");
const { checkAuthAdmin } = require("../middleware/checkAuth.middleware");
const userGetValidate = require("../validation/User.validation.js/userGet.validator");

const router = express.Router();

router.get("/", userGetValidate, checkAuthAdmin, getUser);
router.patch("/:id", updateUser);
router.delete("/:id", checkAuthAdmin, deleteUser);

module.exports = router;
