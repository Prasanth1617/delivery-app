import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

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
      <div className="app-page admin-dashboard-page">
        <div className="app-container">
          <div className="app-card empty-state admin-dashboard-loading">
            <div className="admin-dashboard-loading-icon">📊</div>
            <h3 className="admin-dashboard-loading-title">Loading dashboard...</h3>
            <p className="admin-dashboard-loading-text">
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
      bgClass: "orders",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      bgClass: "pending",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      icon: "✅",
      bgClass: "delivered",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "🛍️",
      bgClass: "products",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: "💰",
      bgClass: "revenue",
    },
  ];

  return (
    <div className="app-page admin-dashboard-page">
      <div className="app-container">
        <div className="app-card topbar-card admin-dashboard-top-card">
          <div>
            <div className="admin-dashboard-pill">⚡ Admin Control Panel</div>

            <h2 className="admin-dashboard-title">Admin Dashboard</h2>

            <p className="admin-dashboard-subtitle">
              Overview of orders, revenue and platform activity
            </p>
          </div>

          <div className="admin-dashboard-top-actions">
            <button
              className="primary-btn admin-dashboard-top-btn"
              onClick={() => navigate("/admin/orders")}
              type="button"
            >
              Manage Orders
            </button>

            <button
              className="secondary-btn admin-dashboard-top-btn"
              onClick={() => navigate("/admin/products")}
              type="button"
            >
              Manage Products
            </button>
          </div>
        </div>

        <div className="grid-cards admin-dashboard-stats">
          {statsCards.map((card, index) => (
            <div key={index} className="app-card admin-dashboard-stat-card">
              <div className={`admin-dashboard-stat-icon ${card.bgClass}`}>
                {card.icon}
              </div>

              <h3 className="admin-dashboard-stat-title">{card.title}</h3>

              <p className="admin-dashboard-stat-value">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid-2 admin-dashboard-panels">
          <div className="app-card admin-dashboard-panel">
            <h3 className="admin-dashboard-panel-title">Quick Actions</h3>

            <div className="admin-dashboard-actions">
              <button
                className="primary-btn admin-dashboard-action-btn"
                onClick={() => navigate("/admin/orders")}
                type="button"
              >
                Open Orders Panel
              </button>

              <button
                className="secondary-btn admin-dashboard-action-btn"
                onClick={() => navigate("/admin/products")}
                type="button"
              >
                Open Products Panel
              </button>

              <button
                className="admin-dashboard-switch-btn"
                onClick={() => navigate("/products")}
                type="button"
              >
                Switch to User View
              </button>
            </div>
          </div>

          <div className="app-card admin-dashboard-panel">
            <h3 className="admin-dashboard-panel-title">Admin Notes</h3>

            <div className="admin-dashboard-notes">
              <div className="admin-dashboard-note">
                <p>
                  Check pending orders regularly and update delivery status for
                  better customer satisfaction.
                </p>
              </div>

              <div className="admin-dashboard-note admin-dashboard-note-highlight">
                <p>
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