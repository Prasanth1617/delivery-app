import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const handleSignup = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          name,
          phone,
          password,
          address,
        }
      );

      alert("Account created successfully ✅");
      navigate("/");
    } catch (err) {
      console.log("Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Signup</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleSignup}>Signup</button>

      <br />
      <br />

      <Link to="/">Already have account? Login</Link>
    </div>
  );
}

export default Signup;