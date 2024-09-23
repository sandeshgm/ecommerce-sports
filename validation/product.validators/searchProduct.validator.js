const { query } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const searchValidate = [
  query("search")
    .optional()
    .isAlpha()
    .withMessage("Searching should be in String"),
  validate,
];

module.exports = searchValidate;
