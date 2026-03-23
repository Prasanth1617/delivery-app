import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ ADDED - notification state
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const notifRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
    updateCartCount();
  }, [location.pathname]);

  // ✅ ADDED - Poll for new orders every 30 seconds (admin only)
  useEffect(() => {
    if (!token || role !== "admin") return;

    const checkNewOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const orders = res.data;

        // Get last seen order count from localStorage
        const lastSeenCount = parseInt(localStorage.getItem("lastSeenOrderCount") || "0");
        const currentCount = orders.length;

        if (currentCount > lastSeenCount) {
          setNewOrderCount(currentCount - lastSeenCount);
        }

        // Store 5 most recent orders for notification panel
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.log("Notification check error:", err);
      }
    };

    // Check immediately on mount
    checkNewOrders();

    // Then check every 30 seconds
    const interval = setInterval(checkNewOrders, 30000);
    return () => clearInterval(interval);
  }, [token, role]);

  // ✅ ADDED - Close notif panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ ADDED - Mark all notifications as read
  const markAllRead = () => {
    localStorage.setItem("lastSeenOrderCount", String(recentOrders.length + parseInt(localStorage.getItem("lastSeenOrderCount") || "0")));
    setNewOrderCount(0);
    setNotifOpen(false);
    navigate("/admin/orders");
  };

  const handleLogout = () => {
    localStorage.clear();
    setCartCount(0);
    setNewOrderCount(0);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const userTabs = [
    { path: "/products", icon: "🛍️", label: "Shop" },
    { path: "/cart",     icon: "🛒", label: "Cart",   badge: cartCount },
    { path: "/orders",   icon: "📦", label: "Orders" },
    { path: "/profile",  icon: "👤", label: "Profile" },
  ];

  const adminTabs = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/products",  icon: "🛍️", label: "Products" },
    { path: "/admin/orders",    icon: "📦", label: "Orders", badge: newOrderCount },
    { path: "/profile",         icon: "👤", label: "Profile" },
  ];

  const tabs = role === "admin" ? adminTabs : userTabs;

  // ✅ Format order time
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) +
      " · " + date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">

          {/* Brand */}
          <div className="navbar-brand" onClick={() => navigate(token ? "/products" : "/")} style={{ cursor: "pointer" }}>
            <div className="navbar-logo">🛒</div>
            <div>
              <div className="navbar-brand-name">Theni Retail</div>
              <div className="navbar-brand-sub">Fast grocery delivery</div>
            </div>
          </div>

          {/* Desktop links */}
          {token && (
            <div className="navbar-desktop-links">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`navbar-desktop-link ${isActive(tab.path) ? "active" : ""}`}
                >
                  <span className="navbar-desktop-icon">{tab.icon}</span>
                  {tab.label}
                  {tab.badge > 0 && (
                    <span className="navbar-desktop-badge">{tab.badge}</span>
                  )}
                </Link>
              ))}

              {/* ✅ ADDED - Admin notification bell (desktop) */}
              {role === "admin" && (
                <div className="navbar-notif-wrap" ref={notifRef}>
                  <button
                    className="navbar-notif-btn"
                    onClick={() => setNotifOpen(!notifOpen)}
                    type="button"
                  >
                    🔔
                    {newOrderCount > 0 && (
                      <span className="navbar-notif-badge">{newOrderCount}</span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {notifOpen && (
                    <div className="navbar-notif-panel">
                      <div className="navbar-notif-header">
                        <span className="navbar-notif-title">
                          🔔 New Orders
                          {newOrderCount > 0 && (
                            <span className="navbar-notif-count">{newOrderCount} new</span>
                          )}
                        </span>
                        <button
                          className="navbar-notif-clear"
                          onClick={markAllRead}
                          type="button"
                        >
                          View All →
                        </button>
                      </div>

                      {recentOrders.length === 0 ? (
                        <div className="navbar-notif-empty">No orders yet</div>
                      ) : (
                        <div className="navbar-notif-list">
                          {recentOrders.map((order, i) => (
                            <div
                              key={order._id}
                              className={`navbar-notif-item ${i < newOrderCount ? "unread" : ""}`}
                              onClick={markAllRead}
                            >
                              <div className="navbar-notif-item-icon">
                                {i < newOrderCount ? "🆕" : "📦"}
                              </div>
                              <div className="navbar-notif-item-body">
                                <p className="navbar-notif-item-title">
                                  Order ₹{order.totalAmount}
                                  {i < newOrderCount && (
                                    <span className="navbar-notif-new-pill">NEW</span>
                                  )}
                                </p>
                                <p className="navbar-notif-item-sub">
                                  {order.items.length} items · {order.status} · {formatTime(order.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button onClick={handleLogout} className="navbar-desktop-logout" type="button">
                Logout
              </button>
            </div>
          )}

          {/* Desktop — not logged in */}
          {!token && (
            <div className="navbar-desktop-links">
              <Link to="/login" className={`navbar-desktop-link ${isActive("/login") ? "active" : ""}`}>
                Login
              </Link>
              <Link to="/signup" className="navbar-desktop-signup">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile right */}
          {token && (
            <div className="navbar-mobile-right">

              {/* ✅ ADDED - Bell icon on mobile for admin */}
              {role === "admin" && (
                <button
                  className="navbar-mobile-bell"
                  onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false); }}
                  type="button"
                >
                  🔔
                  {newOrderCount > 0 && (
                    <span className="navbar-mobile-bell-badge">{newOrderCount}</span>
                  )}
                </button>
              )}

              {role !== "admin" && (
                <Link to="/cart" className="navbar-mobile-cart">
                  🛒
                  {cartCount > 0 && (
                    <span className="navbar-mobile-cart-badge">{cartCount}</span>
                  )}
                </Link>
              )}

              <button
                className="navbar-menu-btn"
                onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); }}
                type="button"
                aria-label="Menu"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          )}

          {!token && (
            <div className="navbar-mobile-right">
              <Link to="/signup" className="navbar-mobile-signup">Sign Up</Link>
            </div>
          )}
        </div>

        {/* ✅ Mobile notification panel */}
        {notifOpen && token && role === "admin" && (
          <div className="navbar-notif-mobile">
            <div className="navbar-notif-header">
              <span className="navbar-notif-title">
                🔔 New Orders
                {newOrderCount > 0 && (
                  <span className="navbar-notif-count">{newOrderCount} new</span>
                )}
              </span>
              <button className="navbar-notif-clear" onClick={markAllRead} type="button">
                View All →
              </button>
            </div>
            {recentOrders.length === 0 ? (
              <div className="navbar-notif-empty">No orders yet</div>
            ) : (
              <div className="navbar-notif-list">
                {recentOrders.map((order, i) => (
                  <div
                    key={order._id}
                    className={`navbar-notif-item ${i < newOrderCount ? "unread" : ""}`}
                    onClick={markAllRead}
                  >
                    <div className="navbar-notif-item-icon">
                      {i < newOrderCount ? "🆕" : "📦"}
                    </div>
                    <div className="navbar-notif-item-body">
                      <p className="navbar-notif-item-title">
                        Order ₹{order.totalAmount}
                        {i < newOrderCount && (
                          <span className="navbar-notif-new-pill">NEW</span>
                        )}
                      </p>
                      <p className="navbar-notif-item-sub">
                        {order.items.length} items · {order.status} · {formatTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile dropdown — admin */}
        {menuOpen && token && role === "admin" && (
          <div className="navbar-dropdown">
            <div className="navbar-dropdown-inner">
              <div className="navbar-dropdown-title">Admin Panel</div>
              <Link to="/admin/dashboard" className="navbar-dropdown-link" onClick={() => setMenuOpen(false)}>
                📊 Dashboard
              </Link>
              <Link to="/admin/products" className="navbar-dropdown-link" onClick={() => setMenuOpen(false)}>
                🛍️ Manage Products
              </Link>
              <Link to="/admin/orders" className="navbar-dropdown-link" onClick={() => setMenuOpen(false)}>
                📦 Manage Orders
                {newOrderCount > 0 && (
                  <span className="navbar-dropdown-badge">{newOrderCount} new</span>
                )}
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="navbar-dropdown-logout" type="button">
                🚪 Logout
              </button>
            </div>
          </div>
        )}

        {/* Mobile dropdown — user */}
        {menuOpen && token && role !== "admin" && (
          <div className="navbar-dropdown">
            <div className="navbar-dropdown-inner">
              <div className="navbar-dropdown-title">My Account</div>
              <Link to="/profile" className="navbar-dropdown-link" onClick={() => setMenuOpen(false)}>
                👤 My Profile
              </Link>
              <Link to="/orders" className="navbar-dropdown-link" onClick={() => setMenuOpen(false)}>
                📦 My Orders
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="navbar-dropdown-logout" type="button">
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom tab bar */}
      {token && (
        <nav className="bottom-navbar">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`bottom-tab ${active ? "active" : ""}`}
              >
                <div className="bottom-tab-icon-wrap">
                  <span className="bottom-tab-icon">{tab.icon}</span>
                  {tab.badge > 0 && (
                    <span className="bottom-tab-badge">{tab.badge}</span>
                  )}
                </div>
                <span className="bottom-tab-label">{tab.label}</span>
                {active && <div className="bottom-tab-dot" />}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}

export default Navbar;