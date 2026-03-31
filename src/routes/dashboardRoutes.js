const express              = require("express");
const dashboardController  = require("../controllers/dashboardController");
const authMiddleware       = require("../middleware/authMiddleware");
const adminMiddleware      = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/stats", authMiddleware, adminMiddleware, dashboardController.getStats);

module.exports = router;