import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
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

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin/dashboard">
          <button>Dashboard</button>
        </Link>

        <Link to="/admin/orders">
          <button style={{ marginLeft: "10px" }}>Orders</button>
        </Link>

        <Link to="/admin/products">
          <button style={{ marginLeft: "10px" }}>Products</button>
        </Link>
      </div>

      <h2>Admin Orders</h2>

      {orders.length === 0 ? (
        <p>No orders</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <p><b>Order ID:</b> {order._id}</p>
            <p><b>Total:</b> ₹{order.totalAmount}</p>
            <p><b>Address:</b> {order.deliveryAddress}</p>
            <p><b>Current Status:</b> {order.status}</p>

            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Packed">Packed</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;