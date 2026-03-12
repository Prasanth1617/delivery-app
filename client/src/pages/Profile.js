import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
        localStorage.removeItem("role");
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
            <h2 className="app-section-title">
              {user?.role === "admin" ? "Admin Profile" : "Welcome Back"}
            </h2>
            <p className="app-section-subtitle">
              {user?.role === "admin"
                ? "Manage your admin account and control your platform"
                : "Manage your profile and continue shopping"}
            </p>
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
                    background:
                      user.role === "admin"
                        ? "linear-gradient(135deg, #111827, #374151)"
                        : "linear-gradient(135deg, #4f46e5, #7c3aed)",
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
                    {user.role === "admin"
                      ? "Your admin account details and access level"
                      : "Your account details and delivery information"}
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
                    {user.role === "admin" ? "Admin Address" : "Delivery Address"}
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
                    background: user.role === "admin" ? "#f3f4f6" : "#eef2ff",
                    border:
                      user.role === "admin"
                        ? "1px solid #d1d5db"
                        : "1px solid #c7d2fe",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "13px",
                      color: user.role === "admin" ? "#374151" : "#4338ca",
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
                      color: user.role === "admin" ? "#111827" : "#312e81",
                    }}
                  >
                    {user.role === "admin" ? "Admin User" : "Active User"}
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
                  {user.role === "admin" ? (
                    <>
                      <button
                        className="primary-btn"
                        onClick={() => navigate("/admin/dashboard")}
                        style={{ width: "100%" }}
                      >
                        Open Dashboard
                      </button>

                      <button
                        className="secondary-btn"
                        onClick={() => navigate("/admin/products")}
                        style={{ width: "100%" }}
                      >
                        Manage Products
                      </button>

                      <button
                        className="ghost-btn"
                        onClick={() => navigate("/admin/orders")}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          background: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          color: "#111827",
                        }}
                      >
                        Manage Orders
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
                  {user.role === "admin" ? "Admin Notes" : "Shopping Tips"}
                </h3>

                {user.role === "admin" ? (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "18px",
                      color: "#6b7280",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>Keep product stock updated regularly.</li>
                    <li>Monitor pending orders and update statuses quickly.</li>
                    <li>Maintain accurate product names, pricing, and images.</li>
                  </ul>
                ) : (
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
                )}
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