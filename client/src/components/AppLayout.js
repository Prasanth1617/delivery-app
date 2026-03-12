import { Link, useLocation, useNavigate } from "react-router-dom";

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdminPage = location.pathname.startsWith("/admin");

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
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: isActive(path) ? "#ffffff" : "#374151",
    background: isActive(path) ? "#4f46e5" : "transparent",
    border: isActive(path) ? "none" : "1px solid #e5e7eb",
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
  });

  return (
    <div>
      <div
        style={{
          background: "#3482f0",
          color: "#ffffff",
          textAlign: "center",
          padding: "10px",
          fontWeight: "700",
        }}
      >
        Welcome back! Explore our latest products and enjoy seamless shopping.
      </div>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "14px 20px",
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
                fontSize: "22px",
                fontWeight: "800",
                color: "#111827",
              }}
            >
              Delivery App
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              {isAdminPage ? "Admin control panel" : "Fast, simple grocery delivery"}
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
            {!isAdminPage ? (
              <>
                <Link to="/profile" style={navLinkStyle("/profile")}>Profile</Link>
                <Link to="/products" style={navLinkStyle("/products")}>Products</Link>
                <Link to="/cart" style={navLinkStyle("/cart")}>Cart</Link>
                <Link to="/orders" style={navLinkStyle("/orders")}>Orders</Link>

                {role === "admin" && (
                  <Link to="/admin/dashboard" style={navLinkStyle("/admin/dashboard")}>
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/admin/dashboard" style={navLinkStyle("/admin/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/admin/orders" style={navLinkStyle("/admin/orders")}>
                  Orders
                </Link>
                <Link to="/admin/products" style={navLinkStyle("/admin/products")}>
                  Products
                </Link>
                <Link to="/products" style={navLinkStyle("/products")}>
                  User View
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "700",
                background: "#111827",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
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