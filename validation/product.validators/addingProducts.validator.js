const { body } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const imageRequiredValidator = (req, res, next) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Image file is required" }] });
  }
  next();
};

const addProductsValidators = [
  body("name").notEmpty().withMessage("Please, Enter product name"),
  body("price").notEmpty().withMessage("Please, Enter product price"),
  body("featured")
    .notEmpty()
    .isBoolean()
    .withMessage("featured must be either true or false "),
  validate,
];

module.exports = { addProductsValidators, imageRequiredValidator };
