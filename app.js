require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();
const port = 3003;
const cors = require("cors");
const cookiePraser = require("cookie-parser");

app.use(cors());
app.use(cookiePraser());

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")(
  "sk_test_..."
);


const endpointSecret = "whsec_aa1a6680b21a4f31b9a7af9f824969a0a36bb1ee2c9e2a9334904adc3a2fffde";

// This example uses Express to receive webhooks


// Match the raw body to content type application/json
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!");
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log("PaymentMethod was attached to a Customer!");
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

app.use(express.json());
app.use(express.static("productsImage"));
app.use(express.static("userImage"));

const connectDb = require("./config/db");
//.log("MongoDB URL:", process.env.MONGO_DB_URL);
const productsRoutes = require("./routes/products.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");

connectDb();

app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Done",
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Route not found!",
  });
});

app.use("/", (err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    message: "Something went wrong",
  });
});

app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
