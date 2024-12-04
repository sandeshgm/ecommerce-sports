const express = require("express");
const {
  checkAuth,
  checkAuthAdmin,
} = require("../middleware/checkAuth.middleware");
const {
  createOrder,
  getOrder,
  deleteOrder,
} = require("../controllers/ordersControllers/order.controllers");
const router = express.Router();

router.post("/create", checkAuth, createOrder);

router.get("/get", checkAuth, getOrder);
router.delete("/:id", checkAuthAdmin, deleteOrder);

module.exports = router;
