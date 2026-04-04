import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/myorders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Orders error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":        return "orders-status delivered";
      case "Cancelled":        return "orders-status cancelled";
      case "Out for Delivery": return "orders-status out-for-delivery";
      case "Packed":           return "orders-status packed";
      default:                 return "orders-status pending";
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

  const getPaymentBadge = (method, pStatus) => {
    if (method === "Online" && pStatus === "Paid") {
      return <span className="orders-payment-badge paid">💳 Paid Online</span>;
    }
    return <span className="orders-payment-badge cod">💵 Cash on Delivery</span>;
  };

  const orderSteps = ["Pending", "Packed", "Out for Delivery", "Delivered"];
  const stepIcons  = ["🕐", "📦", "🚚", "✅"];

  const renderOrderTimeline = (status) => {
    if (status === "Cancelled") {
      return (
        <div className="orders-cancelled-box">
          <p className="orders-cancelled-title">❌ This order was cancelled</p>
          <p className="orders-cancelled-text">
            This order is no longer being processed. You can place a new order anytime.
          </p>
        </div>
      );
    }

    const activeIndex = orderSteps.indexOf(status);

    return (
      <div className="orders-timeline-card">
        <p className="orders-timeline-title">📍 Delivery Progress</p>
        <div className="orders-timeline-grid">
          {orderSteps.map((step, index) => {
            const isCompleted = index <= activeIndex;
            const isCurrent   = index === activeIndex;
            return (
              <div key={step} className="orders-timeline-step">
                <div className={`orders-timeline-dot ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
                  {isCompleted ? stepIcons[index] : index + 1}
                </div>
                <div>
                  <p className={`orders-timeline-step-name ${isCompleted ? "completed" : ""}`}>
                    {step}
                  </p>
                  <p className={`orders-timeline-step-state ${isCurrent ? "current" : ""} ${isCompleted && !isCurrent ? "done" : ""}`}>
                    {isCurrent ? "● Current" : isCompleted ? "✓ Done" : "Waiting"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="app-page orders-page">
        <div className="app-container">
          <div className="orders-skeleton-list">
            {[1, 2].map((i) => (
              <div key={i} className="orders-skeleton-card">
                <div className="orders-skeleton-line long" />
                <div className="orders-skeleton-line short" />
                <div className="orders-skeleton-line medium" />
                <div className="orders-skeleton-block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page orders-page">
      <div className="app-container">

        {/* ── Hero ── */}
     <div className="orders-top-card">
  <div className="orders-top-left">
    <h2 className="orders-top-title">My Orders</h2>
    <p className="orders-top-subtitle">
      {orders.length} {orders.length === 1 ? "order" : "orders"} found
    </p>
  </div>
  <button
    className="orders-shop-btn"
    onClick={() => navigate("/products")}
    type="button"
  >
    + Shop More
  </button>
</div>

        {/* ── Empty state ── */}
        {orders.length === 0 ? (
          <div className="app-card empty-state orders-empty-card">
            <div className="orders-empty-icon">📦</div>
            <h3 className="orders-empty-title">No orders yet</h3>
            <p className="orders-empty-text">
              Your placed orders will appear here once you complete checkout.
            </p>
            <button
              className="primary-btn orders-empty-btn"
              onClick={() => navigate("/products")}
              type="button"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="orders-card">

                {/* Header */}
                <div className="orders-card-header">
                  <div className="orders-card-head-left">
                    <div className="orders-card-badges">
                      <span className={getStatusClass(order.status)}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                      {getPaymentBadge(order.paymentMethod, order.paymentStatus)}
                    </div>
                    <h3 className="orders-card-title">Order Details</h3>
                    <p className="orders-card-id">🆔 {order._id}</p>
                    <p className="orders-card-date">🕐 Placed on {formatDate(order.createdAt)}</p>
                  </div>
                </div>

                {/* Timeline */}
                {renderOrderTimeline(order.status)}

                {/* Stats */}
                <div className="orders-stats-grid">
                  <div className="orders-soft-box">
                    <p className="orders-box-label">Total</p>
                    <p className="orders-box-value orders-box-value-purple">₹{order.totalAmount}</p>
                  </div>
                  <div className="orders-soft-box">
                    <p className="orders-box-label">Items</p>
                    <p className="orders-box-value">{order.items.length}</p>
                  </div>
                  <div className="orders-soft-box">
                    <p className="orders-box-label">Payment</p>
                    <p className="orders-box-value orders-box-value-small">{order.paymentMethod || "COD"}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="orders-address-box">
                  <p className="orders-box-label">📍 Delivery Address</p>
                  <p className="orders-address-text">
                    {order.deliveryAddress || order.address || "Address not available"}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <p className="orders-items-title">🛍️ Ordered Items</p>
                  <div className="orders-items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="orders-item-row">
                        <div className="orders-item-left">
                          <p className="orders-item-name">{item.name}</p>
                          <p className="orders-item-qty">Qty: {item.quantity}</p>
                        </div>
                        <p className="orders-item-price">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;