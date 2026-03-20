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

    // ✅ FIX: Listen to both storage (other tabs) AND custom event (same tab)
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

  const linkClass = (path) => `nav-link ${isActive(path) ? "active" : ""}`;

  const renderLinks = () => (
    <>
      {!token ? (
        <>
          <Link to="/" className={linkClass("/")}>
            Login
          </Link>

          <Link to="/signup" className={linkClass("/signup")}>
            Signup
          </Link>
        </>
      ) : (
        <>
          <Link to="/profile" className={linkClass("/profile")}>
            Profile
          </Link>

          <Link to="/products" className={linkClass("/products")}>
            Products
          </Link>

          <Link to="/cart" className={linkClass("/cart")}>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <Link to="/orders" className={linkClass("/orders")}>
            Orders
          </Link>

          {role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className={linkClass("/admin/dashboard")}
              >
                Dashboard
              </Link>

              <Link
                to="/admin/orders"
                className={linkClass("/admin/orders")}
              >
                Admin Orders
              </Link>

              <Link
                to="/admin/products"
                className={linkClass("/admin/products")}
              >
                Admin Products
              </Link>
            </>
          )}

          <button onClick={handleLogout} className="logout-btn" type="button">
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-top">
          <div>
            <h2 className="brand">Theni Retail</h2>
            <p className="subtitle">Fast grocery delivery</p>
          </div>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        <div className="nav-links desktop">{renderLinks()}</div>

        {menuOpen && <div className="nav-links mobile">{renderLinks()}</div>}
      </div>
    </nav>
  );
}

export default Navbar;