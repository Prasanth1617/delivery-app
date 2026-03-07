import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p style={{ padding: "40px" }}>Loading dashboard...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 250px)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Delivered Orders</h3>
          <p>{stats.deliveredOrders}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;