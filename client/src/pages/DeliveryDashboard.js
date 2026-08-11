import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Geolocation } from "@capacitor/geolocation";
import { toast } from "../utils/notify";
import { useAuth } from "../context/AuthContext";

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const watchIdRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/delivery/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/delivery/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Order marked ${status}`);
      fetchOrders();
    } catch (err) {
      console.log(err);
      toast.error("Status update failed");
    }
  };

  const sendLocation = useCallback(async (lat, lng) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/delivery/location`,
        { lat, lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  const startTracking = async () => {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== "granted") {
        toast.error("Location permission is required to go online");
        return;
      }

      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 15000 },
        (position, err) => {
          if (err) {
            console.log(err);
            return;
          }
          if (position) {
            sendLocation(position.coords.latitude, position.coords.longitude);
          }
        }
      );

      watchIdRef.current = id;
      setTracking(true);
      toast.success("You're now online 🟢");
    } catch (err) {
      console.log(err);
      toast.error("Could not start location tracking");
    }
  };

  const stopTracking = async () => {
    if (watchIdRef.current) {
      await Geolocation.clearWatch({ id: watchIdRef.current });
      watchIdRef.current = null;
    }
    setTracking(false);
    toast.info("You're offline 🔴");
  };

  useEffect(() => {
    fetchOrders();
    return () => {
      if (watchIdRef.current) {
        Geolocation.clearWatch({ id: watchIdRef.current });
      }
    };
  }, [fetchOrders]);

  const handleLogout = () => {
    stopTracking();
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="app-page">
        <div className="app-container">
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-card topbar-card">
          <div>
            <h2 className="app-section-title">🚴 {user?.name || "Delivery"}</h2>
            <p className="app-section-subtitle">Your assigned orders</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={tracking ? "secondary-btn" : "primary-btn"}
              onClick={tracking ? stopTracking : startTracking}
              type="button"
            >
              {tracking ? "Go Offline 🔴" : "Go Online 🟢"}
            </button>
            <button className="secondary-btn" onClick={handleLogout} type="button">
              Logout
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="app-card empty-state">
            <p>No orders assigned to you yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="app-card">
              <p><strong>Order #{order._id.slice(-8).toUpperCase()}</strong></p>
              <p>Status: {order.status}</p>
              <p>Amount: ₹{order.totalAmount}</p>
              <p>📍 {order.deliveryAddress}</p>

              {order.status === "Packed" && (
                <button
                  className="primary-btn"
                  onClick={() => updateStatus(order._id, "Out for Delivery")}
                  type="button"
                >
                  Start Delivery 🚚
                </button>
              )}

              {order.status === "Out for Delivery" && (
                <button
                  className="primary-btn"
                  onClick={() => updateStatus(order._id, "Delivered")}
                  type="button"
                >
                  Mark Delivered ✅
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;
