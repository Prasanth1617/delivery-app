import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Track which orders are "new" (unseen)
  const lastSeenCount = parseInt(localStorage.getItem("lastSeenOrderCount") || "0");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);

      // ✅ Mark all as seen when admin opens this page
      localStorage.setItem("lastSeenOrderCount", String(res.data.length));
      window.dispatchEvent(new Event("ordersRead"));
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Order status updated to ${status} ✅`);
      fetchOrders();
    } catch (err) {
      console.log(err);
      toast.error("Status update failed ❌");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":        return "admin-orders-status delivered";
      case "Cancelled":        return "admin-orders-status cancelled";
      case "Out for Delivery": return "admin-orders-status out-for-delivery";
      case "Packed":           return "admin-orders-status packed";
      default:                 return "admin-orders-status pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":        return "✅";
      case "Cancelled":        return "❌";
      case "Out for Delivery": return "🚚";
      case "Packed":           return "📦";
      default:                 return "⏳";
    }
  };

  // ✅ Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Loading skeleton
  if (loading) {
    return (
      <div className="app-page admin-orders-page">
        <div className="app-container">
          <div className="admin-orders-skeleton-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="admin-orders-skeleton-card">
                <div className="admin-orders-skeleton-line long" />
                <div className="admin-orders-skeleton-line short" />
                <div className="admin-orders-skeleton-block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page admin-orders-page">
      <div className="app-container">

        {/* Top card */}
        <div className="app-card topbar-card admin-orders-top-card">
          <div>
            <div className="admin-orders-top-pill">📦 Order Control Center</div>
            <h2 className="app-section-title admin-orders-top-title">Admin Orders</h2>
            <p className="app-section-subtitle">
              Manage customer orders and update delivery status
            </p>
          </div>

          <div className="admin-orders-top-actions">
            <button className="primary-btn admin-orders-top-btn" onClick={() => navigate("/admin/dashboard")} type="button">
              Dashboard
            </button>
            <button className="secondary-btn admin-orders-top-btn" onClick={() => navigate("/admin/products")} type="button">
              Products
            </button>
          </div>
        </div>

        {/* ✅ Orders count */}
        {orders.length > 0 && (
          <div className="admin-orders-count-row">
            <span className="admin-orders-count-pill">
              🧾 {orders.length} Total Orders
            </span>
            {orders.length > lastSeenCount && (
              <span className="admin-orders-new-pill">
                🆕 {orders.length - lastSeenCount} New
              </span>
            )}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="app-card empty-state admin-orders-empty-card">
            <div className="admin-orders-empty-icon">📦</div>
            <h3 className="admin-orders-empty-title">No orders yet</h3>
            <p className="admin-orders-empty-text">
              Customer orders will appear here once users start placing them.
            </p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order, index) => {
              const isNew = index < (orders.length - lastSeenCount);
              return (
                <div
                  key={order._id}
                  className={`app-card admin-orders-card ${isNew ? "admin-orders-card-new" : ""}`}
                >
                  {/* ✅ NEW badge */}
                  {isNew && (
                    <div className="admin-orders-new-badge">🆕 NEW ORDER</div>
                  )}

                  <div className="admin-orders-header">
                    <div>
                      <div className="admin-orders-card-badges">
                        <span className={getStatusClass(order.status)}>
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                        {order.paymentMethod && (
                          <span className="admin-orders-payment-badge">
                            💵 {order.paymentMethod}
                          </span>
                        )}
                      </div>
                      <h3 className="admin-orders-card-title">Order Details</h3>
                      <p className="admin-orders-card-id">🆔 {order._id}</p>
                      <p className="admin-orders-card-date">
                        🕐 {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="admin-orders-stats-grid">
                    <div className="admin-orders-soft-box">
                      <p className="admin-orders-box-label">Total Amount</p>
                      <p className="admin-orders-box-value amount">₹{order.totalAmount}</p>
                    </div>
                    <div className="admin-orders-soft-box">
                      <p className="admin-orders-box-label">Items Count</p>
                      <p className="admin-orders-box-value">{order.items.length}</p>
                    </div>
                    <div className="admin-orders-soft-box">
                      <p className="admin-orders-box-label">Payment</p>
                      <p className="admin-orders-box-value admin-orders-box-small">
                        {order.paymentMethod || "COD"}
                      </p>
                    </div>
                  </div>

                  <div className="admin-orders-address-box">
                    <p className="admin-orders-box-label">📍 Delivery Address</p>
                    <p className="admin-orders-address-text">
                      {order.deliveryAddress || order.address || "Address not available"}
                    </p>
                  </div>

                  {/* ✅ Status update */}
                  <div className="admin-orders-status-section">
                    <p className="admin-orders-section-label">⚡ Update Status</p>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="input-field admin-orders-select"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Packed">📦 Packed</option>
                      <option value="Out for Delivery">🚚 Out for Delivery</option>
                      <option value="Delivered">✅ Delivered</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="admin-orders-section-label">🛍️ Ordered Items</p>
                    <div className="admin-orders-items-list">
                      {order.items.map((item, i) => (
                        <div key={i} className="admin-orders-item-row">
                          <div>
                            <p className="admin-orders-item-name">{item.name}</p>
                            <p className="admin-orders-item-qty">Qty: {item.quantity}</p>
                          </div>
                          <p className="admin-orders-item-price">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;