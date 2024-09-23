const { param } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const idValidate = [
  param("id").optional().isMongoId().withMessage("Invalid id"),
  validate,
];

module.exports = idValidate;
