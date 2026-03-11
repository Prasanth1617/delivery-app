import { Navigate } from "react-router-dom";

function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default PrivateRoute;