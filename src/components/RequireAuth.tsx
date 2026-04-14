import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';
import type { ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
