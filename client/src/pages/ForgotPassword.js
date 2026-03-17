import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = enter phone, 2 = set new password
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const checkPhone = async () => {
    if (!phone) return alert("Enter your phone number");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/check-phone`,
        { phone }
      );
      if (res.data.exists) {
        setStep(2);
      } else {
        alert("Phone number not registered");
      }
    } catch (error) {
      alert("Error checking phone");
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return alert("Fill both password fields");
    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");
    if (newPassword.length < 6)
      return alert("Password must be at least 6 characters");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        { phone, newPassword }
      );
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      alert("Error resetting password");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />
          <button onClick={checkPhone} style={{ width: "100%", padding: "10px" }}>
            Check Account
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />
          <button onClick={resetPassword} style={{ width: "100%", padding: "10px" }}>
            Reset Password
          </button>
        </>
      )}

      {message && <p style={{ color: "green", marginTop: "15px" }}>{message}</p>}

      <p style={{ marginTop: "20px" }}>
        <a href="/login">Back to Login</a>
      </p>
    </div>
  );
}

export default ForgotPassword;