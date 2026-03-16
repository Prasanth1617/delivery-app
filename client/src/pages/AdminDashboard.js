import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/dashboard/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="app-page">
        <div className="app-container">
          <div className="app-card empty-state">
            <div style={{ fontSize: "52px", marginBottom: "14px" }}>📊</div>
            <h3 style={{ margin: 0 }}>Loading dashboard...</h3>
            <p>Please wait while we fetch admin statistics.</p>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "📦",
      bg: "#eef2ff",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      bg: "#fef3c7",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: "✅",
      bg: "#dcfce7",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "🛍️",
      bg: "#ede9fe",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: "💰",
      bg: "#dbeafe",
    },
  ];

  return (
    <div
      className="app-page"
      style={{
        background:
          "linear-gradient(180deg,#f8fafc 0%,#eef2ff 40%,#f8fafc 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="app-container">
        {/* HEADER */}
        <div
          className="app-card topbar-card"
          style={{
            padding: "28px",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <div
              style={{
                background: "#eef2ff",
                padding: "6px 12px",
                borderRadius: "999px",
                display: "inline-block",
                fontSize: "12px",
                fontWeight: "700",
                color: "#4338ca",
                marginBottom: "12px",
              }}
            >
              ⚡ Admin Control Panel
            </div>

            <h2 style={{ margin: 0, fontSize: "32px", color: "#111827" }}>
              Admin Dashboard
            </h2>

            <p style={{ marginTop: "8px", color: "#6b7280" }}>
              Overview of orders, revenue and platform activity
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="primary-btn"
              onClick={() => navigate("/admin/orders")}
            >
              Manage Orders
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/admin/products")}
            >
              Manage Products
            </button>
          </div>
        </div>

        {/* STATS */}
        <div
          className="grid-cards"
          style={{ marginTop: "24px", marginBottom: "28px" }}
        >
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="app-card"
              style={{
                padding: "24px",
                borderRadius: "20px",
                boxShadow: "0 12px 25px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "16px",
                  background: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  marginBottom: "16px",
                }}
              >
                {card.icon}
              </div>

              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "14px",
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  fontSize: "30px",
                  fontWeight: "800",
                  margin: 0,
                  color: "#111827",
                }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* PANELS */}
        <div className="grid-2">
          {/* QUICK ACTIONS */}
          <div
            className="app-card"
            style={{
              padding: "26px",
              borderRadius: "20px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "18px" }}>
              Quick Actions
            </h3>

            <div style={{ display: "grid", gap: "14px" }}>
              <button
                className="primary-btn"
                onClick={() => navigate("/admin/orders")}
                style={{ width: "100%" }}
              >
                Open Orders Panel
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/admin/products")}
                style={{ width: "100%" }}
              >
                Open Products Panel
              </button>

              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/products")}
              >
                Switch to User View
              </button>
            </div>
          </div>

          {/* ADMIN NOTES */}
          <div
            className="app-card"
            style={{
              padding: "26px",
              borderRadius: "20px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "18px" }}>Admin Notes</h3>

            <div style={{ display: "grid", gap: "14px" }}>
              <div
                style={{
                  background: "#f9fafb",
                  borderRadius: "14px",
                  padding: "14px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <p style={{ margin: 0, lineHeight: "1.7" }}>
                  Check pending orders regularly and update delivery status for
                  better customer satisfaction.
                </p>
              </div>

              <div
                style={{
                  background: "#eef2ff",
                  borderRadius: "14px",
                  padding: "14px",
                  border: "1px solid #c7d2fe",
                }}
              >
                <p style={{ margin: 0, lineHeight: "1.7", fontWeight: "600" }}>
                  Keep product stock updated so customers only see available
                  items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;