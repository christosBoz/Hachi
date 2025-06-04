// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { useUser } from "../contexts/UserContext";

export default function Logout() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut();
        setUser(null);
        navigate("/login"); // or wherever you'd like to send them
      } catch (err) {
        console.error("Logout failed:", err);
        navigate("/"); // fallback
      }
    };

    doLogout();
  }, [navigate, setUser]);

  return <p>Signing you out...</p>;
}
