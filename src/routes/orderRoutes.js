const express         = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware  = require("../middleware/authMiddleware");

const router = express.Router();

router.get ("/ping",     (req, res) => res.send("Orders route working ✅"));
router.post("/create",   authMiddleware, orderController.createOrder);
router.get ("/myorders", authMiddleware, orderController.getMyOrders);
router.post("/razorpay/create-order", authMiddleware, orderController.createRazorpayOrder);
router.post("/razorpay/verify",       authMiddleware, orderController.verifyAndCreateOrder);

module.exports = router;