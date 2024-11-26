const Order = require("../../models/orders.models");
const Product = require("../../models/products.models");

const createOrder = async (req, res) => {
  try {
    //console.log(req.body);
    const products = req.body; // Expecting an array of { product, quantity }
    console.log(products);
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Products array is required and cannot be empty.",
      });
    }

    // Fetch product details based on product IDs
    const productIds = products.map((item) => item.product);
    const productDetails = await Product.find({ _id: { $in: productIds } });

    // Validate all product IDs
    if (productDetails.length !== products.length) {
      return res.status(400).json({
        message: "Some products are invalid or do not exist.",
      });
    }

    // Calculate the total price
    let totalPrice = 0;
    products.forEach((item) => {
      const product = productDetails.find(
        (p) => p._id.toString() === item.product
      );
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    });

    // Create the order
    const order = await Order.create({
      user: req.authUser._id,
      products, // Save products with their quantities
      totalPrice, // Save the calculated total price
    });

    res.json({
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order.",
      error: error.message,
    });
  }
  //   await Order.create({
  //     user: req.authUser._id,
  //     ...req.body,
  //     totalPrice: 0,
  //   });
  //   res.json({
  //     message: "Order created Successfully",
  //   });
};

const getOrder = async (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  //console.log(req.body.limit);

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const filter = {
    user: req.authUser._id,
  };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const orders = await Order.find(filter)
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    message: " Orders fetched Successfully",
    data: {
      page: pageNum,
      total,
      data: orders,
      limit: limitNum,
    },
  });
};

module.exports = {
  createOrder,
  getOrder,
};
