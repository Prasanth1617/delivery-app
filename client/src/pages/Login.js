import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/profile";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate(redirectPath, { replace: true });
  }, [navigate, redirectPath]);

  const isValidIndianPhone = (value) => /^[6-9]\d{9}$/.test(value);

  const handleLogin = async () => {
    try {
      if (!phone.trim() || !password.trim()) {
        toast.warning("Please enter phone number and password");
        return;
      }
      if (!/^\d+$/.test(phone)) {
        toast.warning("Phone number should contain only digits");
        return;
      }
      if (!isValidIndianPhone(phone)) {
        toast.warning("Enter a valid 10-digit Indian mobile number");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { phone: phone.trim(), password }
      );

      localStorage.setItem("token", res.data.token);
      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      } else {
        localStorage.removeItem("role");
      }

      toast.success("Welcome back! ✅");

      const role = res.data.role;
      if (role === "admin") {
        if (
          redirectPath.startsWith("/admin") ||
          redirectPath === "/profile" ||
          redirectPath === "/products" ||
          redirectPath === "/cart" ||
          redirectPath === "/orders"
        ) {
          navigate(redirectPath, { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      } else {
        if (redirectPath.startsWith("/admin")) {
          navigate("/profile", { replace: true });
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // Submit on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-grid">

        {/* ── LEFT HERO PANEL ── */}
        <div className="login-hero">

          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">🛒</div>
            <div>
              <div className="login-brand-name">Theni Retail</div>
              <div className="login-brand-tag">Theni's #1 Grocery App</div>
            </div>
          </div>

          {/* Headline */}
          <div className="login-hero-content">
            <div className="login-pill">🌿 Fresh. Fast. Local.</div>

            <h1 className="login-hero-title">
              Grocery delivery
              <br />
              <span>built for Theni.</span>
            </h1>

            <p className="login-hero-text">
              Order fresh groceries from Ganapathy Silks store directly
              to your doorstep. Fast delivery, cash on delivery, and a
              shopping experience like no other in Theni.
            </p>
          </div>

          {/* Feature cards */}
          <div className="login-feature-grid">
            <div className="login-feature-card">
              <div className="login-feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Fresh groceries delivered quickly across Theni.</p>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon">💵</div>
              <h3>Cash on Delivery</h3>
              <p>Pay when your order arrives — no advance needed.</p>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon">📦</div>
              <h3>Live Tracking</h3>
              <p>Watch your order move from packed to delivered.</p>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon">🥬</div>
              <h3>Fresh Stock</h3>
              <p>Daily updated products — always fresh, always stocked.</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="login-form-card">
          <div className="login-form-inner">

            {/* Mobile brand — only shown on small screens */}
            <div className="login-mobile-brand">
              <div className="login-mobile-brand-icon">🛒</div>
              <div className="login-mobile-brand-name">Theni Retail</div>
            </div>

            {/* Form head */}
            <div className="login-form-head">
              <div className="login-form-logo">👋</div>
              <h2>Welcome back</h2>
              <p>
                Sign in to shop fresh groceries, track your orders
                and enjoy Theni's smartest delivery experience.
              </p>
            </div>

            {/* Phone */}
            <div className="login-field">
              <label>Phone Number</label>
              <input
                className="login-input"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                maxLength={10}
                inputMode="numeric"
                onKeyDown={handleKeyDown}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              {phone && (
                <p className={`login-phone-hint ${isValidIndianPhone(phone) ? "valid" : "invalid"}`}>
                  {isValidIndianPhone(phone)
                    ? "✓ Valid mobile number"
                    : "✗ Enter a valid 10-digit Indian number"}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="login-field">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#64748b",
                    padding: "0",
                    lineHeight: 1,
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="login-forgot-row">
              <button
                onClick={() => navigate("/forgot-password")}
                className="login-link-btn"
                type="button"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`login-submit-btn ${loading ? "loading" : ""}`}
              type="button"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

            {/* Divider */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">New to Theni Retail?</span>
              <div className="login-divider-line" />
            </div>

            {/* Signup box */}
            <div className="login-signup-box">
              <p>Create your account and get started with fast grocery delivery in Theni.</p>
              <button
                onClick={() => navigate("/signup")}
                className="login-link-btn login-signup-btn"
                type="button"
              >
                Create Free Account
              </button>
            </div>

            {/* Trust badges */}
            <div className="login-trust-row">
              <div className="login-trust-badge">
                <span>🔒</span>
                <span>Secure Login</span>
              </div>
              <div className="login-trust-badge">
                <span>📍</span>
                <span>Theni Only</span>
              </div>
              <div className="login-trust-badge">
                <span>💵</span>
                <span>COD Available</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;