import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import studyOctopus from "../../assets/Hachi-Studying.png";
import "./Login.css";

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:5138/api/auth/validate", {
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Session check failed", err);
      }
    };

    checkSession();
  }, [setUser, navigate]);

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={studyOctopus} alt="Hachi studying" className="login-image" />
      </div>
      <div className="login-right">
        <div className="login-blank"></div>
      </div>
    </div>
  );
}
