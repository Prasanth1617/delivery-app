const Order = require("../models/Order");
const User  = require("../models/User");

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const ALLOWED_STATUSES = ["Pending", "Packed", "Out for Delivery", "Delivered", "Cancelled"];
const POINTS_PER_50_RUPEES = 2;

const getAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

const updateOrderStatus = async (orderId, status) => {
  if (!ALLOWED_STATUSES.includes(status))
    throw makeError("Invalid status");

  const existingOrder = await Order.findById(orderId);
  if (!existingOrder) throw makeError("Order not found", 404);

  const wasAlreadyDelivered = existingOrder.status === "Delivered";

  existingOrder.status = status;
  await existingOrder.save();

  // Award loyalty points only on the transition INTO "Delivered" (avoids double-crediting
  // if an admin re-saves the same status or toggles it back and forth)
  if (status === "Delivered" && !wasAlreadyDelivered) {
    const pointsEarned = Math.floor(existingOrder.totalAmount / 50) * POINTS_PER_50_RUPEES;
    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(existingOrder.userId, { $inc: { loyaltyPoints: pointsEarned } });
    }
  }

  return existingOrder;
};

module.exports = {
  getAllOrders,
  updateOrderStatus
};