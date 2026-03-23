import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css";

const SECURITY_QUESTIONS = [
  "What is your mother's first name?",
  "What is the name of your first school?",
  "What is your childhood nickname?",
  "What is your favourite food?",
  "What is the name of your hometown?",
  "What is your father's first name?",
  "What is your pet's name?",
];

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [secretAnswer, setSecretAnswer] = useState("");

  const isValidIndianPhone = (value) => /^[6-9]\d{9}$/.test(value);

  const passwordChecks = {
    minLength: password.length >= 8,
    upper:   /[A-Z]/.test(password),
    lower:   /[a-z]/.test(password),
    number:  /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-\\/[\]=+;']/g.test(password),
  };

  const isStrongPassword = Object.values(passwordChecks).every(Boolean);

  const handleSignup = async () => {
    try {
      if (!name.trim() || !phone.trim() || !password.trim() || !address.trim()) {
        toast.warning("Please fill all fields"); return;
      }
      if (name.trim().length < 3) {
        toast.warning("Name should be at least 3 characters"); return;
      }
      if (!/^\d+$/.test(phone)) {
        toast.warning("Phone number should contain only digits"); return;
      }
      if (!isValidIndianPhone(phone)) {
        toast.warning("Enter a valid 10-digit Indian mobile number"); return;
      }
      if (!isStrongPassword) {
        toast.warning("Please create a stronger password"); return;
      }
      if (address.trim().length < 5) {
        toast.warning("Please enter a valid address"); return;
      }
      if (!secretAnswer.trim() || secretAnswer.trim().length < 2) {
        toast.warning("Please enter your security answer"); return;
      }

      setLoading(true);

      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name:         name.trim(),
        phone:        phone.trim(),
        password,
        address:      address.trim(),
        secretAnswer: secretAnswer.trim(),
      });

      toast.success("Account created successfully ✅");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-grid">

        {/* ── LEFT HERO ── */}
        <div className="signup-hero">
          {/* Brand */}
          <div className="signup-brand">
            <div className="signup-brand-icon">🛒</div>
            <div>
              <div className="signup-brand-name">Theni Retail</div>
              <div className="signup-brand-tag">Theni's #1 Grocery App</div>
            </div>
          </div>

          {/* Hero content */}
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

          {/* Feature cards */}
          <div className="signup-feature-grid">
            <div className="signup-feature-card">
              <div className="signup-feature-icon">🛒</div>
              <h3>Easy Shopping</h3>
              <p>Browse products quickly and enjoy a smoother checkout flow.</p>
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

        {/* ── RIGHT FORM ── */}
        <div className="signup-form-card">
          <div className="signup-form-inner">

            {/* Mobile brand */}
            <div className="signup-mobile-brand">
              <div className="signup-mobile-brand-icon">🛒</div>
              <div className="signup-mobile-brand-name">Theni Retail</div>
            </div>

            <div className="signup-form-head">
              <div className="signup-form-logo">✨</div>
              <h2>Create account</h2>
              <p>Sign up to unlock a better shopping experience.</p>
            </div>

            {/* Name */}
            <div className="signup-field">
              <label>Full Name</label>
              <input
                className="signup-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Phone */}
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
                <p className={`signup-phone-hint ${isValidIndianPhone(phone) ? "valid" : "invalid"}`}>
                  {isValidIndianPhone(phone) ? "✓ Valid mobile number" : "✗ Enter valid 10-digit number"}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="signup-field">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="signup-input"
                  placeholder="Create strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", fontSize: "16px",
                    color: "#6b7280", padding: "0",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="signup-password-rules">
                {[
                  { key: "minLength", label: "8+ chars" },
                  { key: "upper",    label: "Uppercase" },
                  { key: "lower",    label: "Lowercase" },
                  { key: "number",   label: "Number" },
                  { key: "special",  label: "Special" },
                ].map(({ key, label }) => (
                  <span key={key} className={`signup-password-rule ${passwordChecks[key] ? "passed" : ""}`}>
                    {passwordChecks[key] ? "✓" : "•"} {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="signup-field signup-address-field">
              <label>Delivery Address</label>
              <input
                className="signup-input"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Security question */}
            <div className="signup-field">
              <label>Security Question</label>
              <select
                className="signup-input signup-select"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
              >
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <p className="signup-security-hint">
                🔐 Used to verify your identity if you forget your password
              </p>
            </div>

            {/* Secret answer */}
            <div className="signup-field">
              <label>Your Answer</label>
              <input
                className="signup-input"
                placeholder="Enter your secret answer"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
              />
              <p className="signup-security-hint">
                ⚠️ Remember this — you'll need it to reset your password
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className={`signup-submit-btn ${loading ? "loading" : ""}`}
              type="button"
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>

            <div className="signup-login-box">
              <p>Already have an account? Login and continue shopping.</p>
              <button
                onClick={() => navigate("/login")}
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