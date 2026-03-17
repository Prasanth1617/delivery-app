import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  const featureCardStyle = {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "18px",
    padding: "16px",
    backdropFilter: "blur(14px)",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
  };

  const passwordRuleStyle = (passed) => ({
    fontSize: "13px",
    fontWeight: "700",
    color: passed ? "#166534" : "#6b7280",
    background: passed ? "#dcfce7" : "#f3f4f6",
    border: passed ? "1px solid #bbf7d0" : "1px solid #e5e7eb",
    borderRadius: "999px",
    padding: "7px 10px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 28%), radial-gradient(circle at bottom right, rgba(168,85,247,0.28), transparent 30%), linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #f5f3ff 100%)",
        padding: "24px",
      }}
    >
      <div
        className="signup-grid-responsive"
        style={{
          width: "100%",
          maxWidth: "1180px",
          display: "grid",
          gridTemplateColumns: "1.02fr 0.98fr",
          gap: "24px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "30px",
            padding: "40px",
            background:
              "linear-gradient(135deg, #312e81 0%, #4f46e5 35%, #7c3aed 100%)",
            color: "#ffffff",
            boxShadow: "0 28px 60px rgba(79, 70, 229, 0.25)",
            minHeight: "680px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              top: "-60px",
              right: "-60px",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              bottom: "30px",
              left: "-30px",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.14)",
                fontSize: "12px",
                fontWeight: "800",
                marginBottom: "20px",
                letterSpacing: "0.2px",
              }}
            >
              🚀 Start Your Premium Journey
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "52px",
                lineHeight: "1.05",
                letterSpacing: "-1.2px",
                fontWeight: "900",
                maxWidth: "520px",
              }}
            >
              Create your account and shop with confidence.
            </h1>

            <p
              style={{
                marginTop: "18px",
                marginBottom: 0,
                maxWidth: "520px",
                fontSize: "17px",
                lineHeight: "1.8",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Join a smoother shopping experience with quick ordering, smart
              product discovery, secure access and simple order tracking.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div style={featureCardStyle}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🛒</div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800" }}>
                Easy Shopping
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.84)",
                }}
              >
                Browse products quickly and enjoy a smoother checkout flow.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>⚡</div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800" }}>
                Faster Orders
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.84)",
                }}
              >
                Save your details and place orders with less friction.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>📦</div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800" }}>
                Order Tracking
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.84)",
                }}
              >
                Track your placed orders and delivery progress easily.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🔒</div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800" }}>
                Secure Access
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.84)",
                }}
              >
                Your account is protected so you can shop with confidence.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: "30px",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 28px 60px rgba(15, 23, 42, 0.10)",
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "680px",
          }}
        >
          <div style={{ maxWidth: "430px", width: "100%", margin: "0 auto" }}>
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  boxShadow: "0 14px 28px rgba(79, 70, 229, 0.22)",
                  marginBottom: "18px",
                }}
              >
                ✨
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "34px",
                  fontWeight: "900",
                  color: "#111827",
                  letterSpacing: "-0.6px",
                }}
              >
                Create account
              </h2>

              <p
                style={{
                  marginTop: "10px",
                  marginBottom: 0,
                  fontSize: "15px",
                  color: "#6b7280",
                  lineHeight: "1.7",
                }}
              >
                Sign up to unlock a better shopping experience with easier
                ordering and order tracking.
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#374151",
                }}
              >
                Full Name
              </label>
              <input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: "16px",
                  border: "1px solid #d1d5db",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f9fafb",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#374151",
                }}
              >
                Phone Number
              </label>
              <input
                placeholder="Enter 10-digit mobile number"
                value={phone}
                maxLength={10}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: "16px",
                  border: "1px solid #d1d5db",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f9fafb",
                }}
              />
              {phone && (
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "13px",
                    color: isValidIndianPhone(phone) ? "#166534" : "#b91c1c",
                    fontWeight: "700",
                  }}
                >
                  {isValidIndianPhone(phone)
                    ? "Valid mobile number"
                    : "Enter a valid 10-digit Indian mobile number"}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#374151",
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Create strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: "16px",
                  border: "1px solid #d1d5db",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f9fafb",
                }}
              />

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <span style={passwordRuleStyle(passwordChecks.minLength)}>
                  {passwordChecks.minLength ? "✓" : "•"} 8+ chars
                </span>
                <span style={passwordRuleStyle(passwordChecks.upper)}>
                  {passwordChecks.upper ? "✓" : "•"} Uppercase
                </span>
                <span style={passwordRuleStyle(passwordChecks.lower)}>
                  {passwordChecks.lower ? "✓" : "•"} Lowercase
                </span>
                <span style={passwordRuleStyle(passwordChecks.number)}>
                  {passwordChecks.number ? "✓" : "•"} Number
                </span>
                <span style={passwordRuleStyle(passwordChecks.special)}>
                  {passwordChecks.special ? "✓" : "•"} Special char
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#374151",
                }}
              >
                Address
              </label>
              <input
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: "16px",
                  border: "1px solid #d1d5db",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f9fafb",
                }}
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "16px",
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "800",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading
                  ? "none"
                  : "0 14px 28px rgba(79, 70, 229, 0.24)",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Already have an account? Login and continue shopping.
              </p>

              <button
                onClick={() => navigate("/")}
                style={{
                  marginTop: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#4f46e5",
                  fontSize: "15px",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .signup-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Signup;