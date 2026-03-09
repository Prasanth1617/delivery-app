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
    <div className="app-page">
      <div className="app-container">
        <div className="app-card topbar-card">
          <div>
            <h2 className="app-section-title">Welcome Back</h2>
            <p className="app-section-subtitle">
              Manage your profile and continue shopping
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="primary-btn"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/orders")}
            >
              My Orders
            </button>

            <button className="ghost-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {user ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "24px",
            }}
          >
            <div className="app-card" style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "84px",
                    height: "84px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    fontWeight: "700",
                    flexShrink: 0,
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "24px",
                      color: "#111827",
                    }}
                  >
                    {user.name}
                  </h3>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Your account details and delivery information
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "13px",
                      color: "#6b7280",
                      fontWeight: "600",
                    }}
                  >
                    Phone Number
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {user.phone}
                  </p>
                </div>

                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "13px",
                      color: "#6b7280",
                      fontWeight: "600",
                    }}
                  >
                    Delivery Address
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {user.address}
                  </p>
                </div>

                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "#eef2ff",
                    border: "1px solid #c7d2fe",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "13px",
                      color: "#4338ca",
                      fontWeight: "600",
                    }}
                  >
                    Account Status
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#312e81",
                    }}
                  >
                    Active User
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: "24px",
              }}
            >
              <div className="app-card" style={{ padding: "24px" }}>
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "16px",
                    color: "#111827",
                  }}
                >
                  Quick Actions
                </h3>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <button
                    className="primary-btn"
                    onClick={() => navigate("/products")}
                    style={{ width: "100%" }}
                  >
                    Shop Now
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => navigate("/cart")}
                    style={{ width: "100%" }}
                  >
                    Open Cart
                  </button>

                  <button
                    className="ghost-btn"
                    onClick={() => navigate("/orders")}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      color: "#111827",
                    }}
                  >
                    View My Orders
                  </button>
                </div>
              </div>

              <div className="app-card" style={{ padding: "24px" }}>
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "12px",
                    color: "#111827",
                  }}
                >
                  Shopping Tips
                </h3>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    color: "#6b7280",
                    lineHeight: "1.8",
                  }}
                >
                  <li>Check product availability before ordering.</li>
                  <li>Keep your delivery address updated.</li>
                  <li>Track your order status from the Orders page.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="app-card empty-state">
            <h3 style={{ margin: 0, color: "#111827" }}>Loading profile...</h3>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Please wait while we fetch your details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;