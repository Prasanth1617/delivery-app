import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      if (!name || !phone || !password || !address) {
        alert("Please fill all fields");
        return;
      }

      setLoading(true);

      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        phone,
        password,
        address,
      });

      alert("Account created successfully ✅");
      navigate("/");
    } catch (err) {
      console.log("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
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
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
          padding: "32px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              fontSize: "15px",
              color: "#6b7280",
            }}
          >
            Sign up to start ordering with Delivery App
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
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
              padding: "14px 16px",
              borderRadius: "12px",
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
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Phone Number
          </label>
          <input
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
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
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
              background: "#f9fafb",
            }}
          />
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
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
              padding: "14px 16px",
              borderRadius: "12px",
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
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: loading ? "#9ca3af" : "#4f46e5",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 10px 20px rgba(79, 70, 229, 0.25)",
          }}
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            Already have an account?
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "10px",
              background: "transparent",
              border: "none",
              color: "#4f46e5",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;