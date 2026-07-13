const express      = require("express");
const dotenv       = require("dotenv");
const morgan       = require("morgan");
const helmet       = require("helmet");
const cors         = require("cors");
const connectDB    = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
console.log("DEBUG Razorpay Key ID present:", !!process.env.Test_KEY_ID, "| starts with:", process.env.Test_KEY_ID ? process.env.Test_KEY_ID.slice(0, 8) : "MISSING");
console.log("DEBUG Razorpay Key Secret present:", !!process.env.Test_KEY_Secret, "| starts with:", process.env.Test_KEY_Secret ? process.env.Test_KEY_Secret.slice(0, 8) : "MISSING");
connectDB();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));

const couponRoutes    = require("./routes/couponRoutes");

app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/products",  require("./routes/productRoutes"));
app.use("/api/orders",    require("./routes/orderRoutes"));
app.use("/api/admin",     require("./routes/adminRoutes"));
app.use("/api/coupons",   couponRoutes);
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Theni Retail Backend Running 🚀" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));