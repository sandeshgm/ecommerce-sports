const Order = require("../../models/orders.models");
const Product = require("../../models/products.models");

const createOrder = async (req, res) => {
 
    const order = await Order.create({
      user: req.authUser._id,
      ...req.body,
      totalPrice:0,
    });
    res.json({
      message: "Order created Successfully",
      order,
    });
}

const getOrder = async (req, res) => {
  const { page = 1, limit = 5 } = req.body;

  const filter = {
    user: req.authUser._id,
  };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const orders = await Order.find(filter)
    .limit(limit)
    .skip((page - 1) * limit ?? 10);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    message: " Orders fetched Successfully",
    data: {
      page,
      total,
      data: orders,
    },
  });
};

module.exports = {
  createOrder,
  getOrder,
};
