import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
import axios from "axios";
import CouponSection from "../components/CouponSection";
import { Capacitor } from "@capacitor/core";
import { toast } from "../utils/notify";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [pointsApplied, setPointsApplied] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(null);
  const [saveToProfile, setSaveToProfile] = useState(false);

  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrArea, setAddrArea] = useState("");
  const [addrLandmark, setAddrLandmark] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrLat, setAddrLat] = useState(null);
  const [addrLng, setAddrLng] = useState(null);

  const [showMapModal, setShowMapModal] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSavedAddresses(res.data.addresses || []);
        setUserPoints(res.data.loyaltyPoints || 0);
      } catch { }
    };
    fetchSavedAddresses();
  }, []);

  useEffect(() => {
    if (!showMapModal || !mapContainerRef.current || addrLat === null) return;

    const map = L.map(mapContainerRef.current).setView([addrLat, addrLng], 17);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([addrLat, addrLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      setAddrLat(pos.lat);
      setAddrLng(pos.lng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [showMapModal]);

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
        setAddrLat(latitude);
        setAddrLng(longitude);
        setShowMapModal(true);
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const addr = res.data.address;
          setAddrStreet([addr.house_number, addr.road || addr.pedestrian || addr.footway].filter(Boolean).join(", "));
          setAddrArea([addr.neighbourhood || addr.suburb || addr.quarter, addr.city || addr.town || addr.village || addr.county].filter(Boolean).join(", "));
          setAddrPincode(addr.postcode || "");
        } catch {
          // silent — pin position is what matters, text is just a helper
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        setFetchingLocation(false);
        if (error.code === 1) {
          toast.error("Location permission denied. Please allow location access and try again.");
        } else if (error.code === 2) {
          toast.error("📍 Please turn ON Location/GPS in your phone settings, then tap this button again.");
        } else if (error.code === 3) {
          toast.error("Location request timed out — please try again.");
        } else {
          toast.error("Location error — please enter address manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = totalAmount >= 500 ? 0 : 40;

  const discountAmount      = appliedCoupon?.discountAmount || 0;
  const deliveryAfterCoupon = appliedCoupon?.freeDelivery ? 0 : deliveryFee;
  const amountAfterCoupon   = Math.max(0, totalAmount + deliveryAfterCoupon - discountAmount);

  const maxPointsValue    = Math.floor(userPoints / 10);            // ₹ value of all points
  const pointsDiscount    = pointsApplied ? Math.min(maxPointsValue, amountAfterCoupon) : 0;
  const pointsUsed        = pointsDiscount * 10;                    // actual points consumed

  const finalAmount = Math.max(0, amountAfterCoupon - pointsDiscount);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const buildAddressString = () => {
    if (selectedAddressIdx !== null && savedAddresses[selectedAddressIdx]) {
      const a = savedAddresses[selectedAddressIdx];
      return `${a.name}, ${a.phone}, ${a.street}, ${a.area}${a.landmark ? `, Near: ${a.landmark}` : ""}${a.pincode ? `, PIN: ${a.pincode}` : ""}`;
    }
    const parts = [addrName, addrPhone, addrStreet, addrArea, addrLandmark, addrPincode].filter(Boolean);
    return parts.join(", ");
  };

  const validateBeforeCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return null; }
    if (cart.length === 0) { toast.warning("Cart is empty 🛒"); return null; }

    const deliveryAddress = buildAddressString();
    if (!deliveryAddress.trim()) { toast.warning("Please enter your delivery address"); return null; }

    return token;
  };

  const finalizeOrder = async () => {
    localStorage.removeItem("cart");
    setCart([]);
    setAppliedCoupon(null);
    setSelectedAddressIdx(null);
    setSaveToProfile(false);
    setAddrName(""); setAddrPhone(""); setAddrStreet(""); setAddrArea(""); setAddrLandmark(""); setAddrPincode("");
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Order placed successfully ✅");
    navigate("/orders");
  };

  const handleCheckout = async () => {
    const token = validateBeforeCheckout();
    if (!token) return;

    if (saveToProfile) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/addresses`,
          { name: addrName, phone: addrPhone, street: addrStreet, area: addrArea, landmark: addrLandmark, pincode: addrPincode, lat: addrLat, lng: addrLng },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch { /* non-blocking */ }
    }

    if (paymentMethod === "Online") {
      await handleRazorpayPayment(token);
      return;
    }

    try {
      setLoading(true);
      const address = buildAddressString();
      const selectedSaved = selectedAddressIdx !== null ? savedAddresses[selectedAddressIdx] : null;
      const deliveryLat = selectedSaved ? selectedSaved.lat : addrLat;
      const deliveryLng = selectedSaved ? selectedSaved.lng : addrLng;
      const payload = {
        items: cart.map((p) => ({ productId: p._id, name: p.name, price: p.price, quantity: p.quantity })),
        totalAmount: finalAmount,
        subtotal: totalAmount,
        deliveryFee: deliveryAfterCoupon,
        discountAmount,
        address,
        deliveryLat,
        deliveryLng,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        pointsUsed,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/create`, payload, { headers: { Authorization: `Bearer ${token}` } });
      await finalizeOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (token) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/razorpay/create-order`,
        { amount: finalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const address = buildAddressString();
      const phoneForPrefill = selectedAddressIdx !== null && savedAddresses[selectedAddressIdx]
        ? savedAddresses[selectedAddressIdx].phone
        : addrPhone;
      const nameForPrefill = selectedAddressIdx !== null && savedAddresses[selectedAddressIdx]
        ? savedAddresses[selectedAddressIdx].name
        : addrName;

      const verifyAndFinalize = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
        const verifyPayload = {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          items: cart.map((p) => ({ productId: p._id, name: p.name, price: p.price, quantity: p.quantity })),
          totalAmount: finalAmount,
          subtotal: totalAmount,
          deliveryFee: deliveryAfterCoupon,
          discountAmount,
          address,
          couponCode: appliedCoupon?.code || null,
          pointsUsed,
        };
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/orders/razorpay/verify`,
          verifyPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await finalizeOrder();
      };

      if (Capacitor.isNativePlatform()) {
        // Native Android app — use Razorpay's native SDK via the Capacitor plugin
        // for full UPI app support (GPay, PhonePe, etc.)
        const { Checkout } = await import("capacitor-razorpay");

        const options = {
          key: data.keyId,
          amount: String(data.amount),
          currency: data.currency,
          order_id: data.orderId,
          name: "V2 Mart",
          description: "Grocery Order Payment",
          prefill: { name: nameForPrefill, contact: phoneForPrefill },
          theme: { color: "#5e2080" },
        };

        try {
          const result = await Checkout.open(options);
          const response = typeof result.response === "string" ? JSON.parse(result.response) : result.response;
          await verifyAndFinalize(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        } catch (err) {
          toast.error("Payment cancelled or failed");
          setLoading(false);
        }
      } else {
        // Web (Vercel) — existing web checkout script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Unable to load payment gateway. Check your connection.");
          setLoading(false);
          return;
        }

        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: "V2 Mart",
          description: "Grocery Order Payment",
          prefill: { name: nameForPrefill, contact: phoneForPrefill },
          theme: { color: "#5e2080" },
          handler: async (response) => {
            try {
              await verifyAndFinalize(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
            } catch (err) {
              toast.error(err.response?.data?.message || "Payment verification failed ❌");
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.info("Payment cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to start payment ❌");
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
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                {pointsApplied && pointsDiscount > 0 && (
                  <div className="cart-summary-row cart-summary-discount">
                    <span>Points Redeemed</span>
                    <span>-₹{pointsDiscount}</span>
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

              {userPoints >= 10 && (
                <div style={{
                  marginTop: "14px", background: "#fff9ec", border: "1px solid #f5e6bf",
                  borderRadius: "12px", padding: "12px 14px", display: "flex",
                  alignItems: "center", justifyContent: "space-between", gap: "10px"
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#a3853a" }}>
                      🎁 You have {userPoints} points
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8a7030" }}>
                      Redeemable for ₹{maxPointsValue} off
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPointsApplied(!pointsApplied)}
                    className={pointsApplied ? "secondary-btn" : "primary-btn"}
                    style={{ padding: "8px 14px", fontSize: "12px", whiteSpace: "nowrap" }}
                  >
                    {pointsApplied ? `✓ ₹${pointsDiscount} Applied` : "Redeem Points"}
                  </button>
                </div>
              )}

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

                <div className={`cart-payment-option ${paymentMethod === "Online" ? "active" : ""}`} onClick={() => setPaymentMethod("Online")}>
                  <span className="cart-payment-icon">💳</span>
                  <div><p className="cart-payment-title">Online Payment</p><p className="cart-payment-desc">UPI, GPay, Cards via Razorpay</p></div>
                  {paymentMethod === "Online" && <span className="cart-payment-check">✓</span>}
                </div>
              </div>

              {/* ── Delivery Address ── */}
              <div style={{ marginTop: "20px" }}>

                <label className="label-text" style={{ margin: 0, display: "block", marginBottom: "10px" }}>📍 Delivery Address</label>

                {/* Saved addresses - always visible if any exist */}
                {savedAddresses.length > 0 && (
                  <div className="cart-saved-addresses" style={{ marginBottom: "12px" }}>
                    {savedAddresses.map((addr, idx) => (
                      <div key={idx}
                        className={"cart-saved-addr-card" + (selectedAddressIdx === idx ? " selected" : "")}
                        onClick={() => { setSelectedAddressIdx(idx); setAddrName(""); setAddrPhone(""); setAddrStreet(""); setAddrArea(""); setAddrLandmark(""); setAddrPincode(""); }}>
                        <div className="cart-addr-radio">{selectedAddressIdx === idx ? "🔵" : "⚪"}</div>
                        <div className="cart-addr-details">
                          <p className="cart-addr-name">{addr.name} · {addr.phone}</p>
                          <p className="cart-addr-line">{addr.street}, {addr.area}</p>
                          {addr.landmark && <p className="cart-addr-line">Near: {addr.landmark}</p>}
                          {addr.pincode  && <p className="cart-addr-line">PIN: {addr.pincode}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Manual entry form - always visible */}
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
                        value={addrName} onChange={(e) => { setAddrName(e.target.value); setSelectedAddressIdx(null); }} />
                    </div>
                    <div className="cart-addr-field">
                      <label className="label-text">Phone Number *</label>
                      <input className="input-field cart-addr-input" placeholder="e.g. 9876543210"
                        inputMode="numeric" maxLength={10}
                        value={addrPhone} onChange={(e) => { setAddrPhone(e.target.value.replace(/\D/g, "")); setSelectedAddressIdx(null); }} />
                    </div>
                    <div className="cart-addr-field cart-addr-field-full">
                      <label className="label-text">House No / Street *</label>
                      <input className="input-field cart-addr-input" placeholder="e.g. 12/3, Gandhi Street"
                        value={addrStreet} onChange={(e) => { setAddrStreet(e.target.value); setSelectedAddressIdx(null); }} />
                    </div>
                    <div className="cart-addr-field cart-addr-field-full">
                      <label className="label-text">Area / Town *</label>
                      <input className="input-field cart-addr-input" placeholder="e.g. Cumbum, Theni"
                        value={addrArea} onChange={(e) => { setAddrArea(e.target.value); setSelectedAddressIdx(null); }} />
                    </div>
                    <div className="cart-addr-field">
                      <label className="label-text">Landmark</label>
                      <input className="input-field cart-addr-input" placeholder="Near Temple"
                        value={addrLandmark} onChange={(e) => { setAddrLandmark(e.target.value); setSelectedAddressIdx(null); }} />
                    </div>
                    <div className="cart-addr-field">
                      <label className="label-text">Pincode</label>
                      <input className="input-field cart-addr-input" placeholder="e.g. 625516"
                        inputMode="numeric" maxLength={6}
                        value={addrPincode} onChange={(e) => { setAddrPincode(e.target.value.replace(/\D/g, "")); setSelectedAddressIdx(null); }} />
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
        {showMapModal && (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "16px"
            }}
          >
            <div className="app-card" style={{ maxWidth: "420px", width: "100%" }}>
              <h3 style={{ marginTop: 0 }}>📍 Confirm Your Exact Location</h3>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>
                Drag the pin to your exact house for accurate delivery
              </p>
              <div
                ref={mapContainerRef}
                style={{ width: "100%", height: "300px", borderRadius: "10px", overflow: "hidden" }}
              />
              <button
                className="primary-btn"
                onClick={() => setShowMapModal(false)}
                type="button"
                style={{ marginTop: "12px", width: "100%" }}
              >
                ✅ Confirm This Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
