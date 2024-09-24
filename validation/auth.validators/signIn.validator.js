const { body } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const signInValidate = [
  body("email").notEmpty().withMessage("Please enter your email address.."),
  body("password").notEmpty(),
  validate,
];

module.exports = signInValidate;
