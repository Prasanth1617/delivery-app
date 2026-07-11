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

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(null);
  const [saveToProfile, setSaveToProfile] = useState(false);

  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrArea, setAddrArea] = useState("");
  const [addrLandmark, setAddrLandmark] = useState("");
  const [addrPincode, setAddrPincode] = useState("");

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

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const addrs = res.data.addresses || [];
        setSavedAddresses(addrs);
        if (addrs.length > 0 && selectedAddressIdx === null) {
          setSelectedAddressIdx(0);
          setShowNewForm(false);
        }
      } catch { }
    };
    fetchSavedAddresses();
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

  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported on this device");
      return;
    }
    setFetchingLocation(true);
    toast.info("Detecting your location...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const addr = res.data.address;
          setAddrStreet([addr.house_number, addr.road || addr.pedestrian || addr.footway].filter(Boolean).join(", "));
          setAddrArea([addr.neighbourhood || addr.suburb || addr.quarter, addr.city || addr.town || addr.village || addr.county].filter(Boolean).join(", "));
          setAddrPincode(addr.postcode || "");
          toast.success("Location detected — please add your name and phone");
        } catch {
          toast.error("Could not detect address — please enter manually");
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        setFetchingLocation(false);
        const msgs = { 1: "Location permission denied", 2: "Location unavailable", 3: "Location timed out" };
        toast.error(msgs[error.code] || "Location error — please enter manually");
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

      let deliveryAddress = "";
      if (selectedAddressIdx !== null && savedAddresses[selectedAddressIdx]) {
        const a = savedAddresses[selectedAddressIdx];
        deliveryAddress = `${a.name}, ${a.phone}, ${a.street}, ${a.area}${a.landmark ? `, Near: ${a.landmark}` : ""}${a.pincode ? `, PIN: ${a.pincode}` : ""}`;
      } else {
        const parts = [addrName, addrPhone, addrStreet, addrArea, addrLandmark, addrPincode].filter(Boolean);
        deliveryAddress = parts.join(", ");
      }

      if (!deliveryAddress.trim()) { toast.warning("Please enter your delivery address"); return; }

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
        address: deliveryAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("cart");
      setCart([]);
      setAppliedCoupon(null);
      setShowNewForm(false);
      setSelectedAddressIdx(null);
      setSaveToProfile(false);
      setAddrName(""); setAddrPhone(""); setAddrStreet(""); setAddrArea(""); setAddrLandmark(""); setAddrPincode("");
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

              {/* ── Delivery Address ── */}
              <div style={{ marginTop: "20px" }}>

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <label className="label-text" style={{ margin: 0 }}>📍 Delivery Address</label>
                  {savedAddresses.length > 0 && (
                    <button type="button"
                      onClick={() => { setShowNewForm(!showNewForm); setSelectedAddressIdx(showNewForm ? 0 : null); }}
                      style={{ background: "none", border: "none", color: "#5e2080", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                      {showNewForm ? "← Use Saved" : "+ New Address"}
                    </button>
                  )}
                </div>

                {/* Saved address picker */}
                {!showNewForm && savedAddresses.length > 0 && (
                  <div className="cart-saved-addresses">
                    {savedAddresses.map((addr, idx) => (
                      <div key={idx}
                        className={"cart-saved-addr-card" + (selectedAddressIdx === idx ? " selected" : "")}
                        onClick={() => setSelectedAddressIdx(idx)}>
                        <div className="cart-addr-radio">{selectedAddressIdx === idx ? "🔵" : "⚪"}</div>
                        <div className="cart-addr-details">
                          <p className="cart-addr-name">{addr.name} · {addr.phone}</p>
                          <p className="cart-addr-line">{addr.street}, {addr.area}</p>
                          {addr.landmark && <p className="cart-addr-line">Near: {addr.landmark}</p>}
                          {addr.pincode  && <p className="cart-addr-line">PIN: {addr.pincode}</p>}
                        </div>
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => { setShowNewForm(true); setSelectedAddressIdx(null); }}
                      className="cart-add-new-addr-btn">
                      + Add New Address
                    </button>
                  </div>
                )}

                {/* New address form */}
                {showNewForm && (
                  <div className="cart-addr-form">

                    {/* Location detect button */}
                    <button type="button" onClick={fetchLocation} disabled={fetchingLocation}
                      style={{
                        width: "100%", marginBottom: "14px",
                        padding: "12px", borderRadius: "10px",
                        background: fetchingLocation ? "#f3ecff" : "#1e0a3c",
                        color: fetchingLocation ? "#5e2080" : "#c9a84c",
                        border: "none", fontWeight: 700, fontSize: "14px",
                        cursor: fetchingLocation ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        touchAction: "manipulation",
                      }}>
                      {fetchingLocation ? "⏳ Detecting location..." : "📍 Auto-detect My Location"}
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <div style={{ flex: 1, height: "1px", background: "#e2d5f5" }} />
                      <span style={{ fontSize: "11px", color: "#9d7bb0", fontWeight: 500 }}>or enter manually</span>
                      <div style={{ flex: 1, height: "1px", background: "#e2d5f5" }} />
                    </div>

                    <div className="cart-addr-form-grid">
                      <div className="cart-addr-field">
                        <label className="label-text">Full Name *</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. Prasanth Kumar"
                          value={addrName} onChange={(e) => setAddrName(e.target.value)} />
                      </div>
                      <div className="cart-addr-field">
                        <label className="label-text">Phone Number *</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. 9876543210"
                          inputMode="numeric" maxLength={10}
                          value={addrPhone} onChange={(e) => setAddrPhone(e.target.value.replace(/\D/g, ""))} />
                      </div>
                      <div className="cart-addr-field cart-addr-field-full">
                        <label className="label-text">House No / Street *</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. 12/3, Gandhi Street"
                          value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} />
                      </div>
                      <div className="cart-addr-field cart-addr-field-full">
                        <label className="label-text">Area / Town *</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. Cumbum, Theni"
                          value={addrArea} onChange={(e) => setAddrArea(e.target.value)} />
                      </div>
                      <div className="cart-addr-field">
                        <label className="label-text">Landmark</label>
                        <input className="input-field cart-addr-input" placeholder="Near Temple"
                          value={addrLandmark} onChange={(e) => setAddrLandmark(e.target.value)} />
                      </div>
                      <div className="cart-addr-field">
                        <label className="label-text">Pincode</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. 625516"
                          inputMode="numeric" maxLength={6}
                          value={addrPincode} onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, ""))} />
                      </div>
                    </div>

                    {/* Save to profile toggle */}
                    <div className="cart-save-addr-toggle" onClick={() => setSaveToProfile(!saveToProfile)}>
                      <div className={"cart-save-checkbox" + (saveToProfile ? " checked" : "")}>
                        {saveToProfile && "✓"}
                      </div>
                      <span>Save this address to my profile for future orders</span>
                    </div>
                  </div>
                )}
              </div>

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
