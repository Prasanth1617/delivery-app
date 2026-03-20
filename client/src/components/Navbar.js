import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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
    updateCartCount();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // ✅ User bottom tabs (like Zepto)
  const userTabs = [
    { path: "/products", icon: "🛍️", label: "Shop" },
    { path: "/cart",     icon: "🛒", label: "Cart",   badge: cartCount },
    { path: "/orders",   icon: "📦", label: "Orders" },
    { path: "/profile",  icon: "👤", label: "Profile" },
  ];

  // ✅ Admin bottom tabs
  const adminTabs = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/products",  icon: "🛍️", label: "Products" },
    { path: "/admin/orders",    icon: "📦", label: "Orders" },
    { path: "/profile",         icon: "👤", label: "Profile" },
  ];

  const tabs = role === "admin" ? adminTabs : userTabs;

  return (
    <>
      {/* ══════════════════════════════════
          TOP NAVBAR — Desktop + Mobile header
      ══════════════════════════════════ */}
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

              <button onClick={handleLogout} className="navbar-desktop-logout" type="button">
                Logout
              </button>
            </div>
          )}

          {/* Desktop — not logged in */}
          {!token && (
            <div className="navbar-desktop-links">
              <Link to="/" className={`navbar-desktop-link ${isActive("/") ? "active" : ""}`}>
                Login
              </Link>
              <Link to="/signup" className="navbar-desktop-signup">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile right — cart badge + menu */}
          {token && (
            <div className="navbar-mobile-right">
              <Link to="/cart" className="navbar-mobile-cart">
                🛒
                {cartCount > 0 && (
                  <span className="navbar-mobile-cart-badge">{cartCount}</span>
                )}
              </Link>

              <button
                className="navbar-menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
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

        {/* ✅ Mobile dropdown menu — only for admin extra links */}
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
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="navbar-dropdown-logout" type="button">
                🚪 Logout
              </button>
            </div>
          </div>
        )}

        {/* ✅ Mobile dropdown — regular user */}
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

      {/* ══════════════════════════════════
          BOTTOM TAB BAR — Mobile only (like Zepto)
      ══════════════════════════════════ */}
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