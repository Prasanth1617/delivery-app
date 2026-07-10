import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);           // ✅ ADDED
  const [orderCount, setOrderCount] = useState(null);     // ✅ ADDED
  const [editingAddress, setEditingAddress] = useState(false); // ✅ ADDED
  const [newAddress, setNewAddress] = useState("");        // ✅ ADDED
  const [savingAddress, setSavingAddress] = useState(false); // ✅ ADDED
  const [addresses, setAddresses] = useState([]);
  const [addingAddress, setAddingAddress] = useState(false);
  const [savingNewAddr, setSavingNewAddr] = useState(false);
  const [newAddrName, setNewAddrName] = useState("");
  const [newAddrPhone, setNewAddrPhone] = useState("");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrArea, setNewAddrArea] = useState("");
  const [newAddrLandmark, setNewAddrLandmark] = useState("");
  const [newAddrPincode, setNewAddrPincode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(res.data);
        setNewAddress(res.data.address || "");
        setAddresses(res.data.addresses || []);

        // ✅ ADDED - fetch order count silently
        try {
          const ordersRes = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/orders/myorders`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOrderCount(Array.isArray(ordersRes.data) ? ordersRes.data.length : 0);
        } catch {
          setOrderCount(0);
        }

      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
      } finally {
        setLoading(false); // ✅ ADDED
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ ADDED - Save address to backend
  const handleSaveAddress = async () => {
    try {
      if (!newAddress.trim()) {
        toast.warning("Please enter an address");
        return;
      }

      setSavingAddress(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/update-address`,
        { address: newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) => ({ ...prev, address: newAddress }));
      setEditingAddress(false);
      toast.success("Address updated successfully ✅");
    } catch (err) {
      toast.error("Failed to update address ❌");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddrName.trim())   { toast.warning("Enter name"); return; }
    if (!newAddrPhone.trim())  { toast.warning("Enter phone"); return; }
    if (!newAddrStreet.trim()) { toast.warning("Enter street"); return; }
    if (!newAddrArea.trim())   { toast.warning("Enter area"); return; }
    try {
      setSavingNewAddr(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/addresses`,
        { name: newAddrName, phone: newAddrPhone, street: newAddrStreet,
          area: newAddrArea, landmark: newAddrLandmark, pincode: newAddrPincode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data.addresses);
      setAddingAddress(false);
      setNewAddrName(""); setNewAddrPhone(""); setNewAddrStreet("");
      setNewAddrArea(""); setNewAddrLandmark(""); setNewAddrPincode("");
      toast.success("Address saved ✅");
    } catch { toast.error("Failed to save address"); }
    finally { setSavingNewAddr(false); }
  };

  const handleDeleteAddress = async (idx) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/auth/addresses/${idx}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data.addresses);
      toast.success("Address removed");
    } catch { toast.error("Failed to remove address"); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully");
  };

  // ✅ Premium skeleton loader
  if (loading) {
    return (
      <div className="app-page profile-page">
        <div className="app-container">
          <div className="profile-skeleton-top" />
          <div className="profile-grid">
            <div className="profile-skeleton-card">
              <div className="profile-skeleton-avatar" />
              <div className="profile-skeleton-line long" />
              <div className="profile-skeleton-line medium" />
              <div className="profile-skeleton-block" />
              <div className="profile-skeleton-block" />
            </div>
            <div className="profile-skeleton-card">
              <div className="profile-skeleton-line medium" />
              <div className="profile-skeleton-btn" />
              <div className="profile-skeleton-btn" />
              <div className="profile-skeleton-btn" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page profile-page">
      <div className="app-container">

        {/* Top card */}
        <div className={`app-card topbar-card profile-top-card ${user?.role === "admin" ? "admin" : "user"}`}>
          <div>
            <div className={`profile-top-pill ${user?.role === "admin" ? "admin" : "user"}`}>
              {user?.role === "admin" ? "⚙️ Admin Account" : "✨ My Account"}
            </div>

           <h2 className="app-section-title profile-top-title">
  {user?.role === "admin" ? "Admin Profile" : `Hi, ${user?.name?.split(" ")[0] || "there"}`}
</h2>
            <p className="app-section-subtitle profile-top-subtitle">
              {user?.role === "admin"
                ? "Manage your admin account, platform access and operational actions from one place."
                : "Manage your profile, review account details and continue your shopping journey smoothly."}
            </p>
          </div>

          {/* ✅ ADDED - Logout button in top card */}
          <button
            className="profile-logout-btn"
            onClick={handleLogout}
            type="button"
          >
            🚪 Logout
          </button>
        </div>

        <div className="profile-grid">

          {/* Main card */}
          <div className="app-card fade-card profile-main-card">

            {/* Avatar + name */}
            <div className="profile-user-head">
              <div className={`profile-avatar ${user?.role === "admin" ? "admin" : "user"}`}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div>
                <h3 className="profile-user-name">{user?.name}</h3>
                <p className="profile-user-subtext">
                  {user?.role === "admin"
                    ? "Admin — Full platform access"
                    : "Member — Happy Shopping 🛒"}
                </p>
              </div>
            </div>

            {/* ✅ ADDED - Stats row for user */}
            {user?.role !== "admin" && (
             <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", marginBottom:"14px"}}>
  <div style={{background:"#f8f4ff", border:"0.5px solid #f0ebf8", borderRadius:"10px", padding:"8px", textAlign:"center"}}>
    <p style={{fontSize:"18px", fontWeight:"800", color:"#5e2080", margin:"0 0 3px 0"}}>{orderCount ?? "—"}</p>
    <p style={{fontSize:"9px", fontWeight:"700", color:"#9d7bb0", textTransform:"uppercase", letterSpacing:"0.3px", margin:0}}>Total Orders</p>
  </div>
  <div style={{background:"#f8f4ff", border:"0.5px solid #f0ebf8", borderRadius:"10px", padding:"8px", textAlign:"center"}}>
    <p style={{fontSize:"18px", fontWeight:"800", color:"#5e2080", margin:"0 0 3px 0"}}>💵</p>
    <p style={{fontSize:"9px", fontWeight:"700", color:"#9d7bb0", textTransform:"uppercase", letterSpacing:"0.3px", margin:0}}>COD Ready</p>
  </div>
  <div style={{background:"#f8f4ff", border:"0.5px solid #f0ebf8", borderRadius:"10px", padding:"8px", textAlign:"center"}}>
    <p style={{fontSize:"18px", fontWeight:"800", color:"#5e2080", margin:"0 0 3px 0"}}>✅</p>
    <p style={{fontSize:"9px", fontWeight:"700", color:"#9d7bb0", textTransform:"uppercase", letterSpacing:"0.3px", margin:0}}>Active Account</p>
  </div>
</div>
            )}

            <div className="profile-info-list">

              {/* Phone */}
              <div className="profile-info-box">
                <p className="profile-info-label">📱 Phone Number</p>
                <p className="profile-info-value">{user?.phone}</p>
              </div>

              {/* ✅ ADDED - Addresses */}
              <div className="profile-info-box">
                <div className="profile-address-header">
                  <p className="profile-info-label">📍 Saved Addresses</p>
                  {!addingAddress && (
                    <button className="profile-edit-btn" onClick={() => setAddingAddress(true)} type="button">
                      + Add
                    </button>
                  )}
                </div>

                {addresses.length === 0 && !addingAddress && (
                  <p className="profile-info-address">No addresses saved yet — add one for faster checkout</p>
                )}

                {addresses.map((addr, idx) => (
                  <div key={idx} style={{
                    background: "#f3ecff", border: "1px solid #e2d5f5", borderRadius: "10px",
                    padding: "12px", marginBottom: "8px", position: "relative"
                  }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#1e0a3c", fontSize: "14px" }}>
                      {addr.name} · {addr.phone}
                    </p>
                    <p style={{ margin: "0 0 2px", fontSize: "12px", color: "#6b5b8a" }}>{addr.street}, {addr.area}</p>
                    {addr.landmark && <p style={{ margin: "0 0 2px", fontSize: "12px", color: "#6b5b8a" }}>Near: {addr.landmark}</p>}
                    {addr.pincode  && <p style={{ margin: 0, fontSize: "12px", color: "#6b5b8a" }}>PIN: {addr.pincode}</p>}
                    <button onClick={() => handleDeleteAddress(idx)} type="button" style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626",
                      borderRadius: "6px", fontSize: "11px", fontWeight: 600, padding: "3px 8px", cursor: "pointer"
                    }}>✕</button>
                  </div>
                ))}

                {addingAddress && (
                  <div style={{ background: "#f9f6ff", border: "1px solid #e2d5f5", borderRadius: "12px", padding: "14px", marginTop: "8px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <label className="label-text">Full Name *</label>
                        <input className="input-field" placeholder="Name" value={newAddrName}
                          onChange={(e) => setNewAddrName(e.target.value)} style={{ fontSize: "15px", touchAction: "manipulation" }} />
                      </div>
                      <div>
                        <label className="label-text">Phone *</label>
                        <input className="input-field" placeholder="Phone" inputMode="numeric" maxLength={10} value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value.replace(/\D/g, ""))} style={{ fontSize: "15px", touchAction: "manipulation" }} />
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <label className="label-text">Street / House No *</label>
                        <input className="input-field" placeholder="e.g. 12/3, Gandhi Street" value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)} style={{ fontSize: "15px", touchAction: "manipulation" }} />
                      </div>
                      <div style={{ gridColumn: "1/-1" }}>
                        <label className="label-text">Area / Town *</label>
                        <input className="input-field" placeholder="e.g. Cumbum, Theni" value={newAddrArea}
                          onChange={(e) => setNewAddrArea(e.target.value)} style={{ fontSize: "15px", touchAction: "manipulation" }} />
                      </div>
                      <div>
                        <label className="label-text">Landmark</label>
                        <input className="input-field" placeholder="Near Temple" value={newAddrLandmark}
                          onChange={(e) => setNewAddrLandmark(e.target.value)} style={{ fontSize: "15px", touchAction: "manipulation" }} />
                      </div>
                      <div>
                        <label className="label-text">Pincode</label>
                        <input className="input-field" placeholder="625516" inputMode="numeric" maxLength={6} value={newAddrPincode}
                          onChange={(e) => setNewAddrPincode(e.target.value.replace(/\D/g, ""))} style={{ fontSize: "15px", touchAction: "manipulation" }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button className="primary-btn" onClick={handleAddAddress} disabled={savingNewAddr} type="button"
                        style={{ flex: 1 }}>
                        {savingNewAddr ? "Saving..." : "Save Address"}
                      </button>
                      <button className="secondary-btn" onClick={() => setAddingAddress(false)} type="button"
                        style={{ flex: 1 }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Role badge */}
              <div className={`profile-status-box ${user?.role === "admin" ? "admin" : "user"}`}>
                <p className={`profile-status-label ${user?.role === "admin" ? "admin" : "user"}`}>
                  Account Type
                </p>
                <p className={`profile-status-value ${user?.role === "admin" ? "admin" : "user"}`}>
                  {user?.role === "admin" ? "⚙️ Admin User" : "✅ Active User"}
                </p>
              </div>
            </div>
          </div>

          {/* Side cards */}
          <div className="profile-side-grid">

            {/* Quick actions */}
            <div className="app-card fade-card profile-side-card">
              <h3 className="profile-side-title">Quick Actions</h3>

              <div className="profile-actions">
                {user?.role === "admin" ? (
                  <>
                    <button className="primary-btn profile-action-btn" onClick={() => navigate("/admin/dashboard")} type="button">
                      📊 Open Dashboard
                    </button>
                    <button className="secondary-btn profile-action-btn" onClick={() => navigate("/admin/products")} type="button">
                      🛍️ Manage Products
                    </button>
                    <button className="profile-ghost-action" onClick={() => navigate("/admin/orders")} type="button">
                      📦 Manage Orders
                    </button>
                  </>
                ) : (
                  <>
                    <button className="primary-btn profile-action-btn" onClick={() => navigate("/products")} type="button">
                      🛍️ Shop Now
                    </button>
                    <button className="secondary-btn profile-action-btn" onClick={() => navigate("/cart")} type="button">
                      🛒 Open Cart
                    </button>
                    <button className="profile-ghost-action" onClick={() => navigate("/orders")} type="button">
                      📦 View My Orders
                    </button>
                  </>
                )}

                {/* ✅ ADDED - Logout at bottom of actions too */}
                <button className="profile-danger-action" onClick={handleLogout} type="button">
                  🚪 Logout
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="app-card fade-card profile-side-card">
              <h3 className="profile-side-title">
                {user?.role === "admin" ? "Admin Notes" : "Shopping Tips"}
              </h3>

              {user?.role === "admin" ? (
                <ul className="profile-notes-list">
                  <li>Keep product stock updated regularly.</li>
                  <li>Monitor pending orders and update statuses quickly.</li>
                  <li>Maintain accurate product names, pricing and images.</li>
                </ul>
              ) : (
                <ul className="profile-notes-list">
                  <li>Keep your delivery address updated for faster checkout.</li>
                  <li>Check product availability before ordering.</li>
                  <li>Track your order status from the Orders page.</li>
                  <li>Cash on delivery available on all orders.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;