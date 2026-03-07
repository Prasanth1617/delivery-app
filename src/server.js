const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const orderRoutes = require("./routes/orderRoutes");
console.log("✅ orderRoutes loaded");
app.use("/api/orders", orderRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Delivery App Backend Running Successfully 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});