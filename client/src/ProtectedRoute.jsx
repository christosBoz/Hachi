import { Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, profileComplete } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user || !profileComplete) {
    return <Navigate to="/" replace />;
  }

  return children;
}
