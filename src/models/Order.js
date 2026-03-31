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
    paymentStatus: {
      type:    String,
      enum:    ["Pending", "Paid", "Failed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

// Auto calculate finalAmount before saving
orderSchema.pre("save", function (next) {
  this.finalAmount = (this.totalAmount + this.deliveryFee) - this.discountAmount;
  next();
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);