const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const totalProducts = await Product.countDocuments();

    const revenueData = await Order.find({ status: "Delivered" });
    const totalRevenue = revenueData.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;