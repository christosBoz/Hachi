import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import studyOctopus from "../../assets/Hachi-Studying.png";
import "./Login.css";






function SignUpForm () {


  return (
    <div className="sign-up-form">
      <h2>Create your Hachi account</h2>
      <div className="choices-box">
            <button className="login-btn google"
             onClick={() => {
              window.location.href = "http://localhost:5138/api/auth/login/google";
            }}
            >
              Sign Up with Google</button>
            <button className="login-btn apple">Sign Up with Microsoft</button>
            <button className="login-btn microsoft">Sign Up with Facebook</button>
            <button className="login-btn apple">Sign Up with Apple</button>
          </div>
      <form className="login-form">
        <label>Email</label>
        <input type="email" placeholder="you@example.com" />
        <label>Username</label>
        <input type="text" placeholder="Choose a username" />
        <label>Password</label>
        <input type="password" placeholder="Create a password" />
        <label>Re-Type Password</label>
        <input type="password" placeholder="Re-Type Password" />
        <p className="terms-text">
          By clicking Sign up, you accept Hachi’s Terms of Service and Privacy Policy.
        </p>
        <button className="login-btn primary">Sign up</button>
      </form>
    </div>
  );
}

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showSignUp, setShowSignUp] = useState(false);


 

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
        <div className="login-form-container">
        <div className="login-tabs">
        <button
          className={`tab ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("signup")
            setShowSignUp(true)
          }}
        >
          Sign up
          {activeTab === "signup" && <div className="tab-underline" />}
        </button>
        <button
          className={`tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => {setActiveTab("login")
            setShowSignUp(false)
          }}
        >
          Log in
          {activeTab === "login" && <div className="tab-underline" />}
        </button>
      </div>
      {showSignUp ? (
        <SignUpForm />
      ) : (
        <>      
          <div className="choices-box">
            <button className="login-btn google"
             onClick={() => {
              window.location.href = "http://localhost:5138/api/auth/login/google";
            }}
            >
              Log in with Google</button>
            <button className="login-btn apple">Log in with Microsoft</button>
            <button className="login-btn microsoft">Log in with Facebook</button>
            <button className="login-btn apple">Log in with Apple</button>
          </div>
  
          <div className="divider">or email</div>
  
          <form className="login-form">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
            <label className="password-label">
              Password
              <a href="#">Forgot password</a>
            </label>
            <input type="password" placeholder="Enter password" />
            <p className="terms-text">
              By clicking Log in, you accept Hachi’s Terms of Service and Privacy Policy.
            </p>
            <button className="login-btn primary">Log in</button>
          </form>
  
          {/* <button className="login-btn secondary">Create an account</button> */}
          </>
      )}
        </div>
      </div>
    </div>
  );
  
}
