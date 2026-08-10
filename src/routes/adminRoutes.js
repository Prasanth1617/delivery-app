const express          = require("express");
const adminController  = require("../controllers/adminController");
const authMiddleware   = require("../middleware/authMiddleware");
const adminMiddleware  = require("../middleware/adminMiddleware");
const couponController = require("../controllers/couponController");

const router = express.Router();

router.get("/orders",            authMiddleware, adminMiddleware, adminController.getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminMiddleware, adminController.updateOrderStatus);

router.post("/delivery-staff",   authMiddleware, adminMiddleware, adminController.createDeliveryStaff);
router.get ("/delivery-staff",   authMiddleware, adminMiddleware, adminController.getDeliveryStaff);
router.put ("/orders/:id/assign", authMiddleware, adminMiddleware, adminController.assignOrderToStaff);

router.get("/coupons",  authMiddleware, adminMiddleware, couponController.getAllCoupons);
router.post("/coupons", authMiddleware, adminMiddleware, couponController.createCoupon);
router.put("/coupons/:id", authMiddleware, adminMiddleware, couponController.updateCoupon);
router.delete("/coupons/:id", authMiddleware, adminMiddleware, couponController.deleteCoupon);

module.exports = router;