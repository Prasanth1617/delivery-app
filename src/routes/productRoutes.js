const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add product (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, category, stock, image } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      stock,
      image
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;