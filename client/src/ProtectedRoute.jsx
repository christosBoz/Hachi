// src/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, checkUser } = useUser();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const runCheck = async () => {
      await checkUser();
      setLoading(false);
    };
    runCheck();
  }, [checkUser]);

  if (loading) return <div>Loading...</div>;

  const isOnAuthPage = ["/", "/login", "/signup"].includes(location.pathname);

  if (!user) {
    // ❌ Not authenticated, kick to homepage
    return <Navigate to="/login" replace />;
  }

  if (user && isOnAuthPage) {
    // ✅ Logged in but on login/signup/home -> redirect to callback to finish routing
    return <Navigate to="/auth/callback" replace />;
  }

  // ✅ Logged in and on valid protected route
  return children;
}
