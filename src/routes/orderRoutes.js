const express         = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware  = require("../middleware/authMiddleware");

const router = express.Router();

router.get ("/ping",     (req, res) => res.send("Orders route working ✅"));
router.post("/create",   authMiddleware, orderController.createOrder);
router.get ("/myorders", authMiddleware, orderController.getMyOrders);

module.exports = router;