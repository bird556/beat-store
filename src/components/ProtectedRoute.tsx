// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Use the custom hook

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, render the child routes (e.g., Dashboard)
  if (isAuthenticated) {
    return <Outlet />;
  }

  // If not authenticated, redirect to the admin login page
  return <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
