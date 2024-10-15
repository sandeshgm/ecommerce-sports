const express = require("express");
const { checkAuth } = require("../middleware/checkAuth.middleware");
const {
  createOrder,
  getOrder,
} = require("../controllers/ordersControllers/order.controllers");
const router = express.Router();

router.post("/order", checkAuth, createOrder);
router.get("/order", checkAuth, getOrder);

module.exports = router;
