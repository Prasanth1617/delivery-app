const express = require("express");
const Order = require("../models/Order");
console.log("Order type:", typeof Order);
console.log("Order keys:", Object.keys(Order));
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Ping test
router.get("/ping", (req, res) => {
  res.send("Orders route is working ✅");
});

// Create Order
router.post("/create", authMiddleware, async (req, res) => {
  try {

    console.log("req.user =", req.user); // 👈 put it here

    const { items, totalAmount, address } = req.body;

    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      deliveryAddress: address,
    });

    res.status(201).json(order);

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