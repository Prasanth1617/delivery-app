import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children, adminOnly = false }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default PrivateRoute;