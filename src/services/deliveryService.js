const adminService = require("./adminService");
const Order = require("../models/Order");
const User  = require("../models/User");

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getMyOrders = async (staffId) => {
  return await Order.find({ deliveryStaffId: staffId }).sort({ createdAt: -1 });
};

const updateMyOrderStatus = async (staffId, orderId, status) => {
  const ALLOWED = ["Out for Delivery", "Delivered"];
  if (!ALLOWED.includes(status))
    throw makeError("You can only set status to 'Out for Delivery' or 'Delivered'");

  const order = await Order.findOne({ _id: orderId, deliveryStaffId: staffId });
  if (!order) throw makeError("Order not found or not assigned to you", 404);

  return await adminService.updateOrderStatus(orderId, status);
};

const updateLocation = async (staffId, lat, lng) => {
  if (typeof lat !== "number" || typeof lng !== "number")
    throw makeError("Valid lat and lng are required");

  await User.findByIdAndUpdate(staffId, {
    currentLocation: { lat, lng, updatedAt: new Date() }
  });

  return { message: "Location updated" };
};

module.exports = { getMyOrders, updateMyOrderStatus, updateLocation };
