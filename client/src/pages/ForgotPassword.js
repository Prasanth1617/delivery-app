import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

const SECURITY_QUESTIONS = [
  "What is your mother's first name?",
  "What is the name of your first school?",
  "What is your childhood nickname?",
  "What is your favourite food?",
  "What is the name of your hometown?",
  "What is your father's first name?",
  "What is your pet's name?",
];

function ForgotPassword() {
  const navigate = useNavigate();

  // Step 1 state
  const [phone, setPhone] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [secretAnswer, setSecretAnswer] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Step 2 state
  const [resetToken, setResetToken] = useState(""); // from backend after verify
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Which step we're on
  const [step, setStep] = useState(1);

  const isValidIndianPhone = (value) => /^[6-9]\d{9}$/.test(value);

  const passwordChecks = {
    minLength: newPassword.length >= 8,
    upper:   /[A-Z]/.test(newPassword),
    lower:   /[a-z]/.test(newPassword),
    number:  /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>_\-\\/[\]=+;']/g.test(newPassword),
  };

  const isStrongPassword = Object.values(passwordChecks).every(Boolean);

  // ✅ Step 1 — verify phone + secret answer
  const handleVerify = async () => {
    if (!phone.trim()) {
      toast.warning("Please enter your phone number");
      return;
    }

    if (!isValidIndianPhone(phone)) {
      toast.warning("Enter a valid 10-digit Indian mobile number");
      return;
    }

    if (!secretAnswer.trim()) {
      toast.warning("Please enter your security answer");
      return;
    }

    try {
      setVerifying(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-secret`,
        {
          phone: phone.trim(),
          secretAnswer: secretAnswer.trim(),
        }
      );

      setResetToken(res.data.resetToken);
      toast.success("Identity verified ✅ Now set your new password");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed ❌");
    } finally {
      setVerifying(false);
    }
  };

  // ✅ Step 2 — reset password
  const handleReset = async () => {
    if (!newPassword.trim()) {
      toast.warning("Please enter a new password");
      return;
    }

    if (!isStrongPassword) {
      toast.warning("Please create a stronger password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      setResetting(true);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        {
          resetToken,
          newPassword,
        }
      );

      toast.success("Password reset successfully ✅ Please login");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed ❌");
      // If token expired send back to step 1
      if (err.response?.data?.message?.includes("expired")) {
        setStep(1);
        setResetToken("");
      }
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        {/* Step indicator */}
        <div className="forgot-steps">
          <div className={`forgot-step ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
            <div className="forgot-step-dot">{step > 1 ? "✓" : "1"}</div>
            <span>Verify Identity</span>
          </div>
          <div className="forgot-step-line" />
          <div className={`forgot-step ${step >= 2 ? "active" : ""}`}>
            <div className="forgot-step-dot">2</div>
            <span>New Password</span>
          </div>
        </div>

        {/* ══ STEP 1 ══ */}
        {step === 1 && (
          <>
            <div className="forgot-head">
              <div className="forgot-icon">🔐</div>
              <h2 className="forgot-title">Verify Your Identity</h2>
              <p className="forgot-subtitle">
                Enter your phone number and answer your security question to reset your password.
              </p>
            </div>

            {/* Phone */}
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
                <p className={`forgot-phone-hint ${isValidIndianPhone(phone) ? "valid" : "invalid"}`}>
                  {isValidIndianPhone(phone) ? "✓ Valid number" : "✗ Enter valid number"}
                </p>
              )}
            </div>

            {/* Security question */}
            <div className="forgot-field">
              <label>Security Question</label>
              <select
                className="forgot-input forgot-select"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
              >
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* Secret answer */}
            <div className="forgot-field">
              <label>Your Answer</label>
              <input
                className="forgot-input"
                placeholder="Enter your secret answer"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className={`forgot-submit-btn ${verifying ? "loading" : ""}`}
              type="button"
            >
              {verifying ? "Verifying..." : "Verify Identity →"}
            </button>
          </>
        )}

        {/* ══ STEP 2 ══ */}
        {step === 2 && (
          <>
            <div className="forgot-head">
              <div className="forgot-icon">🔑</div>
              <h2 className="forgot-title">Set New Password</h2>
              <p className="forgot-subtitle">
                Create a strong new password for your account. This link expires in 10 minutes.
              </p>
            </div>

            {/* New password */}
            <div className="forgot-field">
              <label>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="forgot-input"
                  placeholder="Create strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Password strength */}
              <div className="forgot-password-rules">
                {[
                  { key: "minLength", label: "8+ chars" },
                  { key: "upper",    label: "Uppercase" },
                  { key: "lower",    label: "Lowercase" },
                  { key: "number",   label: "Number" },
                  { key: "special",  label: "Special" },
                ].map(({ key, label }) => (
                  <span key={key} className={`forgot-password-rule ${passwordChecks[key] ? "passed" : ""}`}>
                    {passwordChecks[key] ? "✓" : "•"} {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Confirm password */}
            <div className="forgot-field">
              <label>Confirm Password</label>
              <input
                type="password"
                className="forgot-input"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && (
                <p className={`forgot-phone-hint ${newPassword === confirmPassword ? "valid" : "invalid"}`}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <button
              onClick={handleReset}
              disabled={resetting}
              className={`forgot-submit-btn ${resetting ? "loading" : ""}`}
              type="button"
            >
              {resetting ? "Resetting..." : "Reset Password ✅"}
            </button>

            {/* Go back */}
            <button
              onClick={() => { setStep(1); setResetToken(""); }}
              className="forgot-back-btn"
              type="button"
              style={{ marginTop: "12px" }}
            >
              ← Back to Verify
            </button>
          </>
        )}

        {/* Back to login */}
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