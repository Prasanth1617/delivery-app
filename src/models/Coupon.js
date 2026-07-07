const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["flat", "percentage", "free_delivery"],
      required: true,
    },
    discountValue: {
      // for "flat" -> rupees, for "percentage" -> 0-100, for "free_delivery" -> 0 (unused)
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      // cap for percentage discounts, e.g. "10% off up to ₹100"
      type: Number,
      default: null,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalUsageLimit: {
      // total times this coupon can be used across all users (null = unlimited)
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    perUserLimit: {
      // how many times a single user may use this coupon
      type: Number,
      default: 1,
    },
    usersUsed: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 1 },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1, isActive: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
