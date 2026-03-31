const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");

// ── helpers ──────────────────────────────────────
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ── register ──────────────────────────────────────
async function register({ name, phone, password, address, secretAnswer }) {
  if (!secretAnswer || !secretAnswer.trim())
    throw makeError("Security answer is required");

  const exists = await User.findOne({ phone });
  if (exists) throw makeError("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedAnswer   = await bcrypt.hash(secretAnswer.trim().toLowerCase(), 10);

  const user = await User.create({
    name,
    phone,
    password: hashedPassword,
    address,
    role: "user",
    secretAnswer: hashedAnswer,
  });

  return {
    id:    user._id,
    name:  user.name,
    phone: user.phone,
    role:  user.role,
  };
}

// ── login ─────────────────────────────────────────
async function login({ phone, password }) {
  const user = await User.findOne({ phone });
  if (!user) throw makeError("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw makeError("Invalid credentials");

  const token = signToken({ id: user._id, role: user.role });

  return {
    token,
    role: user.role,
    user: {
      id:      user._id,
      name:    user.name,
      phone:   user.phone,
      address: user.address,
      role:    user.role,
    },
  };
}

// ── get profile ───────────────────────────────────
async function getProfile(userId) {
  const user = await User.findById(userId).select("-password -secretAnswer");
  if (!user) throw makeError("User not found", 404);
  return user;
}

// ── update address ────────────────────────────────
async function updateAddress(userId, address) {
  if (!address || !address.trim())
    throw makeError("Address is required");

  await User.findByIdAndUpdate(userId, { address: address.trim() });
  return { message: "Address updated successfully" };
}

// ── verify secret answer ──────────────────────────
async function verifySecret({ phone, secretAnswer }) {
  if (!phone || !secretAnswer)
    throw makeError("Phone and security answer are required");

  const user = await User.findOne({ phone });
  if (!user) throw makeError("No account found with this phone number", 404);

  if (!user.secretAnswer)
    throw makeError("This account has no security question. Please contact support.");

  const isMatch = await bcrypt.compare(
    secretAnswer.trim().toLowerCase(),
    user.secretAnswer
  );
  if (!isMatch) throw makeError("Incorrect security answer");

  const resetToken = jwt.sign(
    { id: user._id, purpose: "reset" },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  return { message: "Identity verified", resetToken };
}

// ── reset password ────────────────────────────────
async function resetPassword({ resetToken, newPassword }) {
  if (!resetToken || !newPassword)
    throw makeError("Token and new password are required");

  if (newPassword.length < 8)
    throw makeError("Password must be at least 8 characters");

  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch {
    throw makeError("Reset session expired. Please start again.");
  }

  if (decoded.purpose !== "reset")
    throw makeError("Invalid reset token");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

  return { message: "Password reset successfully" };
}

module.exports = {
  register,
  login,
  getProfile,
  updateAddress,
  verifySecret,
  resetPassword,
};