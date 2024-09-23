const { query } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const priceMinMaxValidate = [
  query("minPrice")
    .optional()
    .isNumeric()
    .withMessage("Min max should be numberic value")
    .isInt({ min: 0 })
    .withMessage("Price should be Positive"),
  query("maxPrice")
    .optional()
    .isNumeric()
    .withMessage("Min max should be numberic value")
    .isInt({ min: 0 })
    .withMessage("Price should be Positive"),
  validate,
];

module.exports = priceMinMaxValidate;
