const orderService = require("../services/orderService");

const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const razorpayOrder = await orderService.createRazorpayOrder(amount);
    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) { next(err); }
};

const verifyAndCreateOrder = async (req, res, next) => {
  try {
    const {
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      items, totalAmount, subtotal, deliveryFee, discountAmount, address, couponCode
    } = req.body;

    orderService.verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });

    const order = await orderService.createOrder({
      userId: req.user.id,
      items, totalAmount, subtotal, deliveryFee, discountAmount, address,
      paymentMethod: "Online",
      couponCode,
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
    });

    res.status(201).json({ message: "Payment verified, order placed", order });
  } catch (err) { next(err); }
};

const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, subtotal, deliveryFee, discountAmount, address, paymentMethod, couponCode } = req.body;
    const order = await orderService.createOrder({
      userId: req.user.id,
      items,
      totalAmount,
      subtotal,
      deliveryFee,
      discountAmount,
      address,
      paymentMethod,
      couponCode,
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
  getMyOrders,
  createRazorpayOrder,
  verifyAndCreateOrder
};