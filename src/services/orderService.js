const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order   = require("../models/Order");
const Product = require("../models/Product");
const User    = require("../models/User");
const couponService = require("./couponService");
const whatsappService = require("./whatsappService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const createOrder = async ({ userId, items, totalAmount, subtotal, deliveryFee, discountAmount: clientDiscount, address, deliveryLat, deliveryLng, paymentMethod, couponCode, razorpayOrderId, razorpayPaymentId, razorpaySignature, pointsUsed }) => {
  if (!items || items.length === 0)
    throw makeError("Cart is empty");

  if (!address || !address.trim())
    throw makeError("Delivery address is required");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product)
        throw makeError(`${item.name} not found`, 404);

      if (product.stock < item.quantity)
        throw makeError(`Only ${product.stock} left for ${item.name}`);

      product.stock -= item.quantity;
      await product.save({ session });
    }

    const rawCartTotal = subtotal || totalAmount;
    const rawDeliveryFee = deliveryFee || 0;

    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const couponResult = await couponService.validateCoupon({
        code: couponCode,
        cartTotal: rawCartTotal,
        deliveryFee: rawDeliveryFee,
        userId,
      });

      discountAmount = couponResult.discountAmount;
      appliedCouponCode = couponResult.code;

      await couponService.markCouponUsed(
        couponResult.couponId,
        userId,
        session
      );
    }

    const amountAfterCoupon = Math.max(0, rawCartTotal + rawDeliveryFee - discountAmount);

    // Server-side points validation — never trust the frontend's math
    let pointsDiscount = 0;
    let actualPointsUsed = 0;

    if (pointsUsed && pointsUsed > 0) {
      const user = await User.findById(userId).session(session);
      if (!user) throw makeError("User not found", 404);

      const requestedDiscount = Math.floor(pointsUsed / 10);
      const maxAffordableDiscount = Math.floor(user.loyaltyPoints / 10);

      pointsDiscount = Math.min(requestedDiscount, maxAffordableDiscount, amountAfterCoupon);
      actualPointsUsed = pointsDiscount * 10;

      if (actualPointsUsed > 0) {
        user.loyaltyPoints -= actualPointsUsed;
        await user.save({ session });
      }
    }

    const finalTotal = Math.max(0, amountAfterCoupon - pointsDiscount);

    const isOnline = paymentMethod === "Online";

    const [order] = await Order.create(
      [{
        userId,
        items,
        totalAmount: finalTotal,
        deliveryFee: rawDeliveryFee,
        deliveryAddress: address.trim(),
        deliveryLat,
        deliveryLng,
        status:        "Pending",
        paymentMethod: paymentMethod || "COD",
        paymentStatus: isOnline ? "Paid" : "Pending",
        discountAmount,
        couponCode: appliedCouponCode,
        pointsUsed: actualPointsUsed,
        pointsDiscount,
        ...(isOnline && { razorpayOrderId, razorpayPaymentId, razorpaySignature }),
      }],
      { session }
    );

    await session.commitTransaction();

    // Fire-and-forget: don't block order response on WhatsApp delivery
    whatsappService.sendOrderAlert(order);

    return order;

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getMyOrders = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

const createRazorpayOrder = async (amount) => {
  if (!amount || amount <= 0)
    throw makeError("Invalid amount");

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return razorpayOrder;
};

const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature)
    throw makeError("Payment verification failed", 400);

  return true;
};

const generateOrderQR = async (orderId, staffId) => {
  const order = await Order.findOne({ _id: orderId, deliveryStaffId: staffId });
  if (!order) throw makeError("Order not found or not assigned to you", 404);

  if (order.paymentMethod !== "COD")
    throw makeError("This order is not Cash on Delivery");

  if (order.paymentStatus === "Paid")
    throw makeError("This order is already paid");

  if (!process.env.UPI_ID)
    throw makeError("UPI ID not configured on server");

  const upiId = process.env.UPI_ID;
  const payeeName = process.env.UPI_PAYEE_NAME || "V2 Mart";
  const note = `Order ${order._id.toString().slice(-8).toUpperCase()}`;

  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${order.totalAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;

  return { qrImageUrl, amount: order.totalAmount, upiUri };
};

const markCodOrderPaid = async (orderId, staffId) => {
  const order = await Order.findOne({ _id: orderId, deliveryStaffId: staffId });
  if (!order) throw makeError("Order not found or not assigned to you", 404);

  order.paymentStatus = "Paid";
  await order.save();

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  createRazorpayOrder,
  verifyPaymentSignature,
  generateOrderQR,
  markCodOrderPaid
};