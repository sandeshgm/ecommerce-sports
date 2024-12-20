const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  getSingleUser,
} = require("../controllers/userControllers/user.controllers");
const {checkAuth, checkAuthAdmin } = require("../middleware/checkAuth.middleware");
const userGetValidate = require("../validation/User.validation.js/userGet.validator");

const router = express.Router();

router.get("/", userGetValidate, checkAuthAdmin, getUser);
router.get("/:id", userGetValidate, checkAuth, getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", checkAuthAdmin, deleteUser);

module.exports = router;
