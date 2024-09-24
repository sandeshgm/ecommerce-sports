const { query } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const userGetValidate = [
  query("name").optional().isAlpha().withMessage("Name should be String.."),
  validate,
];

module.exports = userGetValidate;
