import { useAppSelector } from "@/hooks/useAppSelector";
import { Navigate, Outlet } from "react-router";

function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default ProtectedRoutes;
