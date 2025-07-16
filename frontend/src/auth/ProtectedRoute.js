import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import React from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Show NoAccess page if user role is not allowed
    const NoAccess = React.lazy(() => import('../pages/NoAccess'));
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <NoAccess />
      </React.Suspense>
    );
  }

  return children;
};

export default ProtectedRoute;

