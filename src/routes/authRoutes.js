const express        = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register",       authController.register);
router.post("/login",          authController.login);
router.get ("/profile",        authMiddleware, authController.getProfile);
router.put ("/update-address", authMiddleware, authController.updateAddress);
router.post("/verify-secret",  authController.verifySecret);
router.post("/reset-password", authController.resetPassword);

module.exports = router;