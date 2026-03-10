import { Link, useLocation, useNavigate } from "react-router-dom";

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isAdminPage = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  if (!token) {
    return children;
  }

  return (
    <div>
      <header className="app-navbar">
        <div className="app-navbar-inner">
          <div>
            <div className="app-brand">Delivery App</div>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              {isAdminPage
                ? "Admin control panel"
                : "Fast, simple grocery delivery"}
            </p>
          </div>

          <nav className="app-nav-links">
            {!isAdminPage ? (
              <>
                <Link
                  to="/profile"
                  className={`app-nav-link ${isActive("/profile") ? "active" : ""}`}
                >
                  Profile
                </Link>
                <Link
                  to="/products"
                  className={`app-nav-link ${isActive("/products") ? "active" : ""}`}
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className={`app-nav-link ${isActive("/cart") ? "active" : ""}`}
                >
                  Cart
                </Link>
                <Link
                  to="/orders"
                  className={`app-nav-link ${isActive("/orders") ? "active" : ""}`}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/dashboard"
                  className={`app-nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
                >
                  Admin
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`app-nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/orders"
                  className={`app-nav-link ${isActive("/admin/orders") ? "active" : ""}`}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/products"
                  className={`app-nav-link ${isActive("/admin/products") ? "active" : ""}`}
                >
                  Products
                </Link>
                <Link
                  to="/products"
                  className={`app-nav-link ${isActive("/products") ? "active" : ""}`}
                >
                  User View
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="secondary-btn"
              style={{ padding: "10px 14px" }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

export default AppLayout;