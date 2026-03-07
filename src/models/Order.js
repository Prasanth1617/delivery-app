const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

// ✅ IMPORTANT: export the model directly
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);