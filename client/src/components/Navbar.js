import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("cart");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = (path) => ({
    textDecoration: "none",
    color: "#ffffff",
    fontWeight: "600",
    padding: "8px 12px",
    borderRadius: "8px",
    background: isActive(path) ? "#4f46e5" : "rgba(255,255,255,0.08)",
  });

  const adminNavStyle = (path) => ({
    textDecoration: "none",
    color: isActive(path) ? "#111827" : "#111827",
    fontWeight: "700",
    padding: "8px 12px",
    borderRadius: "8px",
    background: isActive(path) ? "#fde68a" : "#facc15",
  });

  return (
    <div
      style={{
        width: "100%",
        background: "#111827",
        color: "#fff",
        padding: "14px 24px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "22px" }}>Theni Retail Platform</h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            Fast, simple grocery delivery
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {!token ? (
            <>
              <Link to="/" style={navStyle("/")}>Login</Link>
              <Link to="/signup" style={navStyle("/signup")}>Signup</Link>
            </>
          ) : (
            <>
              <Link to="/profile" style={navStyle("/profile")}>Profile</Link>
              <Link to="/products" style={navStyle("/products")}>Products</Link>
              <Link to="/cart" style={navStyle("/cart")}>Cart</Link>
              <Link to="/orders" style={navStyle("/orders")}>Orders</Link>

              {role === "admin" && (
                <>
                  <Link to="/admin/dashboard" style={adminNavStyle("/admin/dashboard")}>
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/orders" style={adminNavStyle("/admin/orders")}>
                    Admin Orders
                  </Link>
                  <Link to="/admin/products" style={adminNavStyle("/admin/products")}>
                    Admin Products
                  </Link>
                </>
              )}

              <button onClick={handleLogout} style={logoutBtn}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const logoutBtn = {
  border: "none",
  background: "#dc2626",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

export default Navbar;