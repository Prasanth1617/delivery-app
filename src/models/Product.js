const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    mrp:         { type: Number },
    discount:    { type: Number, default: 0 },
    category:    { type: String },
    stock:       { type: Number, default: 0 },
    image:       { type: String },
    unit:        { type: String },
    description: { type: String },
    rating:      { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);