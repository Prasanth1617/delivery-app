import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./AppLayout.css";

function AppLayout({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const hideNavbarRoutes = ["/", "/signup", "/forgot-password"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  if (!token || shouldHideNavbar) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <div
        className={`app-layout-banner ${
          role === "admin" ? "admin-banner" : "user-banner"
        }`}
      >
        <div className="app-layout-banner-inner">
          {role === "admin"
            ? "Admin mode active. Manage products, orders, and platform activity."
            : "Welcome back! Explore fresh products, quick ordering, and a smoother shopping experience."}
        </div>
      </div>

      <Navbar />

      <main className="app-layout-content">{children}</main>
    </div>
  );
}

export default AppLayout;