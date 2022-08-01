import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user || (adminOnly && !user.admin)) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
