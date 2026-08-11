const bcrypt = require("bcryptjs");
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
  return await Order.find().populate("deliveryStaffId", "name phone").sort({ createdAt: -1 });
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

const createDeliveryStaff = async ({ name, phone, password }) => {
  if (!name || !phone || !password)
    throw makeError("Name, phone and password are required");

  const exists = await User.findOne({ phone });
  if (exists) throw makeError("A user with this phone number already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const staff = await User.create({
    name,
    phone,
    password: hashedPassword,
    role: "delivery"
  });

  return { id: staff._id, name: staff.name, phone: staff.phone, role: staff.role };
};

const getDeliveryStaff = async () => {
  return await User.find({ role: "delivery" }).select("-password -secretAnswer");
};

const assignOrderToStaff = async (orderId, staffId) => {
  const staff = await User.findOne({ _id: staffId, role: "delivery" });
  if (!staff) throw makeError("Delivery staff not found", 404);

  const order = await Order.findById(orderId);
  if (!order) throw makeError("Order not found", 404);

  order.deliveryStaffId = staffId;
  await order.save();

  return order;
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  createDeliveryStaff,
  getDeliveryStaff,
  assignOrderToStaff
};