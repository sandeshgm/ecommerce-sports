const Product = require("../models/products.models");

const addProducts = async (req, res) => {
  await Product.create({
    name: req.body.name,
    price: req.body.price,
    image: req.file.filename,
    description: req.body.description,
    featured: req.body.featured,
  });
  res.status(200).json({
    message: "Product added successfully",
  });
};

const getProducts = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;

  const sortByFilter = {};
  if (req.query.order) {
    sortByFilter.price = req.query.order; //here either desc or asc hooo
  }

  const filter = { name: new RegExp(req.query.search, "i") }; // searhc by name product name

  if (req.query.minPrice && req.query.maxPrice) {
    filter.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice }; // here minimum price and maximum price
  }
  const products = await Product.find(filter)
    .sort(sortByFilter)
    .limit(limit)
    .skip((page - 1) * limit);

  const count = await Product.countDocuments(filter);
  res.status(200).json({
    message: "Products fetched successfully",
    data: products,
    total: count,
    limit,
    page,
  });
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    message: "Single data fetched successfully",
    data: product,
  });
};

const updateProducts = async (req, res) => {
  await Product.updateOne({ _id: req.params.id }, req.body);
  res.status(200).json({
    message: "Update successfully",
  });
};

const deleteProducts = async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({
    messageg: "Deleted successfully",
  });
};

const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ featured: true }).limit(4);
  res.status(200).json({
    message: "Product fetched successfully",
    data: products,
  });
};

const getLatestPRoducts = async (req, res) => {
  const products = await Product.find().sort({ createAt: "desc" }).limit(4);
  res.status(200).json({
    message: "Product fetched successfully",
    data: products,
  });
};

module.exports = {
  addProducts,
  getProducts,
  getProductById,
  updateProducts,
  deleteProducts,
  getFeaturedProducts,
  getLatestPRoducts,
};
