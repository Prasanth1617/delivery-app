const Order   = require("../models/Order");
const Product = require("../models/Product");

const getStats = async () => {
  const [orderStats, totalProducts, revenueResult] = await Promise.all([
    Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ])
  ]);

  const statusMap = {};
  orderStats.forEach(s => { statusMap[s._id] = s.count; });

  return {
    totalOrders:     Object.values(statusMap).reduce((a, b) => a + b, 0),
    pendingOrders:   statusMap["Pending"]   || 0,
    deliveredOrders: statusMap["Delivered"] || 0,
    totalProducts,
    totalRevenue:    revenueResult[0]?.total || 0,
  };
};

module.exports = {
  getStats
};