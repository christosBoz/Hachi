// src/PublicOnlyRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

export default function PublicOnlyRoute({ children }) {
  const { user, checkUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runCheck = async () => {
      await checkUser();
      setLoading(false);
    };
    runCheck();
  }, [checkUser]);

  if (loading) return <div>Loading...</div>;

  if (user) {
    // ✅ Redirect logged-in users to callback or dashboard
    return <Navigate to="/auth/callback" replace />;
  }

  // ✅ Not logged in → render child page (e.g. Home or Login)
  return children;
}
