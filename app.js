require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();
const port = 3003;
const cors = require("cors");
const cookiePraser = require("cookie-parser");

app.use(cors());
app.use(cookiePraser());

const stripe = require("stripe")(
  "sk_test_51Q2veRFdsyKghVpvJerVaUlQTZ4CigvqrcmZ9GuK1hJnXh5q22MyXY8M00O1NUex1c5RmDrT4I7FMAPEZWhrWOcu00O8r16OIk"
);

const endpointSecret =
  "whsec_aa1a6680b21a4f31b9a7af9f824969a0a36bb1ee2c9e2a9334904adc3a2fffde";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    // if (!sig) {
    //   console.error("Missing Stripe signature header");
    //   return response.status(400).send("Missing Stripe signature header");
    // }

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log(event);

    switch (event.type) {
      case "checkout.session.completed":
        const PaymentIntentSucceeded = event.data.object;
        //console.log(PaymentIntentSucceeded.metadata);
        const orderId = PaymentIntentSucceeded.metadata.orderId;
        console.log({ orderId });
        await Order.updateOne(
          { _id: orderId },
          {
            status: "completed",
          }
        );
        console.log("PaymentIntent was successful!");
        console.log("payment", PaymentIntentSucceeded);
        break;
      default:
        break;
    }

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
const Order = require("./models/orders.models");

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

// server.on("clientError", (err, socket) => {
//   console.log("Handling clientError event...");
//   console.error("Client error encountered:", err.message);

//   // Check if the socket is already destroyed before doing anything
//   if (socket.destroyed) {
//     console.log("Socket is already destroyed. Skipping further processing.");
//   } else {
//     console.log("Socket is not destroyed, proceeding with error handling...");

//     try {
//       // Send a simple 400 Bad Request response to the client
//       socket.end(
//         "HTTP/1.1 400 Bad Request\r\nContent-Type: text/plain\r\n\r\nInvalid request method or format."
//       );

//       // Destroy the socket after sending the response to avoid multiple actions
//       socket.destroy();
//       console.log("Socket destroyed after sending the response.");
//     } catch (error) {
//       console.error("Error while handling client error:", error.message);
//     }
//   }
// });
