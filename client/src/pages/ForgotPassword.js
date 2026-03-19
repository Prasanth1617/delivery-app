import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

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

      setTimeout(() => {
        toast.success("Reset link sent (demo) 📩");
        navigate("/");
      }, 1200);

      // Later:
      // await axios.post("/api/auth/forgot-password", { phone });
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-head">
          <div className="forgot-icon">🔐</div>

          <h2 className="forgot-title">Forgot Password</h2>

          <p className="forgot-subtitle">
            Enter your registered phone number to reset your password.
          </p>
        </div>

        <div className="forgot-field">
          <label>Phone Number</label>

          <input
            className="forgot-input"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            maxLength={10}
            inputMode="numeric"
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />

          {phone && (
            <p
              className={`forgot-phone-hint ${
                isValidIndianPhone(phone) ? "valid" : "invalid"
              }`}
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
          className={`forgot-submit-btn ${loading ? "loading" : ""}`}
          type="button"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="forgot-footer">
          <button
            onClick={() => navigate("/")}
            className="forgot-back-btn"
            type="button"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;