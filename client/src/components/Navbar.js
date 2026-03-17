import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();

    const handleStorage = () => updateCartCount();
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("resize", handleResize);

    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("cart");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = (path) => ({
    textDecoration: "none",
    color: isActive(path) ? "#ffffff" : "#d1d5db",
    fontWeight: "700",
    padding: isMobile ? "12px 14px" : "10px 14px",
    borderRadius: "12px",
    background: isActive(path)
      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
      : "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: isMobile ? "space-between" : "center",
    gap: "8px",
    transition: "0.25s ease",
    width: isMobile ? "100%" : "auto",
    boxSizing: "border-box",
  });

  const adminNavStyle = (path) => ({
    textDecoration: "none",
    color: isActive(path) ? "#111827" : "#111827",
    fontWeight: "800",
    padding: isMobile ? "12px 14px" : "10px 14px",
    borderRadius: "12px",
    background: isActive(path)
      ? "linear-gradient(135deg, #fde68a, #f59e0b)"
      : "#facc15",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: isMobile ? "space-between" : "center",
    width: isMobile ? "100%" : "auto",
    transition: "0.25s ease",
    boxSizing: "border-box",
  });

  const renderLinks = () => (
    <>
      {!token ? (
        <>
          <Link to="/" style={navStyle("/")}>
            Login
          </Link>
          <Link to="/signup" style={navStyle("/signup")}>
            Signup
          </Link>
        </>
      ) : (
        <>
          <Link to="/profile" style={navStyle("/profile")}>
            Profile
          </Link>

          <Link to="/products" style={navStyle("/products")}>
            Products
          </Link>

          <Link to="/cart" style={navStyle("/cart")}>
            <span>Cart</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: "#facc15",
                  color: "#111827",
                  borderRadius: "999px",
                  padding: "3px 8px",
                  fontSize: "12px",
                  fontWeight: "800",
                  minWidth: "24px",
                  textAlign: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/orders" style={navStyle("/orders")}>
            Orders
          </Link>

          {role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                style={adminNavStyle("/admin/dashboard")}
              >
                Admin Dashboard
              </Link>

              <Link to="/admin/orders" style={adminNavStyle("/admin/orders")}>
                Admin Orders
              </Link>

              <Link
                to="/admin/products"
                style={adminNavStyle("/admin/products")}
              >
                Admin Products
              </Link>
            </>
          )}

          <button onClick={handleLogout} style={logoutBtn(isMobile)}>
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <nav
      style={{
        width: "100%",
        background: "rgba(17, 24, 39, 0.96)",
        backdropFilter: "blur(12px)",
        color: "#fff",
        padding: isMobile ? "12px 14px" : "14px 20px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? "18px" : "24px",
                fontWeight: "800",
                lineHeight: "1.2",
                wordBreak: "break-word",
              }}
            >
              Theni Retail Platform
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: isMobile ? "11px" : "12px",
                color: "#9ca3af",
                lineHeight: "1.4",
              }}
            >
              Fast, simple grocery delivery
            </p>
          </div>

          {isMobile ? (
            <button onClick={() => setMenuOpen(!menuOpen)} style={menuBtn}>
              {menuOpen ? "✕" : "☰"}
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {renderLinks()}
            </div>
          )}
        </div>

        {isMobile && menuOpen && (
          <div
            style={{
              marginTop: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "rgba(255,255,255,0.04)",
              padding: "14px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
            }}
          >
            {renderLinks()}
          </div>
        )}
      </div>
    </nav>
  );
}

const logoutBtn = (isMobile) => ({
  border: "none",
  background: "linear-gradient(135deg, #dc2626, #ef4444)",
  color: "#fff",
  padding: isMobile ? "12px 14px" : "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "800",
  width: isMobile ? "100%" : "auto",
  boxSizing: "border-box",
});

const menuBtn = {
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "700",
  flexShrink: 0,
};

export default Navbar;