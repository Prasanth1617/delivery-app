const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true },
  image:     { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      required: true
    },
    items:           [orderItemSchema],
    totalAmount:     { type: Number, required: true },
    deliveryFee:     { type: Number, default: 0 },
    discountAmount:  { type: Number, default: 0 },
    finalAmount:     { type: Number },
    couponCode:      { type: String },
    deliveryAddress: { type: String, required: true },
    status: {
      type:    String,
      enum:    ["Pending", "Packed", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending"
    },
    paymentMethod: {
      type:    String,
      enum:    ["COD", "Online"],
      default: "COD"
    },
    deliveryStaffId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "User",
      default: null
    },
    paymentStatus: {
      type:    String,
      enum:    ["Pending", "Paid", "Failed"],
      default: "Pending"
    },
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    pointsUsed:     { type: Number, default: 0 },
    pointsDiscount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// finalAmount mirrors totalAmount, which is already the fully-calculated
// final price (subtotal + delivery - coupon discount - points discount),
// computed once in orderService.js at order creation time.
orderSchema.pre("save", function (next) {
  this.finalAmount = this.totalAmount;
  next();
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);