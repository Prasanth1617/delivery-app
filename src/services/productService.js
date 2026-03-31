const Product = require("../models/Product");

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getAllProducts = async () => {
  return await Product.find();
};

const createProduct = async ({ name, price, category, stock, image }) => {
  return await Product.create({ name, price, category, stock, image });
};

const updateProduct = async (id, fields) => {
  const product = await Product.findByIdAndUpdate(id, fields, { new: true });
  if (!product) throw makeError("Product not found", 404);
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw makeError("Product not found", 404);
  return { message: "Product deleted successfully" };
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};