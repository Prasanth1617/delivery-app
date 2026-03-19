import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidIndianPhone = (value) => /^[6-9]\d{9}$/.test(value);

  const passwordChecks = {
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-\\/[\]=+;']/g.test(password),
  };

  const isStrongPassword = Object.values(passwordChecks).every(Boolean);

  const handleSignup = async () => {
    try {
      if (!name.trim() || !phone.trim() || !password.trim() || !address.trim()) {
        toast.warning("Please fill all fields");
        return;
      }

      if (name.trim().length < 3) {
        toast.warning("Name should be at least 3 characters");
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

      if (!isStrongPassword) {
        toast.warning("Please create a stronger password");
        return;
      }

      if (address.trim().length < 5) {
        toast.warning("Please enter a valid address");
        return;
      }

      setLoading(true);

      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name: name.trim(),
        phone: phone.trim(),
        password,
        address: address.trim(),
      });

      toast.success("Account created successfully ✅");
      navigate("/");
    } catch (err) {
      console.log("Signup error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-grid">
        <div className="signup-hero">
          <div className="signup-hero-circle signup-hero-circle-top" />
          <div className="signup-hero-circle signup-hero-circle-bottom" />

          <div className="signup-hero-content">
            <div className="signup-pill">🚀 Start Your Premium Journey</div>

            <h1 className="signup-hero-title">
              Create your account and shop with confidence.
            </h1>

            <p className="signup-hero-text">
              Join a smoother shopping experience with quick ordering, smart
              product discovery, secure access and simple order tracking.
            </p>
          </div>

          <div className="signup-feature-grid">
            <div className="signup-feature-card">
              <div className="signup-feature-icon">🛒</div>
              <h3>Easy Shopping</h3>
              <p>
                Browse products quickly and enjoy a smoother checkout flow.
              </p>
            </div>

            <div className="signup-feature-card">
              <div className="signup-feature-icon">⚡</div>
              <h3>Faster Orders</h3>
              <p>Save your details and place orders with less friction.</p>
            </div>

            <div className="signup-feature-card">
              <div className="signup-feature-icon">📦</div>
              <h3>Order Tracking</h3>
              <p>Track your placed orders and delivery progress easily.</p>
            </div>

            <div className="signup-feature-card">
              <div className="signup-feature-icon">🔒</div>
              <h3>Secure Access</h3>
              <p>Your account is protected so you can shop with confidence.</p>
            </div>
          </div>
        </div>

        <div className="signup-form-card">
          <div className="signup-form-inner">
            <div className="signup-form-head">
              <div className="signup-form-logo">✨</div>

              <h2>Create account</h2>

              <p>
                Sign up to unlock a better shopping experience with easier
                ordering and order tracking.
              </p>
            </div>

            <div className="signup-field">
              <label>Full Name</label>
              <input
                className="signup-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="signup-field">
              <label>Phone Number</label>
              <input
                className="signup-input"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                maxLength={10}
                inputMode="numeric"
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              {phone && (
                <p
                  className={`signup-phone-hint ${
                    isValidIndianPhone(phone) ? "valid" : "invalid"
                  }`}
                >
                  {isValidIndianPhone(phone)
                    ? "Valid mobile number"
                    : "Enter a valid 10-digit Indian mobile number"}
                </p>
              )}
            </div>

            <div className="signup-field">
              <label>Password</label>
              <input
                type="password"
                className="signup-input"
                placeholder="Create strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="signup-password-rules">
                <span
                  className={`signup-password-rule ${
                    passwordChecks.minLength ? "passed" : ""
                  }`}
                >
                  {passwordChecks.minLength ? "✓" : "•"} 8+ chars
                </span>

                <span
                  className={`signup-password-rule ${
                    passwordChecks.upper ? "passed" : ""
                  }`}
                >
                  {passwordChecks.upper ? "✓" : "•"} Uppercase
                </span>

                <span
                  className={`signup-password-rule ${
                    passwordChecks.lower ? "passed" : ""
                  }`}
                >
                  {passwordChecks.lower ? "✓" : "•"} Lowercase
                </span>

                <span
                  className={`signup-password-rule ${
                    passwordChecks.number ? "passed" : ""
                  }`}
                >
                  {passwordChecks.number ? "✓" : "•"} Number
                </span>

                <span
                  className={`signup-password-rule ${
                    passwordChecks.special ? "passed" : ""
                  }`}
                >
                  {passwordChecks.special ? "✓" : "•"} Special char
                </span>
              </div>
            </div>

            <div className="signup-field signup-address-field">
              <label>Address</label>
              <input
                className="signup-input"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className={`signup-submit-btn ${loading ? "loading" : ""}`}
              type="button"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="signup-login-box">
              <p>Already have an account? Login and continue shopping.</p>

              <button
                onClick={() => navigate("/")}
                className="signup-link-btn signup-back-btn"
                type="button"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;