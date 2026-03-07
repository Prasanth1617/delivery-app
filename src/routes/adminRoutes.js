const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

router.get("/orders", authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/orders/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      "Pending",
      "Packed",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;