const authService = require("../services/authService");

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
  verifySecret,
  resetPassword
};