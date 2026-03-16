import { Link, useLocation, useNavigate } from "react-router-dom";

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const cartCount = getCartCount();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("cart");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  if (!token) {
    return children;
  }

  const navLinkStyle = (path) => ({
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    color: isActive(path) ? "#ffffff" : "#374151",
    background: isActive(path)
      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
      : "#ffffff",
    border: isActive(path) ? "none" : "1px solid #e5e7eb",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    boxShadow: isActive(path)
      ? "0 10px 20px rgba(79, 70, 229, 0.22)"
      : "0 4px 10px rgba(15, 23, 42, 0.04)",
    transition: "all 0.2s ease",
  });

  return (
    <div>
      <div
        style={{
          background:
            role === "admin"
              ? "linear-gradient(135deg, #111827, #1f2937)"
              : "linear-gradient(135deg, #3482f0, #4f46e5)",
          color: "#ffffff",
          textAlign: "center",
          padding: "12px 16px",
          fontWeight: "700",
          fontSize: "14px",
          letterSpacing: "0.2px",
        }}
      >
        {role === "admin"
          ? "Admin mode active. Manage products, orders, and platform activity."
          : "Welcome back! Explore our latest products and enjoy seamless shopping."}
      </div>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "800",
                color: "#111827",
                letterSpacing: "-0.3px",
              }}
            >
              Delivery App
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              {role === "admin"
                ? "Admin control panel"
                : "Fast, simple grocery delivery"}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {role === "admin" ? (
              <>
                <Link to="/profile" style={navLinkStyle("/profile")}>
                  Profile
                </Link>

                <Link
                  to="/admin/dashboard"
                  style={navLinkStyle("/admin/dashboard")}
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/orders"
                  style={navLinkStyle("/admin/orders")}
                >
                  Admin Orders
                </Link>

                <Link
                  to="/admin/products"
                  style={navLinkStyle("/admin/products")}
                >
                  Admin Products
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" style={navLinkStyle("/profile")}>
                  Profile
                </Link>

                <Link to="/products" style={navLinkStyle("/products")}>
                  Products
                </Link>

                <Link to="/cart" style={navLinkStyle("/cart")}>
                  Cart
                  {cartCount > 0 && (
                    <span
                      style={{
                        minWidth: "22px",
                        height: "22px",
                        borderRadius: "999px",
                        background: isActive("/cart") ? "#ffffff" : "#4f46e5",
                        color: isActive("/cart") ? "#4f46e5" : "#ffffff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "800",
                        padding: "0 6px",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link to="/orders" style={navLinkStyle("/orders")}>
                  Orders
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #111827, #374151)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 18px rgba(17, 24, 39, 0.18)",
                transition: "all 0.2s ease",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}

export default AppLayout;