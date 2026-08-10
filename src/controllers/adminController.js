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

const createDeliveryStaff = async (req, res, next) => {
  try {
    const staff = await adminService.createDeliveryStaff(req.body);
    res.status(201).json({ success: true, staff });
  } catch (err) { next(err); }
};

const getDeliveryStaff = async (req, res, next) => {
  try {
    const staff = await adminService.getDeliveryStaff();
    res.json(staff);
  } catch (err) { next(err); }
};

const assignOrderToStaff = async (req, res, next) => {
  try {
    const order = await adminService.assignOrderToStaff(req.params.id, req.body.staffId);
    res.json(order);
  } catch (err) { next(err); }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  createDeliveryStaff,
  getDeliveryStaff,
  assignOrderToStaff
};