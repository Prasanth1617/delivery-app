import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/profile";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(redirectPath, { replace: true });
    }
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
        {
          phone: phone.trim(),
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      } else {
        localStorage.removeItem("role");
      }

      toast.success("Login successful ✅");

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

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">
      <div className="login-grid">
        <div className="login-hero">
          <div className="login-hero-circle login-hero-circle-top" />
          <div className="login-hero-circle login-hero-circle-bottom" />

          <div className="login-hero-content">
            <div className="login-pill">✨ Smarter Grocery Experience</div>

            <h1 className="login-hero-title">
              Shop faster. Order smarter. Feel premium.
            </h1>

            <p className="login-hero-text">
              Discover fresh products, smooth checkout, live order tracking and
              a more modern shopping experience built for everyday convenience.
            </p>
          </div>

          <div className="login-feature-grid">
            <div className="login-feature-card">
              <div className="login-feature-icon">⚡</div>
              <h3>Fast Ordering</h3>
              <p>
                Add products in seconds with a clean and responsive shopping
                flow.
              </p>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon">📦</div>
              <h3>Live Order Tracking</h3>
              <p>
                Stay updated from checkout to delivery with status visibility.
              </p>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon">🛍️</div>
              <h3>Curated Products</h3>
              <p>Browse organized categories, search quickly and sort smarter.</p>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon">🔒</div>
              <h3>Secure Access</h3>
              <p>
                Login securely and continue your shopping experience anytime.
              </p>
            </div>
          </div>
        </div>

        <div className="login-form-card">
          <div className="login-form-inner">
            <div className="login-form-head">
              <div className="login-form-logo">🛒</div>

              <h2>Welcome back</h2>

              <p>
                Login to continue shopping, manage your orders and enjoy a more
                premium delivery experience.
              </p>
            </div>

            <div className="login-field">
              <label>Phone Number</label>
              <input
                className="login-input"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                maxLength={10}
                inputMode="numeric"
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />

              {phone && (
                <p
                  className={`login-phone-hint ${
                    isValidIndianPhone(phone) ? "valid" : "invalid"
                  }`}
                >
                  {isValidIndianPhone(phone)
                    ? "Valid mobile number"
                    : "Enter a valid 10-digit Indian mobile number"}
                </p>
              )}
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-forgot-row">
              <button
                onClick={handleForgotPassword}
                className="login-link-btn"
                type="button"
              >
                Forgot Password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`login-submit-btn ${loading ? "loading" : ""}`}
              type="button"
            >
              {loading ? "Logging in..." : "Login to Continue"}
            </button>

            <div className="login-signup-box">
              <p>New user? Create your account and start ordering faster.</p>

              <button
                onClick={() => navigate("/signup")}
                className="login-link-btn login-signup-btn"
                type="button"
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;