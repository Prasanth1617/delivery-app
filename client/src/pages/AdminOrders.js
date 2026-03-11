import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { background: "#dcfce7", color: "#166534" };
      case "Cancelled":
        return { background: "#fee2e2", color: "#991b1b" };
      case "Out for Delivery":
        return { background: "#dbeafe", color: "#1d4ed8" };
      case "Packed":
        return { background: "#fef3c7", color: "#92400e" };
      default:
        return { background: "#ede9fe", color: "#5b21b6" };
    }
  };

  return (
    <Layout>
      <div className="app-page">
        <div className="app-container">
          <div className="app-card topbar-card">
            <div>
              <h2 className="app-section-title">Admin Orders</h2>
              <p className="app-section-subtitle">
                Manage customer orders and update delivery status
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                className="primary-btn"
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/admin/products")}
              >
                Products
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="app-card empty-state">
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
              <h3 style={{ margin: 0, color: "#111827" }}>No orders found</h3>
              <p style={{ color: "#6b7280", marginTop: "10px" }}>
                Customer orders will appear here once users start placing them.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="app-card"
                  style={{ padding: "24px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "16px",
                      marginBottom: "18px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          color: "#111827",
                        }}
                      >
                        Order Management
                      </h3>
                      <p
                        style={{
                          margin: "8px 0 0",
                          color: "#6b7280",
                          fontSize: "14px",
                          wordBreak: "break-all",
                        }}
                      >
                        Order ID: {order._id}
                      </p>
                    </div>

                    <span
                      style={{
                        ...getStatusStyle(order.status),
                        padding: "8px 14px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "14px",
                      marginBottom: "18px",
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
                          margin: "0 0 8px",
                          fontSize: "13px",
                          color: "#6b7280",
                          fontWeight: "600",
                        }}
                      >
                        Total Amount
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#4f46e5",
                        }}
                      >
                        ₹{order.totalAmount}
                      </p>
                    </div>

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
                          margin: "0 0 8px",
                          fontSize: "13px",
                          color: "#6b7280",
                          fontWeight: "600",
                        }}
                      >
                        Items Count
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        {order.items.length}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "14px",
                      marginBottom: "18px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "13px",
                        color: "#6b7280",
                        fontWeight: "600",
                      }}
                    >
                      Delivery Address
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        color: "#111827",
                        fontWeight: "600",
                      }}
                    >
                      {order.deliveryAddress}
                    </p>
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#374151",
                      }}
                    >
                      Update Status
                    </p>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="input-field"
                      style={{ maxWidth: "260px" }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packed">Packed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#374151",
                      }}
                    >
                      Ordered Items
                    </p>

                    <div style={{ display: "grid", gap: "10px" }}>
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "12px 14px",
                            gap: "12px",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: "700",
                                color: "#111827",
                              }}
                            >
                              {item.name}
                            </p>
                            <p
                              style={{
                                margin: "6px 0 0",
                                fontSize: "13px",
                                color: "#6b7280",
                              }}
                            >
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <p
                            style={{
                              margin: 0,
                              fontWeight: "700",
                              color: "#4f46e5",
                            }}
                          >
                            ₹{item.price}
                          </p>
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
    </Layout>
  );
}

export default AdminOrders;