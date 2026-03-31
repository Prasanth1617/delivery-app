const mongoose = require("mongoose");
const Order   = require("../models/Order");
const Product = require("../models/Product");

const makeError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const createOrder = async ({ userId, items, totalAmount, address, paymentMethod }) => {
  if (!items || items.length === 0)
    throw makeError("Cart is empty");

  if (!address || !address.trim())
    throw makeError("Delivery address is required");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product)
        throw makeError(`${item.name} not found`, 404);

      if (product.stock < item.quantity)
        throw makeError(`Only ${product.stock} left for ${product.name}`);

      product.stock -= item.quantity;
      await product.save({ session });
    }

    const [order] = await Order.create(
      [{
        userId,
        items,
        totalAmount,
        deliveryAddress: address.trim(),
        status:        "Pending",
        paymentMethod: paymentMethod || "COD",
        paymentStatus: "Pending",
      }],
      { session }
    );

    await session.commitTransaction();
    return order;

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getMyOrders = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

module.exports = {
  createOrder,
  getMyOrders
};