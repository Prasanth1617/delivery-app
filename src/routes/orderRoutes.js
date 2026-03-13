const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Ping test
router.get("/ping", (req, res) => {
  res.send("Orders route is working ✅");
});

// Create Order
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `${item.name} not found`,
        });
      }

      if (product.stock <= 0) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} item(s) left for ${product.name}`,
        });
      }
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      deliveryAddress: address,
      status: "Pending",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get My Orders
router.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    console.log("My orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;