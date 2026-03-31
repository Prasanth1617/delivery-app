const express           = require("express");
const productController = require("../controllers/productController");
const authMiddleware    = require("../middleware/authMiddleware");
const adminMiddleware   = require("../middleware/adminMiddleware");

const router = express.Router();

router.get   ("/",    productController.getAll);
router.post  ("/",    authMiddleware, adminMiddleware, productController.create);
router.put   ("/:id", authMiddleware, adminMiddleware, productController.update);
router.delete("/:id", authMiddleware, adminMiddleware, productController.remove);

module.exports = router;