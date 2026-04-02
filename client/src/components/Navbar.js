import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { token, role, logout } = useAuth();

  const [cartCount, setCartCount]     = useState(0);
  const [darkMode, setDarkMode]       = useState(() => localStorage.getItem("darkMode") === "true");

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
    document.documentElement.classList.toggle("dark-mode", next);
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark-mode");
  }, [darkMode]);

  const updateCartCount = () => {
    const cart  = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("storage",     updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage",     updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => { updateCartCount(); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setCartCount(0);
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
    { path: "/admin/orders",    icon: "📦", label: "Orders" },
    { path: "/profile",         icon: "👤", label: "Profile" },
  ];

  const tabs = role === "admin" ? adminTabs : userTabs;

  return (
    <>
      {/* ── Top Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">

          {/* Brand */}
          <div
            className="navbar-brand"
            onClick={() => navigate(token ? (role === "admin" ? "/admin/dashboard" : "/products") : "/")}
            style={{ cursor: "pointer" }}
          >
            <div className="navbar-logo">🛒</div>
            <div>
              <div className="navbar-brand-name">Theni Retail</div>
              <div className="navbar-brand-sub">Fast grocery delivery</div>
            </div>
          </div>

          {/* Right side */}
          <div className="navbar-right">

            {/* Dark mode toggle */}
            <button className="navbar-icon-btn" onClick={toggleDarkMode} type="button" title="Toggle dark mode">
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Cart icon — user only */}
            {token && role !== "admin" && (
              <Link to="/cart" className="navbar-icon-btn navbar-cart-btn">
                🛒
                {cartCount > 0 && (
                  <span className="navbar-cart-badge">{cartCount}</span>
                )}
              </Link>
            )}

            {/* Desktop links */}
            {token && (
              <div className="navbar-desktop-links">
                {tabs.map((tab) => (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`navbar-desktop-link ${isActive(tab.path) ? "active" : ""}`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                    {tab.badge > 0 && (
                      <span className="navbar-desktop-badge">{tab.badge}</span>
                    )}
                  </Link>
                ))}
                <button onClick={handleLogout} className="navbar-logout-btn" type="button">
                  Logout
                </button>
              </div>
            )}

            {/* Desktop — not logged in */}
            {!token && (
              <div className="navbar-desktop-links">
                <Link to="/login" className="navbar-desktop-link">Login</Link>
                <Link to="/signup" className="navbar-signup-btn">Sign Up</Link>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* ── Bottom Tab Bar — mobile only ── */}
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