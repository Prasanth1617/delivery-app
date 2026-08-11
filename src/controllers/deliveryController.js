const deliveryService = require("../services/deliveryService");

const getMyOrders = async (req, res, next) => {
  try {
    const staffId = req.user._id || req.user.id;
    const orders = await deliveryService.getMyOrders(staffId);
    res.json(orders);
  } catch (err) { next(err); }
};

const updateMyOrderStatus = async (req, res, next) => {
  try {
    const staffId = req.user._id || req.user.id;
    const order = await deliveryService.updateMyOrderStatus(staffId, req.params.id, req.body.status);
    res.json(order);
  } catch (err) { next(err); }
};

const updateLocation = async (req, res, next) => {
  try {
    const staffId = req.user._id || req.user.id;
    const data = await deliveryService.updateLocation(staffId, req.body.lat, req.body.lng);
    res.json(data);
  } catch (err) { next(err); }
};

const generateQR = async (req, res, next) => {
  try {
    const staffId = req.user._id || req.user.id;
    const data = await deliveryService.generateQR(staffId, req.params.id);
    res.json(data);
  } catch (err) { next(err); }
};

const markOrderPaid = async (req, res, next) => {
  try {
    const staffId = req.user._id || req.user.id;
    const order = await deliveryService.markOrderPaid(staffId, req.params.id);
    res.json(order);
  } catch (err) { next(err); }
};

module.exports = { getMyOrders, updateMyOrderStatus, updateLocation, generateQR, markOrderPaid };
