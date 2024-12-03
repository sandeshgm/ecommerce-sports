const Order = require("../../models/orders.models");
const Product = require("../../models/products.models");
const stripe = require("stripe")(
  "sk_test_51Q2veRFdsyKghVpvJerVaUlQTZ4CigvqrcmZ9GuK1hJnXh5q22MyXY8M00O1NUex1c5RmDrT4I7FMAPEZWhrWOcu00O8r16OIk"
);

const createOrder = async (req, res) => {
  const line_items = [];
  let totalPrice = 0;
  //console.log(req.body);
  for (let { product, quantity } of req.body) {
    const productInfo = await Product.findById(product);
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: productInfo.price * 100,
      product_data: {
        name: productInfo.name,
      },
    });
    totalPrice += productInfo.price * quantity;
    line_items.push({
      price: price.id,
      quantity,
    });
  }

  const newOrder = new Order({
    user: req.authUser._id,
    ...req.body,
    totalPrice,
  });

  const order = await newOrder.save();

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:5173/success",
    line_items,
    mode: "payment",
    metadata: {
      orderId: order._id.toString(),
    },
  });

  //console.log(order._id);
  //console.log(session);

  res.json({
    message: "Order created Successfully",
    url: session.url,
  });
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
