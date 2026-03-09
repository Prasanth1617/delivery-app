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

        console.log("Orders response:", res.data);
        setOrders(res.data);
      } catch (err) {
        console.error("Orders error:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><b>Total:</b> ₹{order.totalAmount}</p>
            <p><b>Status:</b> {order.status}</p>
            <p><b>Address:</b> {order.deliveryAddress}</p>
            <p><b>Items:</b> {order.items.length}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;