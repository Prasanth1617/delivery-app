import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children, adminOnly = false }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "admin") return <Navigate to="/products" replace />;

  return children;
}

export default PrivateRoute;