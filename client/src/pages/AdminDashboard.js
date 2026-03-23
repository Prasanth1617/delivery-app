import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/dashboard/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStats();
  }, []);

  // ✅ Fetch all orders for charts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingCharts(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Build last 7 days chart data from orders
  const buildChartData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      const dateStr = date.toISOString().split("T")[0];

      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
        return orderDate === dateStr;
      });

      const revenue = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      days.push({
        day: label,
        orders: dayOrders.length,
        revenue,
      });
    }
    return days;
  };

  // ✅ Build order status breakdown for bar chart
  const buildStatusData = () => {
    const statusMap = {
      Pending: 0,
      Packed: 0,
      "Out for Delivery": 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((o) => {
      if (statusMap[o.status] !== undefined) {
        statusMap[o.status]++;
      }
    });

    return Object.entries(statusMap).map(([status, count]) => ({
      status: status === "Out for Delivery" ? "OFD" : status,
      count,
    }));
  };

  const chartData = buildChartData();
  const statusData = buildStatusData();

  // ✅ Custom tooltip for area chart
  const RevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-label">{label}</p>
          <p className="chart-tooltip-revenue">₹{payload[0]?.value || 0}</p>
          <p className="chart-tooltip-orders">{payload[1]?.value || 0} orders</p>
        </div>
      );
    }
    return null;
  };

  if (!stats) {
    return (
      <div className="app-page admin-dashboard-page">
        <div className="app-container">
          <div className="admin-dashboard-skeleton-grid">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="admin-dashboard-skeleton-card">
                <div className="admin-dashboard-skeleton-icon" />
                <div className="admin-dashboard-skeleton-line short" />
                <div className="admin-dashboard-skeleton-line long" />
              </div>
            ))}
          </div>
          <div className="admin-dashboard-skeleton-chart" />
        </div>
      </div>
    );
  }

  const statsCards = [
    { title: "Total Orders",     value: stats.totalOrders,     icon: "📦", bgClass: "orders" },
    { title: "Pending Orders",   value: stats.pendingOrders,   icon: "⏳", bgClass: "pending" },
    { title: "Delivered Orders", value: stats.deliveredOrders, icon: "✅", bgClass: "delivered" },
    { title: "Total Products",   value: stats.totalProducts,   icon: "🛍️", bgClass: "products" },
    { title: "Total Revenue",    value: `₹${stats.totalRevenue}`, icon: "💰", bgClass: "revenue" },
  ];

  // Status colors for bar chart
  const statusColors = {
    Pending: "#a78bfa",
    Packed: "#fbbf24",
    OFD: "#60a5fa",
    Delivered: "#34d399",
    Cancelled: "#f87171",
  };

  return (
    <div className="app-page admin-dashboard-page">
      <div className="app-container">

        {/* Top card */}
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

        {/* Stat cards */}
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

        {/* ✅ CHARTS SECTION */}
        {loadingCharts ? (
          <div className="admin-dashboard-skeleton-chart" />
        ) : (
          <div className="admin-dashboard-charts-grid">

            {/* Revenue + Orders Area Chart */}
            <div className="app-card admin-dashboard-chart-card">
              <div className="admin-dashboard-chart-head">
                <div>
                  <h3 className="admin-dashboard-chart-title">
                    📈 Revenue & Orders
                  </h3>
                  <p className="admin-dashboard-chart-sub">Last 7 days performance</p>
                </div>
                <div className="admin-dashboard-chart-legend">
                  <span className="legend-dot revenue-dot" /> Revenue
                  <span className="legend-dot orders-dot" /> Orders
                </div>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone" dataKey="revenue"
                    stroke="#4f46e5" strokeWidth={2}
                    fill="url(#revenueGrad)"
                  />
                  <Area
                    type="monotone" dataKey="orders"
                    stroke="#10b981" strokeWidth={2}
                    fill="url(#ordersGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Bar Chart */}
            <div className="app-card admin-dashboard-chart-card">
              <div className="admin-dashboard-chart-head">
                <div>
                  <h3 className="admin-dashboard-chart-title">
                    📊 Order Status
                  </h3>
                  <p className="admin-dashboard-chart-sub">Breakdown by current status</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false} tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(value, name) => [value, "Orders"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <rect
                        key={index}
                        fill={statusColors[entry.status] || "#4f46e5"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Status legend */}
              <div className="admin-dashboard-status-legend">
                {statusData.map((s) => (
                  <div key={s.status} className="admin-dashboard-status-legend-item">
                    <span
                      className="admin-dashboard-status-dot"
                      style={{ background: statusColors[s.status] || "#4f46e5" }}
                    />
                    <span>{s.status}</span>
                    <span className="admin-dashboard-status-count">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick actions + notes */}
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
                <p>Check pending orders regularly and update delivery status for better customer satisfaction.</p>
              </div>
              <div className="admin-dashboard-note admin-dashboard-note-highlight">
                <p>Keep product stock updated so customers only see available items.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;