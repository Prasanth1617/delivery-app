const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/validate", authMiddleware, couponController.validateCoupon);

module.exports = router;
