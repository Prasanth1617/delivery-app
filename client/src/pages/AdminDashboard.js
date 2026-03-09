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

  if (!stats)
    return (
      <div className="app-page">
        <div className="app-container">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="app-page">
      <div className="app-container">

        <div className="app-card topbar-card">
          <div>
            <h2 className="app-section-title">Admin Dashboard</h2>
            <p className="app-section-subtitle">
              Overview of orders, revenue and products
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
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

        <div className="grid-cards">

          <div className="app-card" style={{ padding: "24px" }}>
            <h3>Total Orders</h3>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
              {stats.totalOrders}
            </p>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h3>Pending Orders</h3>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
              {stats.pendingOrders}
            </p>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h3>Delivered Orders</h3>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
              {stats.deliveredOrders}
            </p>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h3>Total Products</h3>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
              {stats.totalProducts}
            </p>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h3>Total Revenue</h3>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
              ₹{stats.totalRevenue}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;