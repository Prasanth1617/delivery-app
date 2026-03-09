import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Profile</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/products")}>Go to Products</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Phone: {user.phone}</p>
          <p>Address: {user.address}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;