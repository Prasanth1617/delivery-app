import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidIndianPhone = (value) => /^[6-9]\d{9}$/.test(value);

  const handleResetRequest = async () => {
    if (!phone.trim()) {
      toast.warning("Please enter your phone number");
      return;
    }

    if (!isValidIndianPhone(phone)) {
      toast.warning("Enter a valid 10-digit Indian mobile number");
      return;
    }

    try {
      setLoading(true);

      // TEMP (no backend yet)
      setTimeout(() => {
        toast.success("Reset link sent (demo) 📩");
        navigate("/");
      }, 1200);

      // 🔥 Later replace with API:
      // await axios.post("/api/auth/forgot-password", { phone });

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(18px)",
          borderRadius: "30px",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 30px 60px rgba(15, 23, 42, 0.12)",
          padding: "36px",
        }}
      >
        <div style={{ marginBottom: "28px", textAlign: "center" }}>
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
              margin: "0 auto 18px",
              boxShadow: "0 14px 28px rgba(79, 70, 229, 0.22)",
            }}
          >
            🔐
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "900",
              color: "#111827",
            }}
          >
            Forgot Password
          </h2>

          <p
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.7",
            }}
          >
            Enter your registered phone number to reset your password.
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
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
              padding: "14px 16px",
              borderRadius: "16px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
              outline: "none",
              background: "#f9fafb",
            }}
          />

          {phone && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "13px",
                fontWeight: "700",
                color: isValidIndianPhone(phone)
                  ? "#166534"
                  : "#b91c1c",
              }}
            >
              {isValidIndianPhone(phone)
                ? "Valid mobile number"
                : "Enter a valid number"}
            </p>
          )}
        </div>

        <button
          onClick={handleResetRequest}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "16px",
            border: "none",
            background: loading
              ? "#9ca3af"
              : "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "800",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 14px 28px rgba(79, 70, 229, 0.24)",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              color: "#4f46e5",
              fontWeight: "800",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;