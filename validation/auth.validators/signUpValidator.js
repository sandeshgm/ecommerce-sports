const { body } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const signUpValidate = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters."),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 6 characters long."),
  validate,
];

module.exports = signUpValidate;
