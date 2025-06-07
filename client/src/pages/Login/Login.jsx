import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithRedirect,
  signUp,
  signIn,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";
import { useUser } from "../../contexts/UserContext";
import studyOctopus from "../../assets/Hachi-Studying.png";
import "./Login.css";

function EmailLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetStep, setResetStep] = useState("request");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await signIn({ username: email, password });
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await resetPassword({ username: email });
      setResetStep("confirm");
      setMessage("Code sent to your email.");
    } catch (err) {
      setError("Reset failed: " + err.message);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: resetCode,
        newPassword,
      });
      setMessage("Password successfully changed! You can now log in.");
      setResetMode(false);
    } catch (err) {
      setError("Reset failed: " + err.message);
    }
  };

  return (
    <div className="email-login-form">
      {!resetMode ? (
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          

          <label>Password</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setResetMode(true);
                setMessage("");
                setError("");
              }}
            >
              Forgot Password?
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="login-btn primary" type="submit">
            Log in
          </button>
        </form>
      ) : (
        <form className="login-form" onSubmit={resetStep === "request" ? handleResetRequest : handleConfirmReset}>
          <h3>Password Reset</h3>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={resetStep === "confirm"}
          />

          {resetStep === "confirm" && (
            <>
              <label>Confirmation Code</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
              />
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </>
          )}

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button className="login-btn primary" type="submit">
            {resetStep === "request" ? "Send Reset Code" : "Confirm New Password"}
          </button>

          <button
            type="button"
            className="text-button"
            onClick={() => {
              setResetMode(false);
              setResetStep("request");
              setError("");
              setMessage("");
              setPassword("");
              setNewPassword("");
              setResetCode("");
            }}
            style={{ marginTop: "10px" }}
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  );
}

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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

    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
        },
      });

      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setShowConfirm(true);
        setSuccess("Confirmation code sent to your email.");
      }
    } catch (err) {
      setError("Sign up failed: " + err.message);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      setSuccess("Account confirmed! You can now log in.");
    } catch (err) {
      setError("Confirmation failed: " + err.message);
    }
  };

  const handleFederatedSignUp = (provider) => {
    if (provider === "Microsoft") {
      window.location.href =
        `https://us-east-2qnjhtqnac.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=Microsoft&client_id=cvprj4cqhl4h6kjsaaem962jf&response_type=code&redirect_uri=http://localhost:3000/auth/callback&scope=email%20openid%20profile&code_challenge_method=S256&code_challenge=xyz`;
    } else {
      signInWithRedirect({ provider });
    }
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
      {showConfirm ? (
        <form className="login-form" onSubmit={handleConfirm}>
          <label>Confirmation Code</label>
          <input
            type="text"
            placeholder="Enter the code from your email"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button className="login-btn primary" type="submit">
            Confirm
          </button>
        </form>
      ) : (
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
          {success && <p className="success-text">{success}</p>}
          <button className="login-btn primary" type="submit">
            Sign up
          </button>
        </form>
      )}
    </div>
  );
}

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [showSignUp, setShowSignUp] = useState(false);

  const handleFederatedLogin = (provider) => {
    if (provider === "Microsoft") {
      window.location.href =
        `https://us-east-2qnjhtqnac.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=Microsoft&client_id=cvprj4cqhl4h6kjsaaem962jf&response_type=code&redirect_uri=http://localhost:3000/auth/callback&scope=email%20openid%20profile&code_challenge_method=S256&code_challenge=xyz`;
    } else {
      signInWithRedirect({ provider });
    }
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
              <EmailLoginForm />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
