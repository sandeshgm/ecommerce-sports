const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "productsImage/");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, Date.now() + "." + fileExtension);
  },
});
const upload = multer({ storage: storage });

const {
  addProducts,
  getProducts,
  getProductById,
  deleteProducts,
  updateProducts,
  getFeaturedProducts,
  getLatestPRoducts,
} = require("../controllers/productControllers/product.controllers");
const idValidate = require("../validation/product.validators/product-id.validators");
const searchValidate = require("../validation/product.validators/searchProduct.validator");
const orderValidate = require("../validation/product.validators/sortByOrder.validator");
const paginationValidate = require("../validation/product.validators/pagination.validators");
const priceMinMaxValidate = require("../validation/product.validators/maxmin-price.validators");
const {
  addProductsValidators,
  imageRequiredValidator,
} = require("../validation/product.validators/addingProducts.validator");
const { checkAuthAdmin } = require("../middleware/checkAuth.middleware");

router.post(
  "/",
  checkAuthAdmin,
  upload.single("image"),
  addProductsValidators,
  imageRequiredValidator,
  addProducts
);
router.get("/featured", getFeaturedProducts);
router.get("/latest", getLatestPRoducts);
router.get(
  "/",
  searchValidate,
  orderValidate,
  paginationValidate,
  priceMinMaxValidate,
  getProducts
);
router.get("/:id", idValidate, getProductById);
router.patch("/:id", checkAuthAdmin, idValidate, updateProducts);
router.delete("/:id", checkAuthAdmin, idValidate, deleteProducts);

module.exports = router;
