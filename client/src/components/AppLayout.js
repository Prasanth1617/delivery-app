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
    padding: "11px 16px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: "700",
    color: isActive(path) ? "#ffffff" : "#374151",
    background: isActive(path)
      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
      : "rgba(255,255,255,0.86)",
    border: isActive(path) ? "none" : "1px solid rgba(229,231,235,0.95)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    boxShadow: isActive(path)
      ? "0 14px 28px rgba(79, 70, 229, 0.24)"
      : "0 8px 18px rgba(15, 23, 42, 0.05)",
    transition: "all 0.22s ease",
    backdropFilter: "blur(8px)",
  });

  return (
    <div>
      <div
        style={{
          background:
            role === "admin"
              ? "linear-gradient(135deg, #0f172a, #1f2937)"
              : "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
          color: "#ffffff",
          textAlign: "center",
          padding: "12px 16px",
          fontWeight: "700",
          fontSize: "14px",
          letterSpacing: "0.2px",
          boxShadow:
            role === "admin"
              ? "0 10px 24px rgba(15, 23, 42, 0.22)"
              : "0 10px 24px rgba(79, 70, 229, 0.20)",
        }}
      >
        {role === "admin"
          ? "Admin mode active. Manage products, orders, and platform activity."
          : "Welcome back! Explore fresh products, quick ordering, and a smoother shopping experience."}
      </div>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background:
            role === "admin"
              ? "rgba(255,255,255,0.94)"
              : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(229, 231, 235, 0.95)",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.07)",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background:
                  role === "admin"
                    ? "linear-gradient(135deg, #111827, #374151)"
                    : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                boxShadow:
                  role === "admin"
                    ? "0 12px 22px rgba(17, 24, 39, 0.18)"
                    : "0 14px 24px rgba(79, 70, 229, 0.22)",
              }}
            >
              {role === "admin" ? "⚙️" : "🛒"}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#111827",
                  letterSpacing: "-0.4px",
                }}
              >
                Delivery App
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                {role === "admin"
                  ? "Premium admin control center"
                  : "Fresh groceries. Fast checkout. Better shopping."}
              </p>
            </div>
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
                  Orders
                </Link>

                <Link
                  to="/admin/products"
                  style={navLinkStyle("/admin/products")}
                >
                  Products
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
                        minWidth: "24px",
                        height: "24px",
                        borderRadius: "999px",
                        background: isActive("/cart")
                          ? "#ffffff"
                          : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        color: isActive("/cart") ? "#4f46e5" : "#ffffff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "800",
                        padding: "0 7px",
                        boxShadow: isActive("/cart")
                          ? "none"
                          : "0 8px 16px rgba(79, 70, 229, 0.20)",
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
                padding: "11px 17px",
                borderRadius: "14px",
                fontSize: "14px",
                fontWeight: "800",
                background:
                  role === "admin"
                    ? "linear-gradient(135deg, #111827, #374151)"
                    : "linear-gradient(135deg, #0f172a, #1f2937)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 22px rgba(17, 24, 39, 0.18)",
                transition: "all 0.22s ease",
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