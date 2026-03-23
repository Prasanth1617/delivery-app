const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, address, secretAnswer } = req.body; // ✅ ADDED secretAnswer

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!secretAnswer || !secretAnswer.trim()) {
      return res.status(400).json({ message: "Security answer is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Hash secret answer too for security
    const hashedAnswer = await bcrypt.hash(
      secretAnswer.trim().toLowerCase(),
      10
    );

    const newUser = await User.create({
      name,
      phone,
      password: hashedPassword,
      address,
      role: "user",
      secretAnswer: hashedAnswer, // ✅ ADDED
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -secretAnswer");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update delivery address
router.put("/update-address", authMiddleware, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || !address.trim()) {
      return res.status(400).json({ message: "Address is required" });
    }

    await User.findByIdAndUpdate(req.user.id, { address: address.trim() });

    res.json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADDED - Step 1: Verify phone + secret answer
router.post("/verify-secret", async (req, res) => {
  try {
    const { phone, secretAnswer } = req.body;

    if (!phone || !secretAnswer) {
      return res.status(400).json({ message: "Phone and security answer are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "No account found with this phone number" });
    }

    // Old users won't have secretAnswer — handle gracefully
    if (!user.secretAnswer) {
      return res.status(400).json({ message: "This account was created before security questions were added. Please contact support." });
    }

    const isMatch = await bcrypt.compare(
      secretAnswer.trim().toLowerCase(),
      user.secretAnswer
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect security answer ❌" });
    }

    // ✅ Return a short-lived reset token
    const resetToken = jwt.sign(
      { id: user._id, purpose: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" } // only valid 10 minutes
    );

    res.json({
      message: "Identity verified ✅",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADDED - Step 2: Reset password using reset token
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Reset session expired. Please start again." });
    }

    // Make sure it's a reset token not a login token
    if (decoded.purpose !== "reset") {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "Password reset successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;