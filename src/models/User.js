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
    address:      { type: String },
    addresses: [
      {
        name:     { type: String, required: true },
        phone:    { type: String, required: true },
        street:   { type: String, required: true },
        area:     { type: String, required: true },
        landmark: { type: String, default: "" },
        pincode:  { type: String, default: "" },
      }
    ],
    secretAnswer: { type: String, default: "" },
    walletBalance: { type: Number, default: 0 },
    referralCode:  { type: String },
    loyaltyPoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);