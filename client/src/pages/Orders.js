import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data);
      } catch (err) {
        console.error("Orders error:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8fafc,#eef2ff,#f5f3ff)",
        padding: "30px"
      }}
    >
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        
        <h2 style={{ marginBottom: "20px" }}>
          My Orders ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              border: "1px solid #e5e7eb"
            }}
          >
            <h3>No orders yet</h3>
            <p>Your placed orders will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "white",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "20px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
              }}
            >
              <p>
                <b>Order ID:</b> {order._id}
              </p>

              <p>
                <b>Total Amount:</b> ₹{order.totalAmount}
              </p>

              <p>
                <b>Delivery Address:</b> {order.deliveryAddress}
              </p>

              <p>
                <b>Items:</b> {order.items.length}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "10px",
                    background:
                      order.status === "Delivered"
                        ? "#dcfce7"
                        : "#fef3c7",
                    color:
                      order.status === "Delivered"
                        ? "#166534"
                        : "#92400e",
                    fontWeight: "bold"
                  }}
                >
                  {order.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;