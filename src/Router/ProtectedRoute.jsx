import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clay-50">
        <div className="w-10 h-10 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return token ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
