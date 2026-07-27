const axios = require("axios");

const WHATSAPP_API_URL = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const sendOrderAlert = async (order) => {
  try {
    const itemsList = order.items
      .map((item) => `- ${item.name} x${item.quantity}`)
      .join("\n");

    const message =
      `🛒 New Order Received!\n\n` +
      `Order ID: ${order._id}\n` +
      `Items:\n${itemsList}\n\n` +
      `Total: ₹${order.finalAmount || order.totalAmount}\n` +
      `Payment: ${order.paymentMethod}\n` +
      `Delivery Address: ${order.deliveryAddress}`;

    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_ADMIN_NUMBER,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("WhatsApp notification failed:", err.response?.data || err.message);
  }
};

module.exports = { sendOrderAlert };