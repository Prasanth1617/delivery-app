const mongoose = require("mongoose");
const Order   = require("../models/Order");
const Product = require("../models/Product");
const couponService = require("./couponService");

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const createOrder = async ({ userId, items, totalAmount, subtotal, deliveryFee, discountAmount: clientDiscount, address, paymentMethod, couponCode }) => {
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

    const [order] = await Order.create(
      [{
        userId,
        items,
        totalAmount: finalTotal,
        deliveryFee: rawDeliveryFee,
        deliveryAddress: address.trim(),
        status:        "Pending",
        paymentMethod: paymentMethod || "COD",
        paymentStatus: "Pending",
        discountAmount,
        couponCode: appliedCouponCode,
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

module.exports = {
  createOrder,
  getMyOrders
};