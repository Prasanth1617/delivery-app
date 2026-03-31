const adminService = require("../services/adminService");

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await adminService.getAllOrders();
    res.json(orders);
  } catch (err) { next(err); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await adminService.updateOrderStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (err) { next(err); }
};

module.exports = {
  getAllOrders,
  updateOrderStatus
};