// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithRedirect } from "aws-amplify/auth";
import { useUser } from "../../contexts/UserContext";
import studyOctopus from "../../assets/Hachi-Studying.png";
import "./Login.css";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    alert("Sign up flow is handled via Cognito Hosted UI.");
  };

  const handleFederatedSignUp = (provider) => {
    signInWithRedirect({ provider });

  };

  return (
    <div className="sign-up-form">
      <h2>Create your Hachi account</h2>
      <div className="choices-box">
        <button className="login-btn" onClick={() => handleFederatedSignUp("Google")}>
          Sign Up with Google
        </button>
        <button className="login-btn" onClick={() => handleFederatedSignUp("Facebook")}>
          Sign Up with Facebook
        </button>
        <button className="login-btn" onClick={() => handleFederatedSignUp("Microsoft")}>
          Sign Up with Microsoft
        </button>
      </div>
      <div className="divider">or sign up with email</div>
      <form className="login-form" onSubmit={handleSignUp}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>Re-Type Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error-text">{error}</p>}
        <button className="login-btn primary" type="submit">
          Sign up
        </button>
      </form>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [activeTab, setActiveTab] = useState("login");
  const [showSignUp, setShowSignUp] = useState(false);

  const handleFederatedLogin = (provider) => {
    signInWithRedirect({ provider });
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={studyOctopus} alt="Hachi studying" className="login-image" />
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-tabs">
            <button className={`tab ${activeTab === "signup" ? "active" : ""}`} onClick={() => { setActiveTab("signup"); setShowSignUp(true); }}>
              Sign up
            </button>
            <button className={`tab ${activeTab === "login" ? "active" : ""}`} onClick={() => { setActiveTab("login"); setShowSignUp(false); }}>
              Log in
            </button>
          </div>
          {showSignUp ? (
            <SignUpForm />
          ) : (
            <>
              <div className="choices-box">
                <button className="login-btn" onClick={() => handleFederatedLogin("Google")}>
                  Log in with Google
                </button>
                <button className="login-btn" onClick={() => handleFederatedLogin("Facebook")}>
                  Log in with Facebook
                </button>
                <button className="login-btn" onClick={() => handleFederatedLogin("Microsoft")}>
                  Log in with Microsoft
                </button>
              </div>
              <div className="divider">or continue with email</div>
              <form
                className="login-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Email login is handled via Cognito Hosted UI.");
                }}
              >
                <label>Email</label>
                <input name="email" type="email" required />
                <label>Password</label>
                <input name="password" type="password" required />
                <button className="login-btn primary" type="submit">
                  Log in
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
