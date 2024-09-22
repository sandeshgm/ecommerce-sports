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
} = require("../controllers/product.controllers");

router.get("/featured", getFeaturedProducts);
router.get("/latest", getLatestPRoducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), addProducts);
router.patch("/:id", updateProducts);
router.delete("/:id", deleteProducts);

module.exports = router;
