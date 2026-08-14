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
  const [qrModal, setQrModal] = useState(null);
  const [qrLoadingId, setQrLoadingId] = useState(null);
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

  const generateQR = async (orderId) => {
    try {
      setQrLoadingId(orderId);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/delivery/orders/${orderId}/generate-qr`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQrModal({ ...res.data, orderId });
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Could not generate QR");
    } finally {
      setQrLoadingId(null);
    }
  };

  const markPaid = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/delivery/orders/${orderId}/mark-paid`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Marked as paid");
      setQrModal(null);
      fetchOrders();
    } catch (err) {
      console.log(err);
      toast.error("Could not mark as paid");
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
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("location") && msg.toLowerCase().includes("not enabled")) {
        toast.error("Please turn on Location/GPS in your phone settings, then try again");
      } else if (msg.toLowerCase().includes("denied")) {
        toast.error("Location permission denied. Enable it in phone Settings > Apps > V2 Mart > Permissions");
      } else {
        toast.error("Could not start location tracking");
      }
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

  const getPaymentBadge = (method, pStatus) => {
    if (method === "Online" && pStatus === "Paid") {
      return <span style={{ background: "#e8f9ee", color: "#1a7a3c", fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px" }}>💳 Paid Online</span>;
    }
    return <span style={{ background: "#fff3e0", color: "#b5620a", fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px" }}>💵 Cash on Delivery</span>;
  };

  const getMapLink = (order) => {
    if (order.deliveryLat && order.deliveryLng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${order.deliveryLat},${order.deliveryLng}&travelmode=driving`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.deliveryAddress)}&travelmode=driving`;
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
              <p>Amount: ₹{order.totalAmount} {getPaymentBadge(order.paymentMethod, order.paymentStatus)}</p>
              <p>
                📍 {order.deliveryAddress}{" "}
                <a href={getMapLink(order)} target="_blank" rel="noreferrer" style={{ color: "#5e2080", fontWeight: 700 }}>
                  🧭 Navigate
                </a>
              </p>
              {order.deliveryLat && order.deliveryLng ? (
                <p style={{ fontSize: "11px", color: "#1a7a3c", margin: "2px 0 0" }}>✅ Exact GPS location available</p>
              ) : (
                <p style={{ fontSize: "11px", color: "#b5620a", margin: "2px 0 0" }}>⚠️ Approximate location (customer didn't share GPS)</p>
              )}

              {order.paymentMethod === "COD" && order.paymentStatus !== "Paid" && (
                <button
                  className="secondary-btn"
                  onClick={() => generateQR(order._id)}
                  disabled={qrLoadingId === order._id}
                  type="button"
                  style={{ marginTop: "8px" }}
                >
                  {qrLoadingId === order._id ? "Loading..." : "📲 Show Payment QR"}
                </button>
              )}

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

        {qrModal && (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
            }}
            onClick={() => setQrModal(null)}
          >
            <div
              className="app-card"
              style={{ maxWidth: "320px", textAlign: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Scan to Pay</h3>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#5e2080" }}>₹{qrModal.amount}</p>
              <img
                src={qrModal.qrImageUrl}
                alt="Payment QR"
                style={{ width: "220px", height: "220px", margin: "12px auto" }}
              />
              <p style={{ fontSize: "13px", color: "#666" }}>
                Ask the customer to scan with any UPI app
              </p>
              <button
                className="primary-btn"
                onClick={() => markPaid(qrModal.orderId)}
                type="button"
                style={{ marginTop: "10px", width: "100%" }}
              >
                ✅ Mark as Paid
              </button>
              <button
                className="secondary-btn"
                onClick={() => setQrModal(null)}
                type="button"
                style={{ marginTop: "8px", width: "100%" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;
