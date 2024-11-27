// routes/esewa.routes.js
const express = require("express");
const router = express.Router();
const {
  getEsewaPaymentHash,
  verifyEsewaPayment,
} = require("../controllers/esewa/esewa");
const Product = require("../models/products.models");
const PurchasedItem = require("../models/purchaseItem.model");

const mongoose = require("mongoose");
router.post("/initialize-esewa", async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    // Store purchased items data
    const purchasedItems = [];

    // Iterate over the items in the cart
    for (const item of items) {
      // Validate if the product exists and the price matches
      const product = await Product.findOne({
        _id: item.itemId,
        price: item.price,
      });

      if (!product) {
        return res.status(400).send({
          success: false,
          message: `Item with ID ${item.itemId} not found or price mismatch.`,
        });
      }

      // Create a new PurchasedItem entry
      const purchasedItemData = await PurchasedItem.create({
        product: product._id, // Pass the correct product reference (product._id)
        totalPrice: item.price * item.quantity, // Calculate the total price
        paymentMethod: "esewa", // Payment method as esewa
        status: "pending", // Set initial status as pending
      });

      purchasedItems.push({
        ...purchasedItemData.toObject(), // Include _id and other fields
        product_code: product.product_code, // Add the product code to purchasedItems
      });
    }

    // Call eSewa to initiate the payment (assuming getEsewaPaymentHash is set up)
    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: purchasedItems.map((item) => item._id).join(","),
    });

    // Respond with payment details and purchased items data
    res.json({
      success: true,
      payment: paymentInitiate,
      purchasedItems,
    });
  } catch (error) {
    console.error("Error during eSewa initialization:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/complete-payment", async (req, res) => {
  const { data } = req.query; // Data received from eSewa's redirect

  try {
    // Verify payment with eSewa
    const paymentInfo = await verifyEsewaPayment(data);

    // Find the purchased item using the transaction UUID
    const purchasedItemData = await PurchasedItem.findById(
      paymentInfo.response.transaction_uuid
    );

    if (!purchasedItemData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Respond with success message
    res.json({
      success: true,
      message: "Payment successful",
      paymentInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
});

module.exports = router;
