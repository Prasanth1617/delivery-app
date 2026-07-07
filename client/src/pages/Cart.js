import { useState, useEffect } from "react";
import axios from "axios";
import CouponSection from "../components/CouponSection";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem("address", address);
  }, [address]);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationStatus(`Permission: ${result.state}`);
        if (result.state === "denied") setLocationDenied(true);
        result.onchange = () => {
          setLocationStatus(`Permission changed: ${result.state}`);
          setLocationDenied(result.state === "denied");
        };
      }).catch(() => {
        setLocationStatus("Permission API not supported");
      });
    } else {
      setLocationStatus("navigator.permissions not available");
    }
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    saveCart(updatedCart);
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Cart cleared successfully");
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setLocationStatus("Geolocation NOT supported");
      return;
    }

    toast.info("Requesting position...");
    setLocationStatus("Requesting position...");
    setFetchingLocation(true);
    setLocationDenied(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        toast.success(`Got coordinates — ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setLocationStatus(`Got coords: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );

          const addr = res.data.address;
          const parts = [
            addr.house_number,
            addr.road || addr.pedestrian || addr.footway,
            addr.neighbourhood || addr.suburb || addr.quarter,
            addr.city || addr.town || addr.village || addr.county,
            addr.state_district,
            addr.state,
            addr.postcode,
          ].filter(Boolean);

          const fullAddress = parts.join(", ");
          setAddress(fullAddress);
          setLocationStatus("Address filled ✅");
          toast.success("Address detected successfully!");
        } catch (err) {
          toast.error("Could not convert to address — type manually");
          setLocationStatus("Geocoding failed");
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        setFetchingLocation(false);
        const errorMessages = {
          1: "Permission DENIED — browser blocked location",
          2: "Position UNAVAILABLE — GPS signal not available",
          3: "TIMEOUT — took too long to get location",
        };
        const msg = errorMessages[error.code] || `Unknown error (code ${error.code}): ${error.message}`;
        toast.error(msg);
        setLocationStatus(msg);
        if (error.code === 1) setLocationDenied(true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = totalAmount >= 500 ? 0 : 40;

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const deliveryAfterCoupon = appliedCoupon?.freeDelivery ? 0 : deliveryFee;
  const finalAmount = Math.max(0, totalAmount + deliveryAfterCoupon - discountAmount);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/"); return; }
      if (cart.length === 0) { toast.warning("Cart is empty 🛒"); return; }
      if (!address.trim()) { toast.warning("Please enter your delivery address"); return; }

      setLoading(true);

      const payload = {
        items: cart.map((p) => ({
          productId: p._id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
        })),
        totalAmount: finalAmount,
        subtotal: totalAmount,
        deliveryFee: deliveryAfterCoupon,
        discountAmount,
        address,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("cart");
      localStorage.removeItem("address");
      setCart([]);
      setAppliedCoupon(null);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Order placed successfully ✅");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page cart-page">
      <div className="app-container cart-container">
        <div className="cart-top-card">
          <div className="cart-top-inner">
            <div className="cart-top-left">
              <div className="cart-top-pill">🛒 Premium Cart Experience</div>
              <h2 className="cart-top-title">Your Cart</h2>
              <p className="cart-top-subtitle">
                {cart.length} item{cart.length !== 1 ? "s" : ""} · 
                {appliedCoupon ? (
                  <>₹{totalAmount} - ₹{discountAmount} = <span style={{ color: "#c9a84c", fontWeight: 700 }}>₹{finalAmount}</span></>
                ) : (
                  <>₹{totalAmount} total</>
                )}
              </p>
            </div>

            <div className="cart-top-actions">
              <Link to="/products" className="cart-top-link">
                <button className="secondary-btn cart-top-btn" type="button">Back to Products</button>
              </Link>
              {cart.length > 0 && (
                <button onClick={clearCart} className="cart-clear-btn" type="button">✕ Clear</button>
              )}
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="app-card empty-state cart-empty-card">
            <div className="cart-empty-icon">🛒</div>
            <h3 className="cart-empty-title">Your cart is empty</h3>
            <p className="cart-empty-text">Add some amazing products to continue your shopping journey.</p>
            <div className="cart-empty-action">
              <Link to="/products">
                <button className="primary-btn" type="button">Browse Products</button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-grid">

            {/* Cart Items */}
            <div className="cart-items-card">
              <h3 className="cart-section-title">Cart Items</h3>
              {cart.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <div className="cart-item-main">
                    <div className="cart-item-image-wrap">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                      ) : "📦"}
                    </div>
                    <div className="cart-item-content">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-price">Price: ₹{item.price}</p>
                      <p className="cart-item-subtotal">Subtotal: ₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                  <div className="cart-item-actions" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px", flexWrap:"nowrap"}}>
                    <div className="cart-qty-box">
                      <button onClick={() => decreaseQuantity(item._id)} className="cart-qty-btn cart-qty-btn-minus" type="button">−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="cart-qty-btn cart-qty-btn-plus" type="button">+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item._id)} 
                      className="cart-remove-btn" 
                      type="button"
                      style={{
                        padding: "6px 10px",
                        borderRadius: "7px",
                        background: "#fff5f5",
                        border: "0.5px solid #fecaca",
                        color: "#dc2626",
                        fontSize: "11px",
                        fontWeight: "600",
                        cursor: "pointer",
                        minHeight: "unset",
                        whiteSpace: "nowrap",
                        width: "auto",
                        flexShrink: 0
                      }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="cart-summary-card">
              <h3 className="cart-section-title">Order Summary</h3>

              <div className="cart-summary-box">
                <div className="cart-summary-row">
                  <span>Total Unique Items</span>
                  <span>{cart.length}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Total Quantity</span>
                  <span>{totalItems}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? (
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>FREE</span>
                  ) : `₹${deliveryFee}`}</span>
                </div>
                {appliedCoupon && (
                  <div className="cart-summary-row cart-summary-discount">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="cart-summary-row cart-summary-total">
                  <span>{appliedCoupon ? "Final Total" : "Total Amount"}</span>
                  <span className="cart-summary-total-value">₹{finalAmount}</span>
                </div>
              </div>

              <CouponSection
                cartTotal={totalAmount}
                deliveryFee={deliveryFee}
                appliedCoupon={appliedCoupon}
                onCouponApplied={setAppliedCoupon}
                onRemoveCoupon={() => setAppliedCoupon(null)}
              />

              {/* Payment Method */}
              <label className="label-text" style={{ marginTop: "16px", display: "block" }}>
                Payment Method
              </label>

              <div className="cart-payment-options">
                <div
                  className={`cart-payment-option ${paymentMethod === "COD" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <span className="cart-payment-icon">💵</span>
                  <div>
                    <p className="cart-payment-title">Cash on Delivery</p>
                    <p className="cart-payment-desc">Pay when your order arrives</p>
                  </div>
                  {paymentMethod === "COD" && <span className="cart-payment-check">✓</span>}
                </div>

                <div className="cart-payment-option disabled" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                  <span className="cart-payment-icon">💳</span>
                  <div>
                    <p className="cart-payment-title">Online Payment</p>
                    <p className="cart-payment-desc">UPI, GPay, Cards — Coming Soon</p>
                  </div>
                </div>
              </div>

              {/* Address + location */}
              <div className="cart-address-header">
                <label className="label-text">Delivery Address</label>
                {!locationDenied && (
                  <button
                    type="button"
                    className="cart-location-btn"
                    onClick={fetchLocation}
                    disabled={fetchingLocation}
                  >
                    {fetchingLocation ? "⏳ Detecting..." : "📍 Use My Location"}
                  </button>
                )}
              </div>

              {locationStatus && process.env.NODE_ENV === "development" && (
                <div className="cart-location-debug">
                  🔍 {locationStatus}
                </div>
              )}

              {fetchingLocation && (
                <div className="cart-location-detecting">
                  <div className="cart-location-spinner" />
                  <p>Getting your location, please wait...</p>
                </div>
              )}

              {locationDenied && (
                <div className="cart-location-denied-box">
                  <p className="cart-location-denied-title">📍 Location Permission Blocked</p>
                  <p className="cart-location-denied-text">To enable location access:</p>
                  <ul className="cart-location-denied-steps">
                    <li><strong>Chrome Android:</strong> Tap 🔒 lock → Permissions → Location → Allow</li>
                    <li><strong>Edge:</strong> Tap 🔒 lock → Site permissions → Location → Allow</li>
                    <li><strong>iPhone Safari:</strong> Settings → Safari → Location → Allow</li>
                  </ul>
                  <p className="cart-location-denied-or">— or just type your address below —</p>
                  <button
                    type="button"
                    className="cart-location-retry-btn"
                    onClick={() => { setLocationDenied(false); setTimeout(fetchLocation, 300); }}
                  >
                    🔄 Try Again After Enabling
                  </button>
                </div>
              )}

              <textarea
                placeholder="Tap 'Use My Location' or type your address here"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="input-field cart-address-input"
              />

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`primary-btn cart-checkout-btn ${loading ? "loading" : ""}`}
                type="button"
              >
                {loading ? "Placing Order..." : `Place Order — ${paymentMethod} ✅`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
