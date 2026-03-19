import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchOrders();
    } catch (err) {
      console.log(err);
      alert("Status update failed");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "admin-orders-status delivered";
      case "Cancelled":
        return "admin-orders-status cancelled";
      case "Out for Delivery":
        return "admin-orders-status out-for-delivery";
      case "Packed":
        return "admin-orders-status packed";
      default:
        return "admin-orders-status pending";
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="app-page admin-orders-page">
      <div className="app-container">
        <div className="app-card topbar-card admin-orders-top-card">
          <div>
            <h2 className="app-section-title">Admin Orders</h2>
            <p className="app-section-subtitle">
              Manage customer orders and update delivery status
            </p>
          </div>

          <div className="admin-orders-top-actions">
            <button
              className="primary-btn admin-orders-top-btn"
              onClick={() => navigate("/admin/dashboard")}
              type="button"
            >
              Dashboard
            </button>

            <button
              className="secondary-btn admin-orders-top-btn"
              onClick={() => navigate("/admin/products")}
              type="button"
            >
              Products
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="app-card empty-state admin-orders-empty-card">
            <div className="admin-orders-empty-icon">📦</div>
            <h3 className="admin-orders-empty-title">No orders found</h3>
            <p className="admin-orders-empty-text">
              Customer orders will appear here once users start placing them.
            </p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order) => (
              <div key={order._id} className="app-card admin-orders-card">
                <div className="admin-orders-header">
                  <div>
                    <h3 className="admin-orders-card-title">Order Management</h3>
                    <p className="admin-orders-card-id">Order ID: {order._id}</p>
                  </div>

                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                <div className="admin-orders-stats-grid">
                  <div className="admin-orders-soft-box">
                    <p className="admin-orders-box-label">Total Amount</p>
                    <p className="admin-orders-box-value amount">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div className="admin-orders-soft-box">
                    <p className="admin-orders-box-label">Items Count</p>
                    <p className="admin-orders-box-value">{order.items.length}</p>
                  </div>
                </div>

                <div className="admin-orders-address-box">
                  <p className="admin-orders-box-label">Delivery Address</p>
                  <p className="admin-orders-address-text">
                    {order.deliveryAddress || order.address || "Address not available"}
                  </p>
                </div>

                <div className="admin-orders-status-section">
                  <p className="admin-orders-section-label">Update Status</p>

                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="input-field admin-orders-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Packed">Packed</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <p className="admin-orders-section-label">Ordered Items</p>

                  <div className="admin-orders-items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="admin-orders-item-row">
                        <div>
                          <p className="admin-orders-item-name">{item.name}</p>
                          <p className="admin-orders-item-qty">Qty: {item.quantity}</p>
                        </div>

                        <p className="admin-orders-item-price">₹{item.price}</p>
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

export default AdminOrders;