const authService = require("../services/authService");
const User = require("../models/User");

const addAddress = async (req, res, next) => {
  try {
    const { name, phone, street, area, landmark, pincode } = req.body;
    if (!name || !phone || !street || !area) {
      return res.status(400).json({ message: "Name, phone, street and area are required" });
    }
    const user = await User.findById(req.user._id);
    if (!user.addresses) user.addresses = [];
    user.addresses.push({ name, phone, street, area, landmark: landmark || "", pincode: pincode || "" });
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const idx = parseInt(req.params.idx);
    const user = await User.findById(req.user._id);
    if (!user.addresses || idx < 0 || idx >= user.addresses.length) {
      return res.status(404).json({ message: "Address not found" });
    }
    user.addresses.splice(idx, 1);
    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ message: "User registered successfully", user: data });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) { next(err); }
};

const getProfile = async (req, res, next) => {
  try {
    const data = await authService.getProfile(req.user.id);
    res.json(data);
  } catch (err) { next(err); }
};

const updateAddress = async (req, res, next) => {
  try {
    const data = await authService.updateAddress(req.user.id, req.body.address);
    res.json(data);
  } catch (err) { next(err); }
};

const verifySecret = async (req, res, next) => {
  try {
    const data = await authService.verifySecret(req.body);
    res.json(data);
  } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
  try {
    const data = await authService.resetPassword(req.body);
    res.json(data);
  } catch (err) { next(err); }
};

module.exports = {
  register,
  login,
  getProfile,
  updateAddress,
  addAddress,
  deleteAddress,
  verifySecret,
  resetPassword
};