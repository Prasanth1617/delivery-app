const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  label:     { type: String, default: "Home" },
  address:   { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    phone:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user"
    },
    // Keep old single address for backward compatibility
    address:      { type: String },
    // New multiple addresses array
    addresses:    [addressSchema],
    secretAnswer: { type: String, default: "" },
    // Future features
    walletBalance: { type: Number, default: 0 },
    referralCode:  { type: String },
    loyaltyPoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);