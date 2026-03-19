import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children, adminOnly = false }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 Not logged in
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 🔒 Admin only protection
  if (adminOnly && role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default PrivateRoute;