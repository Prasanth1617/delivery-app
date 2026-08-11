const express            = require("express");
const deliveryController = require("../controllers/deliveryController");
const authMiddleware     = require("../middleware/authMiddleware");
const deliveryMiddleware = require("../middleware/deliveryMiddleware");

const router = express.Router();

router.get ("/orders",            authMiddleware, deliveryMiddleware, deliveryController.getMyOrders);
router.put ("/orders/:id/status", authMiddleware, deliveryMiddleware, deliveryController.updateMyOrderStatus);
router.post("/location",          authMiddleware, deliveryMiddleware, deliveryController.updateLocation);
router.post("/orders/:id/generate-qr", authMiddleware, deliveryMiddleware, deliveryController.generateQR);
router.put ("/orders/:id/mark-paid",   authMiddleware, deliveryMiddleware, deliveryController.markOrderPaid);

module.exports = router;
