const Coupon = require("../models/Coupon");

/**
 * Validate a coupon code against a cart total and a user,
 * and return the calculated discount breakdown.
 * Does NOT mark the coupon as used — that happens at order creation
 * via markCouponUsed, inside the same transaction as the order.
 */
const validateCoupon = async ({ code, cartTotal, deliveryFee, userId }) => {
  if (!code || !code.trim()) {
    const err = new Error("Coupon code is required");
    err.statusCode = 400;
    throw err;
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    const err = new Error("Invalid coupon code");
    err.statusCode = 404;
    throw err;
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    const err = new Error("This coupon has expired");
    err.statusCode = 400;
    throw err;
  }

  if (
    coupon.totalUsageLimit !== null &&
    coupon.usedCount >= coupon.totalUsageLimit
  ) {
    const err = new Error("This coupon has reached its usage limit");
    err.statusCode = 400;
    throw err;
  }

  if (cartTotal < coupon.minOrderValue) {
    const err = new Error(
      `Add items worth ₹${(coupon.minOrderValue - cartTotal).toFixed(
        2
      )} more to use this coupon`
    );
    err.statusCode = 400;
    throw err;
  }

  if (userId) {
    const userRecord = coupon.usersUsed.find(
      (u) => u.user.toString() === userId.toString()
    );
    if (userRecord && userRecord.count >= coupon.perUserLimit) {
      const err = new Error("You've already used this coupon");
      err.statusCode = 400;
      throw err;
    }
  }

  let discountAmount = 0;
  let freeDelivery = false;

  if (coupon.discountType === "flat") {
    discountAmount = Math.min(coupon.discountValue, cartTotal);
  } else if (coupon.discountType === "percentage") {
    discountAmount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  } else if (coupon.discountType === "free_delivery") {
    freeDelivery = true;
    discountAmount = deliveryFee || 0;
  }

  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    couponId: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountAmount,
    freeDelivery,
    description: coupon.description,
  };
};

/**
 * Marks a coupon as used by a given user. Intended to be called
 * inside the same MongoDB transaction/session as order creation
 * to keep usage counts consistent with actual orders placed.
 */
const markCouponUsed = async (couponId, userId, session) => {
  const coupon = await Coupon.findById(couponId).session(session);
  if (!coupon) return;

  coupon.usedCount += 1;

  const userRecord = coupon.usersUsed.find(
    (u) => u.user.toString() === userId.toString()
  );
  if (userRecord) {
    userRecord.count += 1;
  } else {
    coupon.usersUsed.push({ user: userId, count: 1 });
  }

  await coupon.save({ session });
};

const createCoupon = async (data) => {
  const coupon = new Coupon({
    ...data,
    code: data.code.trim().toUpperCase(),
  });
  return coupon.save();
};

const getAllCoupons = async () => {
  return Coupon.find().sort({ createdAt: -1 });
};

const updateCoupon = async (id, data) => {
  if (data.code) data.code = data.code.trim().toUpperCase();
  const coupon = await Coupon.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    const err = new Error("Coupon not found");
    err.statusCode = 404;
    throw err;
  }
  return coupon;
};

const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    const err = new Error("Coupon not found");
    err.statusCode = 404;
    throw err;
  }
  return coupon;
};

module.exports = {
  validateCoupon,
  markCouponUsed,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
