const couponService = require("../services/couponService");

// POST /api/coupons/validate  (customer — checks if coupon applies to current cart)
const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal, deliveryFee } = req.body;
    const userId = req.user?._id;

    const result = await couponService.validateCoupon({
      code,
      cartTotal: Number(cartTotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      userId,
    });

    res.status(200).json({ success: true, coupon: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/coupons  (admin)
const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.status(200).json({ success: true, coupons });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/coupons  (admin)
const createCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "A coupon with this code already exists";
      err.statusCode = 400;
    }
    next(err);
  }
};

// PUT /api/admin/coupons/:id  (admin)
const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.status(200).json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/coupons/:id  (admin)
const deleteCoupon = async (req, res, next) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
