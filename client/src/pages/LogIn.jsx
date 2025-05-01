import './Login.css';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import monkeyorange from "../assets/monkeyorange.png";

function BackgroundAnimation() {
    return (
        <div className="ocean-background">
            {/* You can add ocean-related animation images here */}
        </div>
    );
}

const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "15px",
    cursor: "pointer",
    backgroundColor: "white",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)"
};

const iconStyle = {
    marginRight: "10px"
};

function handleGoogleLogin() {
    window.location.href = "http://localhost:5138/api/auth/login/google";
}

function handleMicrosoftLogin() {
    window.location.href = "http://localhost:5138/api/auth/login/microsoft";
}

function MethodPicker() {
    return (
        <div style={{
            backgroundColor: "white",
            zIndex: 20,
            padding: "40px",
            borderRadius: "10px",
            margin: "20px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            textAlign: "center",
            minWidth: "300px",
        }}>
            <h1 style={{ color: "#b300ff", marginBottom: "10px" }}>Hachi</h1>
            <p style={{ color: "#b300ff", marginBottom: "30px" }}>Welcome<br />Sign in with the following methods</p>

            <div style={buttonStyle} onClick={handleGoogleLogin}>
                <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" style={iconStyle} />
                Continue with Google
            </div>

            <div style={buttonStyle} onClick={handleMicrosoftLogin}>
                <img src="https://img.icons8.com/color/24/000000/microsoft.png" alt="Microsoft" style={iconStyle} />
                Continue with Microsoft
            </div>
        </div>
    );
}

function Login() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        // Check for valid session
        const checkSession = async () => {
            try {
                const res = await fetch("http://localhost:5138/api/auth/validate", {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    navigate("/test"); // redirect to protected page
                }
            } catch (err) {
                console.error("Session check failed", err);
            }
        };

        checkSession();
    }, [setUser, navigate]);

    return (
        <div style={{ backgroundColor: "#3C79FF", minHeight: "100vh", overflow: "hidden" }}>
            <BackgroundAnimation />
            <MethodPicker />
        </div>
    );
}

export default Login;
