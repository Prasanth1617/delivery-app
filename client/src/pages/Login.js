import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/profile");
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const featureCardStyle = {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "18px",
    padding: isMobile ? "14px" : "16px",
    backdropFilter: "blur(14px)",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 28%), radial-gradient(circle at bottom right, rgba(168,85,247,0.28), transparent 30%), linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #f5f3ff 100%)",
        padding: isMobile ? "12px" : "24px",
      }}
    >
      <div
        className="login-grid-responsive"
        style={{
          width: "100%",
          maxWidth: "1180px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
          gap: isMobile ? "16px" : "24px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: isMobile ? "22px" : "30px",
            padding: isMobile ? "22px 18px" : "40px",
            background:
              "linear-gradient(135deg, #312e81 0%, #4f46e5 35%, #7c3aed 100%)",
            color: "#ffffff",
            boxShadow: "0 28px 60px rgba(79, 70, 229, 0.25)",
            minHeight: isMobile ? "auto" : "640px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: isMobile ? "20px" : "28px",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: isMobile ? "140px" : "220px",
              height: isMobile ? "140px" : "220px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              top: "-40px",
              right: "-40px",
              filter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: isMobile ? "110px" : "170px",
              height: isMobile ? "110px" : "170px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              bottom: "30px",
              left: "-20px",
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
                flexWrap: "wrap",
              }}
            >
              ✨ Smarter Grocery Experience
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? "32px" : "54px",
                lineHeight: isMobile ? "1.15" : "1.04",
                letterSpacing: isMobile ? "-0.6px" : "-1.2px",
                fontWeight: "900",
                maxWidth: "520px",
              }}
            >
              Shop faster. Order smarter. Feel premium.
            </h1>

            <p
              style={{
                marginTop: "18px",
                marginBottom: 0,
                maxWidth: "520px",
                fontSize: isMobile ? "14px" : "17px",
                lineHeight: "1.8",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Discover fresh products, smooth checkout, live order tracking and
              a more modern shopping experience built for everyday convenience.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "16px",
            }}
          >
            <div style={featureCardStyle}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>⚡</div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800" }}>
                Fast Ordering
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.84)",
                }}
              >
                Add products in seconds with a clean and responsive shopping flow.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>📦</div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800" }}>
                Live Order Tracking
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.84)",
                }}
              >
                Stay updated from checkout to delivery with status visibility.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🛍️</div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800" }}>
                Curated Products
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.84)",
                }}
              >
                Browse organized categories, search quickly and sort smarter.
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
                Login securely and continue your shopping experience anytime.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: isMobile ? "22px" : "30px",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 28px 60px rgba(15, 23, 42, 0.10)",
            padding: isMobile ? "22px 16px" : "36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: isMobile ? "auto" : "640px",
          }}
        >
          <div style={{ maxWidth: "420px", width: "100%", margin: "0 auto" }}>
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  width: isMobile ? "52px" : "60px",
                  height: isMobile ? "52px" : "60px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "24px" : "28px",
                  boxShadow: "0 14px 28px rgba(79, 70, 229, 0.22)",
                  marginBottom: "18px",
                }}
              >
                🛒
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? "28px" : "34px",
                  fontWeight: "900",
                  color: "#111827",
                  letterSpacing: "-0.6px",
                }}
              >
                Welcome back
              </h2>

              <p
                style={{
                  marginTop: "10px",
                  marginBottom: 0,
                  fontSize: isMobile ? "14px" : "15px",
                  color: "#6b7280",
                  lineHeight: "1.7",
                }}
              >
                Login to continue shopping, manage your orders and enjoy a more
                premium delivery experience.
              </p>
            </div>

            <div style={{ marginBottom: "18px" }}>
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
                inputMode="numeric"
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: "16px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
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

            <div style={{ marginBottom: "10px" }}>
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: "16px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f9fafb",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={handleForgotPassword}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#4f46e5",
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              onClick={handleLogin}
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
                transition: "0.2s ease",
              }}
            >
              {loading ? "Logging in..." : "Login to Continue"}
            </button>

            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                background: "#f8fafb",
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
                New user? Create your account and start ordering faster.
              </p>

              <button
                onClick={() => navigate("/signup")}
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