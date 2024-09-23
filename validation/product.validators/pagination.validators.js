const { query } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const paginationValidate = [
  query("limit")
    .optional()
    .isNumeric()
    .withMessage("Limit should be numeric valu")
    .isInt({ min: 1 })
    .withMessage("Limit should be a positive integer greater than 0"),
  query("page")
    .optional()
    .isNumeric()
    .withMessage("page should be a integer value")
    .isInt({ min: 1 })
    .withMessage("Page should be a positive integer greater than 0"),
  validate,
];
module.exports = paginationValidate;
