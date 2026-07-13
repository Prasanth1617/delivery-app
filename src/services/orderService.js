const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order   = require("../models/Order");
const Product = require("../models/Product");
const couponService = require("./couponService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const createOrder = async ({ userId, items, totalAmount, subtotal, deliveryFee, discountAmount: clientDiscount, address, paymentMethod, couponCode, razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
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

    const finalTotal = Math.max(0, rawCartTotal + rawDeliveryFee - discountAmount);

    const isOnline = paymentMethod === "Online";

    const [order] = await Order.create(
      [{
        userId,
        items,
        totalAmount: finalTotal,
        deliveryFee: rawDeliveryFee,
        deliveryAddress: address.trim(),
        status:        "Pending",
        paymentMethod: paymentMethod || "COD",
        paymentStatus: isOnline ? "Paid" : "Pending",
        discountAmount,
        couponCode: appliedCouponCode,
        ...(isOnline && { razorpayOrderId, razorpayPaymentId, razorpaySignature }),
      }],
      { session }
    );

    await session.commitTransaction();
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

module.exports = {
  createOrder,
  getMyOrders,
  createRazorpayOrder,
  verifyPaymentSignature
};