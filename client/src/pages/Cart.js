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
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);

  // Structured fields
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrArea, setAddrArea] = useState("");
  const [addrLandmark, setAddrLandmark] = useState("");
  const [addrPincode, setAddrPincode] = useState("");

  // Fetch saved addresses
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
          { name: addrName, phone: addrPhone, street: addrStreet, area: addrArea, landmark: addrLandmark, pincode: addrPincode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch { /* non-blocking */ }
    }

    try {
      setLoading(true);
      const address = buildAddressString();
      const payload = {
        items: cart.map((p) => ({ productId: p._id, name: p.name, price: p.price, quantity: p.quantity })),
        totalAmount: finalAmount,
        subtotal: totalAmount,
        deliveryFee: deliveryAfterCoupon,
        discountAmount,
        address,
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
      <div className="app-container cart-container">
        <div className="cart-top-card">
          <div className="cart-top-inner">
            <div className="cart-top-left">
              <div className="cart-top-pill">🛒 Premium Cart Experience</div>
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
            {/* Cart Items */}
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
                  </div>
                  <div className="cart-item-actions" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "nowrap" }}>
                    <div className="cart-qty-box">
                      <button onClick={() => decreaseQuantity(item._id)} className="cart-qty-btn cart-qty-btn-minus" type="button">−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="cart-qty-btn cart-qty-btn-plus" type="button">+</button>
                    </div>
                    <button onClick={() => removeItem(item._id)} type="button"
                      style={{ padding: "6px 10px", borderRadius: "7px", background: "#fff5f5", border: "0.5px solid #fecaca", color: "#dc2626", fontSize: "11px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
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

              {/* Payment Method */}
              <label className="label-text" style={{ marginTop: "16px", display: "block" }}>Payment Method</label>
              <div className="cart-payment-options">
                <div className={`cart-payment-option ${paymentMethod === "COD" ? "active" : ""}`} onClick={() => setPaymentMethod("COD")}>
                  <span className="cart-payment-icon">💵</span>
                  <div><p className="cart-payment-title">Cash on Delivery</p><p className="cart-payment-desc">Pay when your order arrives</p></div>
                  {paymentMethod === "COD" && <span className="cart-payment-check">✓</span>}
                </div>
                <div className="cart-payment-option disabled" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                  <span className="cart-payment-icon">💳</span>
                  <div><p className="cart-payment-title">Online Payment</p><p className="cart-payment-desc">UPI, GPay, Cards — Coming Soon</p></div>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ marginTop: "20px" }}>
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
                        className={`cart-saved-addr-card ${selectedAddressIdx === idx ? "selected" : ""}`}
                        onClick={() => setSelectedAddressIdx(idx)}>
                        <div className="cart-addr-radio">{selectedAddressIdx === idx ? "🔵" : "⚪"}</div>
                        <div className="cart-addr-details">
                          <p className="cart-addr-name">{addr.name} · {addr.phone}</p>
                          <p className="cart-addr-line">{addr.street}, {addr.area}</p>
                          {addr.landmark && <p className="cart-addr-line">Near: {addr.landmark}</p>}
                          {addr.pincode && <p className="cart-addr-line">PIN: {addr.pincode}</p>}
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => { setShowNewForm(true); setSelectedAddressIdx(null); }} className="cart-add-new-addr-btn">
                      + Add New Address
                    </button>
                  </div>
                )}

                {/* New address form */}
                {showNewForm && (
                  <div className="cart-addr-form">
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

              <button onClick={handleCheckout} disabled={loading}
                className={`primary-btn cart-checkout-btn ${loading ? "loading" : ""}`} type="button">
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