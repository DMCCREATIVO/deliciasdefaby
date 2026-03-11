import { useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Memoizar el estado de autenticación para evitar re-renders innecesarios
  const authState = useMemo(() => ({
    user,
    isAdmin,
    isLoading,
    path: location.pathname
  }), [user, isAdmin, isLoading, location.pathname]);

  // Solo hacer log cuando realmente cambie el estado
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Estado de autenticación en ProtectedRoute:", authState);
    }
  }, [authState]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-pink"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Usuario no es admin:", { user: user.id, isAdmin });
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;