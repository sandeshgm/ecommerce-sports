require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();
const port = 3003;
const cors = require("cors");

app.use(express.json());
app.use(express.static("productsImage"));
app.use(express.static("userImage"));

const connectDb = require("./config/db");
//.log("MongoDB URL:", process.env.MONGO_DB_URL);
const productsRoutes = require("./routes/products.routes");
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
connectDb();

app.use(cors());

app.use("/api/products", productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

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
