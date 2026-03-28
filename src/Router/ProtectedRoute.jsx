import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);

  if (loading) return null;

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
