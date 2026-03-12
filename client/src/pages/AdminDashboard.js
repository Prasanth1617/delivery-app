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
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📊</div>
            <h3 style={{ margin: 0, color: "#111827" }}>Loading dashboard...</h3>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Please wait while we fetch admin statistics.
            </p>
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
      color: "#4338ca",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      bg: "#fef3c7",
      color: "#92400e",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: "✅",
      bg: "#dcfce7",
      color: "#166534",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "🛍️",
      bg: "#ede9fe",
      color: "#6d28d9",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: "💰",
      bg: "#dbeafe",
      color: "#1d4ed8",
    },
  ];

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-card topbar-card">
          <div>
            <h2 className="app-section-title">Admin Dashboard</h2>
            <p className="app-section-subtitle">
              Overview of orders, revenue, and product performance
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

        <div className="grid-cards" style={{ marginBottom: "24px" }}>
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="app-card"
              style={{ padding: "24px" }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  marginBottom: "16px",
                }}
              >
                {card.icon}
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "16px",
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

        <div className="grid-2">
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

            <div style={{ display: "grid", gap: "12px" }}>
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
                className="ghost-btn"
                onClick={() => navigate("/products")}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  color: "#111827",
                }}
              >
                Switch to User View
              </button>
            </div>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h3
              style={{
                marginTop: 0,
                marginBottom: "16px",
                color: "#111827",
              }}
            >
              Admin Notes
            </h3>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#374151",
                    lineHeight: "1.7",
                    fontWeight: "500",
                  }}
                >
                  Check pending orders regularly and update status quickly for
                  a better customer experience.
                </p>
              </div>

              <div
                style={{
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#312e81",
                    lineHeight: "1.7",
                    fontWeight: "600",
                  }}
                >
                  Keep product stock updated so users only see available items.
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