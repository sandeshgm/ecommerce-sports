const { query } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const orderValidate = [
  query("order")
    .optional()
    .isIn(["asc", "desc", ""])
    .withMessage("Order must be either 'asc' or 'desc'or empty"),
  validate,
];

module.exports = orderValidate;
