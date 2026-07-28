const axios = require("axios");

const WHATSAPP_API_URL = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const sendOrderAlert = async (order) => {
  try {
    const itemsSummary = order.items
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ");

    const orderIdShort = String(order._id).slice(-8);
    const totalAmount = order.finalAmount || order.totalAmount;

    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_ADMIN_NUMBER,
        type: "template",
        template: {
          name: "new_order_alert",
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: orderIdShort },
                { type: "text", text: itemsSummary },
                { type: "text", text: String(totalAmount) },
                { type: "text", text: order.deliveryAddress },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("DEBUG: WhatsApp template sent successfully:", JSON.stringify(response.data));
  } catch (err) {
    console.error("WhatsApp notification failed:", err.response?.data || err.message);
  }
};

module.exports = { sendOrderAlert };