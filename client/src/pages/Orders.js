import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ ADDED loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Orders error:", err);
      } finally {
        setLoading(false); // ✅ ADDED - stop loading after fetch
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "orders-status delivered";
      case "Cancelled":
        return "orders-status cancelled";
      case "Out for Delivery":
        return "orders-status out-for-delivery";
      case "Packed":
        return "orders-status packed";
      default:
        return "orders-status pending";
    }
  };

  const orderSteps = ["Pending", "Packed", "Out for Delivery", "Delivered"];

  const getStepIndex = (status) => {
    return orderSteps.indexOf(status);
  };

  const renderOrderTimeline = (status) => {
    if (status === "Cancelled") {
      return (
        <div className="orders-cancelled-box">
          <p className="orders-cancelled-title">❌ This order was cancelled</p>
          <p className="orders-cancelled-text">
            This order is no longer being processed. You can place a new order
            anytime from the products page.
          </p>
        </div>
      );
    }

    const activeIndex = getStepIndex(status);

    return (
      <div className="orders-timeline-card">
        <p className="orders-timeline-title">Delivery Progress</p>

        <div className="orders-timeline-grid">
          {orderSteps.map((step, index) => {
            const isCompleted = index <= activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div key={step} className="orders-timeline-step">
                <div
                  className={`orders-timeline-dot ${
                    isCompleted ? "completed" : ""
                  } ${isCurrent ? "current" : ""}`}
                >
                  {index + 1}
                </div>

                <div>
                  <p
                    className={`orders-timeline-step-name ${
                      isCompleted ? "completed" : ""
                    }`}
                  >
                    {step}
                  </p>

                  <p
                    className={`orders-timeline-step-state ${
                      isCurrent ? "current" : ""
                    } ${isCompleted ? "done" : ""}`}
                  >
                    {isCurrent ? "Current" : isCompleted ? "Done" : "Waiting"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ✅ ADDED - loading skeleton screen
  if (loading) {
    return (
      <div className="app-page orders-page">
        <div className="app-container">
          <div className="app-card empty-state orders-empty-card">
            <div className="orders-empty-icon">⏳</div>
            <h3 className="orders-empty-title">Loading your orders...</h3>
            <p className="orders-empty-text">
              Please wait while we fetch your order history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page orders-page">
      <div className="app-container">
        <div className="app-card topbar-card orders-top-card">
          <div className="orders-top-left">
            <div className="orders-top-pill">📦 Order Tracking Center</div>

            <h2 className="app-section-title orders-top-title">My Orders</h2>

            <p className="app-section-subtitle orders-top-subtitle">
              Track your placed orders, monitor delivery progress and review
              item details in one clean view.
            </p>
          </div>

          <div className="orders-top-actions">
            <button
              className="primary-btn orders-top-btn"
              onClick={() => navigate("/products")}
              type="button"
            >
              Shop More
            </button>

            <button
              className="secondary-btn orders-top-btn"
              onClick={() => navigate("/profile")}
              type="button"
            >
              Back to Profile
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="app-card empty-state orders-empty-card">
            <div className="orders-empty-icon">📦</div>

            <h3 className="orders-empty-title">No orders yet</h3>

            <p className="orders-empty-text">
              Your placed orders will appear here once you complete checkout.
            </p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="app-card orders-card">
                <div className="orders-card-header">
                  <div className="orders-card-head-left">
                    <div className="orders-summary-pill">🧾 Order Summary</div>

                    <h3 className="orders-card-title">Order Details</h3>

                    <p className="orders-card-id">Order ID: {order._id}</p>
                  </div>

                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                {renderOrderTimeline(order.status)}

                <div className="orders-stats-grid">
                  <div className="orders-soft-box">
                    <p className="orders-box-label">Total Amount</p>
                    <p className="orders-box-value orders-box-value-purple">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div className="orders-soft-box">
                    <p className="orders-box-label">Items Count</p>
                    <p className="orders-box-value">{order.items.length}</p>
                  </div>
                </div>

                <div className="orders-address-box">
                  <p className="orders-box-label">Delivery Address</p>
                  <p className="orders-address-text">
                    {order.deliveryAddress ||
                      order.address ||
                      "Address not available"}
                  </p>
                </div>

                <div>
                  <p className="orders-items-title">Ordered Items</p>

                  <div className="orders-items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="orders-item-row">
                        <div className="orders-item-left">
                          <p className="orders-item-name">{item.name}</p>
                          <p className="orders-item-qty">Qty: {item.quantity}</p>
                        </div>

                        <p className="orders-item-price">₹{item.price}</p>
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