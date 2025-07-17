import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export const RouteGuard = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: RouteGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      setLocation("/login");
      return;
    }

    // If specific roles are required and user doesn't have the required role
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      setLocation("/dashboard");
      return;
    }
  }, [isAuthenticated, isLoading, user, requireAuth, allowedRoles, setLocation]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect to login
  }

  // If specific roles are required and user doesn't have the required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
};

// Convenience components for common guard patterns
export const PublicRoute = ({ children }: { children: React.ReactNode }) => (
  <RouteGuard requireAuth={false}>
    {children}
  </RouteGuard>
);

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => (
  <RouteGuard requireAuth={true}>
    {children}
  </RouteGuard>
);

export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <RouteGuard requireAuth={true} allowedRoles={["admin"]}>
    {children}
  </RouteGuard>
);

export const OperatorRoute = ({ children }: { children: React.ReactNode }) => (
  <RouteGuard requireAuth={true} allowedRoles={["operator", "admin"]}>
    {children}
  </RouteGuard>
);