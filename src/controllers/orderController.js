const orderService = require("../services/orderService");

const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, address, paymentMethod } = req.body;
    const order = await orderService.createOrder({
      userId: req.user.id,
      items,
      totalAmount,
      address,
      paymentMethod,
    });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) { next(err); }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.json(orders);
  } catch (err) { next(err); }
};

module.exports = {
  createOrder,
  getMyOrders
};