const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add product (admin only) ✅ FIXED
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, price, category, stock, image } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      stock,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product (admin only) ✅ FIXED
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
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

// Update product (admin only) ✅ FIXED
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, price, category, stock, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        category,
        stock,
        image,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.log("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;