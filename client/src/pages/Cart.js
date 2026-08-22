import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CouponSection from "../components/CouponSection";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Cart.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod] = useState("COD");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);

  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrArea, setAddrArea] = useState("");
  const [addrLandmark, setAddrLandmark] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrLat, setAddrLat] = useState(null);
  const [addrLng, setAddrLng] = useState(null);

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  const [showMapModal, setShowMapModal] = useState(false);
  const [mapDetecting, setMapDetecting] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const addrs = res.data.addresses || [];
        setSavedAddresses(addrs);
        setProfileName(res.data.name || "");
        setProfilePhone(res.data.phone || "");
        setAddrName(res.data.name || "");
        setAddrPhone(res.data.phone || "");
        if (addrs.length > 0) {
          setSelectedAddressIdx(0);
          setShowNewForm(false);
        } else {
          setShowNewForm(true);
        }
      } catch {
        setShowNewForm(true);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (showNewForm) {
      if (!addrName) setAddrName(profileName);
      if (!addrPhone) setAddrPhone(profilePhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNewForm]);

  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocationError("Location isn't supported on this device. Please move the map manually.");
      return;
    }
    setMapDetecting(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 17);
        }
        setMapDetecting(false);
        setLocationError(null);
      },
      (error) => {
        setMapDetecting(false);
        if (error.code === 1) {
          setLocationError("Location permission denied. Please allow location access for this site, then tap Retry.");
        } else if (error.code === 2) {
          setLocationError("Your phone's Location/GPS is turned OFF. Please turn it ON in phone settings, then tap Retry.");
        } else {
          setLocationError("Couldn't get your location. You can drag the map manually, or tap Retry.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!showMapModal || !mapContainerRef.current) return;

    const defaultCenter = addrLat && addrLng ? [addrLat, addrLng] : [10.0104, 77.4768];
    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(defaultCenter, 15);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const reverseGeocode = async (lat, lng) => {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { "Accept-Language": "en" } }
        );
        const addr = res.data.address;
        setAddrStreet([addr.house_number, addr.road || addr.pedestrian || addr.footway].filter(Boolean).join(", "));
        setAddrArea([addr.neighbourhood || addr.suburb || addr.quarter, addr.city || addr.town || addr.village || addr.county].filter(Boolean).join(", "));
        setAddrPincode(addr.postcode || "");
      } catch {
        // pin position is the source of truth, text is just a helper
      }
    };

    const handleMoveEnd = () => {
      const center = map.getCenter();
      setAddrLat(center.lat);
      setAddrLng(center.lng);
      reverseGeocode(center.lat, center.lng);
    };

    map.on("moveend", handleMoveEnd);

    const initCenter = map.getCenter();
    setAddrLat(initCenter.lat);
    setAddrLng(initCenter.lng);

    locateMe();

    return () => {
      map.off("moveend", handleMoveEnd);
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMapModal]);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (id) =>
    saveCart(cart.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item));

  const decreaseQuantity = (id) =>
    saveCart(cart.map((item) => item._id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));

  const removeItem = (id) => {
    saveCart(cart.filter((item) => item._id !== id));
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Cart cleared");
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems  = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = totalAmount >= 500 ? 0 : 40;
  const discountAmount      = appliedCoupon?.discountAmount || 0;
  const deliveryAfterCoupon = appliedCoupon?.freeDelivery ? 0 : deliveryFee;
  const finalAmount = Math.max(0, totalAmount + deliveryAfterCoupon - discountAmount);

  const buildAddressString = () => {
    if (selectedAddressIdx !== null && savedAddresses[selectedAddressIdx]) {
      const a = savedAddresses[selectedAddressIdx];
      return [a.name, a.phone, a.street, a.area, a.landmark, a.pincode].filter(Boolean).join(", ");
    }
    return [addrName, addrPhone, addrStreet, addrArea, addrLandmark, addrPincode].filter(Boolean).join(", ");
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    if (cart.length === 0) { toast.warning("Cart is empty"); return; }

    if (showNewForm && selectedAddressIdx === null) {
      if (!addrName.trim())   { toast.warning("Enter your name"); return; }
      if (!addrPhone.trim())  { toast.warning("Enter your phone number"); return; }
      if (!addrStreet.trim()) { toast.warning("Enter your street / house number"); return; }
      if (!addrArea.trim())   { toast.warning("Enter your area"); return; }
    }

    if (!showNewForm && selectedAddressIdx === null) {
      toast.warning("Please select a delivery address");
      return;
    }

    if (showNewForm && saveToProfile) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/addresses`,
          { name: addrName, phone: addrPhone, street: addrStreet, area: addrArea, landmark: addrLandmark, pincode: addrPincode, lat: addrLat, lng: addrLng },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch { /* non-blocking */ }
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
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/create`, payload, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("cart");
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
      <div className="app-container cart-container" style={{ paddingBottom: "90px" }}>
        <div className="cart-top-card">
          <div className="cart-top-inner">
            <div className="cart-top-left">
              <h2 className="cart-top-title">Your Cart</h2>
              <p className="cart-top-subtitle">
                {cart.length} item{cart.length !== 1 ? "s" : ""} ·{" "}
                {appliedCoupon ? (
                  <>₹{totalAmount} - ₹{discountAmount} = <span style={{ color: "#c9a84c", fontWeight: 700 }}>₹{finalAmount}</span></>
                ) : <>₹{totalAmount} total</>}
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
            <p className="cart-empty-text">Add some amazing products to continue.</p>
            <div className="cart-empty-action">
              <Link to="/products"><button className="primary-btn" type="button">Browse Products</button></Link>
            </div>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items-card">
              <h3 className="cart-section-title">Cart Items</h3>
              {cart.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <div className="cart-item-main">
                    <div className="cart-item-image-wrap">
                      {item.image ? <img src={item.image} alt={item.name} className="cart-item-image" /> : "📦"}
                    </div>
                    <div className="cart-item-content">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-price">Price: ₹{item.price}</p>
                      <p className="cart-item-subtotal">Subtotal: ₹{item.price * item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      type="button"
                      aria-label="Remove item"
                      style={{
                        width: "28px", height: "28px", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626",
                        borderRadius: "8px", fontSize: "13px", cursor: "pointer", padding: 0
                      }}
                    >
                      🗑
                    </button>
                  </div>
                  <div className="cart-item-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="cart-qty-box">
                      <button onClick={() => decreaseQuantity(item._id)} className="cart-qty-btn cart-qty-btn-minus" type="button">−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="cart-qty-btn cart-qty-btn-plus" type="button">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-card">
              <h3 className="cart-section-title">Order Summary</h3>
              <div className="cart-summary-box">
                <div className="cart-summary-row"><span>Total Unique Items</span><span>{cart.length}</span></div>
                <div className="cart-summary-row"><span>Total Quantity</span><span>{totalItems}</span></div>
                <div className="cart-summary-row">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span style={{ color: "#16a34a", fontWeight: 600 }}>FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                {appliedCoupon && (
                  <div className="cart-summary-row cart-summary-discount">
                    <span>Discount</span><span>-₹{discountAmount}</span>
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

              <label className="label-text" style={{ marginTop: "16px", display: "block" }}>Payment Method</label>
              <div className="cart-payment-options">
                <div className="cart-payment-option active">
                  <span className="cart-payment-icon">💵</span>
                  <div><p className="cart-payment-title">Cash on Delivery</p><p className="cart-payment-desc">Pay when your order arrives</p></div>
                  <span className="cart-payment-check">✓</span>
                </div>
              </div>
              <p style={{ fontSize: "11px", color: "#9d7bb0", marginTop: "6px" }}>
                💳 Online payments (UPI/GPay/Cards) launching soon
              </p>

              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "6px" }}>
                  <label className="label-text" style={{ margin: 0 }}>📍 Delivery Address</label>
                  {savedAddresses.length > 0 && (
                    <button type="button"
                      onClick={() => { setShowNewForm(!showNewForm); setSelectedAddressIdx(showNewForm ? 0 : null); }}
                      style={{ background: "none", border: "none", color: "#5e2080", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                      {showNewForm ? "← Use Saved" : "+ New Address"}
                    </button>
                  )}
                </div>

                {!showNewForm && savedAddresses.length > 0 && (
                  <div className="cart-saved-addresses">
                    {savedAddresses.map((addr, idx) => (
                      <div key={idx}
                        className={`cart-saved-addr-card ${selectedAddressIdx === idx ? "selected" : ""}`}
                        onClick={() => setSelectedAddressIdx(idx)}>
                        <div className="cart-addr-radio">{selectedAddressIdx === idx ? "🔵" : "⚪"}</div>
                        <div className="cart-addr-details">
                          <p className="cart-addr-name">{addr.name} · {addr.phone}</p>
                          <p className="cart-addr-line">{addr.street}, {addr.area}</p>
                          {addr.landmark && <p className="cart-addr-line">Near: {addr.landmark}</p>}
                          {addr.pincode && <p className="cart-addr-line">PIN: {addr.pincode}</p>}
                          {addr.lat && <p className="cart-addr-line" style={{ color: "#1a7a3c" }}>✅ Exact location saved</p>}
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => { setShowNewForm(true); setSelectedAddressIdx(null); }} className="cart-add-new-addr-btn">
                      + Add New Address
                    </button>
                  </div>
                )}

                {showNewForm && (
                  <div className="cart-addr-form">
                    <button type="button" onClick={() => setShowMapModal(true)}
                      style={{
                        width: "100%", marginBottom: "14px",
                        padding: "12px", borderRadius: "10px",
                        background: addrLat ? "#e8f9ee" : "#1e0a3c",
                        color: addrLat ? "#1a7a3c" : "#c9a84c",
                        border: addrLat ? "1px solid #bce8cb" : "none", fontWeight: 700, fontSize: "14px",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        touchAction: "manipulation",
                      }}>
                      {addrLat ? "✅ Location Set — Tap to Adjust" : "📍 Set Location on Map"}
                    </button>

                    <div className="cart-addr-form-grid">
                      <div className="cart-addr-field">
                        <label className="label-text">Full Name *</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. Prasanth Kumar" value={addrName} onChange={(e) => setAddrName(e.target.value)} />
                      </div>
                      <div className="cart-addr-field">
                        <label className="label-text">Phone Number *</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. 9876543210" inputMode="numeric" maxLength={10} value={addrPhone} onChange={(e) => setAddrPhone(e.target.value.replace(/\D/g, ""))} />
                      </div>
                      <div className="cart-addr-field cart-addr-field-full">
                        <label className="label-text">House No / Street *</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. 12/3, Gandhi Street" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} />
                      </div>
                      <div className="cart-addr-field cart-addr-field-full">
                        <label className="label-text">Area / Town *</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. Cumbum, Theni" value={addrArea} onChange={(e) => setAddrArea(e.target.value)} />
                      </div>
                      <div className="cart-addr-field">
                        <label className="label-text">Landmark</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. Near Temple" value={addrLandmark} onChange={(e) => setAddrLandmark(e.target.value)} />
                      </div>
                      <div className="cart-addr-field">
                        <label className="label-text">Pincode</label>
                        <input className="input-field cart-addr-input" placeholder="e.g. 625516" inputMode="numeric" maxLength={6} value={addrPincode} onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, ""))} />
                      </div>
                    </div>
                    <div className="cart-save-addr-toggle" onClick={() => setSaveToProfile(!saveToProfile)}>
                      <div className={`cart-save-checkbox ${saveToProfile ? "checked" : ""}`}>{saveToProfile && "✓"}</div>
                      <span>Save this address to my profile for future orders</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 500,
          background: "#fff", borderTop: "1px solid #eee",
          padding: "10px 16px calc(10px + env(safe-area-inset-bottom, 0px))",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
          boxShadow: "0 -4px 14px rgba(0,0,0,0.08)"
        }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: "#9d7bb0", fontWeight: 600 }}>Total</p>
            <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#1e0a3c" }}>₹{finalAmount}</p>
          </div>
          <button onClick={handleCheckout} disabled={loading}
            className={`primary-btn ${loading ? "loading" : ""}`} type="button"
            style={{ flex: 1, maxWidth: "220px" }}>
            {loading ? "Placing Order..." : "Place Order ✅"}
          </button>
        </div>
      )}

      {showMapModal && (
        <div style={{
          position: "fixed", inset: 0, background: "#000", zIndex: 3000,
          display: "flex", flexDirection: "column"
        }}>
          <div style={{ position: "relative", flex: 1 }}>
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -100%)", pointerEvents: "none",
              fontSize: "38px", zIndex: 3010, filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.4))"
            }}>
              📍
            </div>

            <button
              type="button"
              onClick={locateMe}
              disabled={mapDetecting}
              style={{
                position: "absolute", bottom: "20px", right: "16px",
                width: "52px", height: "52px", borderRadius: "50%",
                background: "#1e0a3c", color: "#c9a84c", border: "2px solid #c9a84c",
                fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.5)", cursor: "pointer", zIndex: 3010
              }}
            >
              {mapDetecting ? "⏳" : "🎯"}
            </button>

            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, zIndex: 3010,
              padding: "14px 16px", background: "linear-gradient(rgba(0,0,0,0.6), transparent)",
              color: "#fff", fontWeight: 700, fontSize: "14px"
            }}>
              Drag the map to move the pin to your exact location
            </div>

            {locationError && (
              <div style={{
                position: "absolute", top: "56px", left: "12px", right: "12px", zIndex: 3020,
                background: "#fff3e0", border: "2px solid #f5a623", borderRadius: "10px",
                padding: "12px 14px", boxShadow: "0 4px 14px rgba(0,0,0,0.3)"
              }}>
                <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: "#8a4b00" }}>
                  ⚠️ {locationError}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={locateMe}
                    disabled={mapDetecting}
                    style={{
                      flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                      background: "#1e0a3c", color: "#fff", fontWeight: 700, fontSize: "12px", cursor: "pointer"
                    }}
                  >
                    {mapDetecting ? "Checking..." : "🔄 Retry"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationError(null)}
                    style={{
                      padding: "8px 14px", borderRadius: "8px", border: "1px solid #ccc",
                      background: "#fff", fontWeight: 700, fontSize: "12px", cursor: "pointer"
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: "#fff", padding: "16px" }}>
            <button
              className="primary-btn"
              onClick={() => setShowMapModal(false)}
              type="button"
              style={{ width: "100%" }}
            >
              ✅ Confirm This Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;