// ProtectedRoute.tsx
import { authService } from "../services/authService";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    // Check if user has token = is logged in
    const isAuthenticated = authService.isLoggedIn();

    // If not logged in, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If logged in, show the protected page (Dashboard)
    return <>{children}</>;
}