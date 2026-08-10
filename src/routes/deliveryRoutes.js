const express            = require("express");
const deliveryController = require("../controllers/deliveryController");
const authMiddleware     = require("../middleware/authMiddleware");
const deliveryMiddleware = require("../middleware/deliveryMiddleware");

const router = express.Router();

router.get ("/orders",            authMiddleware, deliveryMiddleware, deliveryController.getMyOrders);
router.put ("/orders/:id/status", authMiddleware, deliveryMiddleware, deliveryController.updateMyOrderStatus);
router.post("/location",          authMiddleware, deliveryMiddleware, deliveryController.updateLocation);

module.exports = router;
