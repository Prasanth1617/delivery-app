const Order = require("../models/Order");

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const ALLOWED_STATUSES = ["Pending", "Packed", "Out for Delivery", "Delivered", "Cancelled"];

const getAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

const updateOrderStatus = async (orderId, status) => {
  if (!ALLOWED_STATUSES.includes(status))
    throw makeError("Invalid status");

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) throw makeError("Order not found", 404);
  return order;
};

module.exports = {
  getAllOrders,
  updateOrderStatus
};