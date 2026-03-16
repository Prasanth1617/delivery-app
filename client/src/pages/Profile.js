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
    <div
      className="app-page"
      style={{
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="app-container">
        <div
          className="app-card topbar-card"
          style={{
            padding: "28px",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
            background:
              user?.role === "admin"
                ? "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(243,244,246,0.92))"
                : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(238,242,255,0.92))",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "999px",
                background: user?.role === "admin" ? "#f3f4f6" : "#eef2ff",
                color: user?.role === "admin" ? "#374151" : "#4338ca",
                fontWeight: "700",
                fontSize: "12px",
                marginBottom: "14px",
              }}
            >
              {user?.role === "admin" ? "⚙️ Admin Account" : "✨ My Account"}
            </div>

            <h2
              className="app-section-title"
              style={{
                marginBottom: "8px",
                fontSize: "34px",
                letterSpacing: "-0.4px",
              }}
            >
              {user?.role === "admin" ? "Admin Profile" : "Welcome Back"}
            </h2>
            <p
              className="app-section-subtitle"
              style={{
                fontSize: "15px",
                maxWidth: "620px",
                lineHeight: "1.7",
              }}
            >
              {user?.role === "admin"
                ? "Manage your admin account, platform access and operational actions from one place."
                : "Manage your profile, review account details and continue your shopping journey smoothly."}
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
            <div
              className="app-card fade-card"
              style={{
                padding: "30px",
                borderRadius: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  marginBottom: "28px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    borderRadius: "28px",
                    background:
                      user.role === "admin"
                        ? "linear-gradient(135deg, #111827, #374151)"
                        : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    fontWeight: "800",
                    flexShrink: 0,
                    boxShadow:
                      user.role === "admin"
                        ? "0 16px 28px rgba(17, 24, 39, 0.18)"
                        : "0 16px 28px rgba(79, 70, 229, 0.24)",
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "28px",
                      color: "#111827",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {user.name}
                  </h3>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#6b7280",
                      fontSize: "14px",
                      lineHeight: "1.7",
                    }}
                  >
                    {user.role === "admin"
                      ? "Your admin account details and platform access overview."
                      : "Your account details, saved delivery info and shopping access."}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "13px",
                      color: "#6b7280",
                      fontWeight: "700",
                    }}
                  >
                    Phone Number
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "17px",
                      fontWeight: "800",
                      color: "#111827",
                    }}
                  >
                    {user.phone}
                  </p>
                </div>

                <div
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "13px",
                      color: "#6b7280",
                      fontWeight: "700",
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
                      lineHeight: "1.7",
                    }}
                  >
                    {user.address}
                  </p>
                </div>

                <div
                  style={{
                    padding: "18px",
                    borderRadius: "18px",
                    background:
                      user.role === "admin"
                        ? "#f3f4f6"
                        : "linear-gradient(135deg, #eef2ff, #f5f3ff)",
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
                      fontWeight: "700",
                    }}
                  >
                    Account Status
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "17px",
                      fontWeight: "800",
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
              <div
                className="app-card fade-card"
                style={{
                  padding: "26px",
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
                  background: "#ffffff",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "16px",
                    color: "#111827",
                    fontSize: "22px",
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
                        style={{ width: "100%", padding: "14px", borderRadius: "14px" }}
                      >
                        Open Dashboard
                      </button>

                      <button
                        className="secondary-btn"
                        onClick={() => navigate("/admin/products")}
                        style={{ width: "100%", padding: "14px", borderRadius: "14px" }}
                      >
                        Manage Products
                      </button>

                      <button
                        className="ghost-btn"
                        onClick={() => navigate("/admin/orders")}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "14px",
                          background: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          color: "#111827",
                          fontWeight: "700",
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
                        style={{ width: "100%", padding: "14px", borderRadius: "14px" }}
                      >
                        Shop Now
                      </button>

                      <button
                        className="secondary-btn"
                        onClick={() => navigate("/cart")}
                        style={{ width: "100%", padding: "14px", borderRadius: "14px" }}
                      >
                        Open Cart
                      </button>

                      <button
                        className="ghost-btn"
                        onClick={() => navigate("/orders")}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "14px",
                          background: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          color: "#111827",
                          fontWeight: "700",
                        }}
                      >
                        View My Orders
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div
                className="app-card fade-card"
                style={{
                  padding: "26px",
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
                  background: "#ffffff",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "14px",
                    color: "#111827",
                    fontSize: "22px",
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
                      lineHeight: "1.9",
                      fontSize: "14px",
                    }}
                  >
                    <li>Keep product stock updated regularly.</li>
                    <li>Monitor pending orders and update statuses quickly.</li>
                    <li>Maintain accurate product names, pricing and images.</li>
                  </ul>
                ) : (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "18px",
                      color: "#6b7280",
                      lineHeight: "1.9",
                      fontSize: "14px",
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
          <div
            className="app-card empty-state"
            style={{
              borderRadius: "24px",
              padding: "56px 24px",
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "14px" }}>👤</div>
            <h3
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "24px",
              }}
            >
              Loading profile...
            </h3>
            <p
              style={{
                color: "#6b7280",
                marginTop: "12px",
                fontSize: "15px",
              }}
            >
              Please wait while we fetch your details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;