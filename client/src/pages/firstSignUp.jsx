import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasicDatePicker from "../components/BasicDatePicker";

function FirstSignUp() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [school, setSchool] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Check for pre_signup_email cookie by pinging the backend
  useEffect(() => {
    const checkPreSignup = async () => {
      try {
        const res = await fetch("http://localhost:5138/api/auth/check-pre-signup", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setMessage(`Signing up as: ${data.email}`);
        } else {
          navigate("/"); // 🚫 No cookie/session, redirect home
        }
      } catch (err) {
        console.error("Error checking pre-signup:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkPreSignup();
  }, [navigate]);

  const nextStep = async () => {
    if (step === 1) {
      if (!validateUsername(username)) {
        setUsernameError("Username must be between 4 and 16 characters and contain no spaces or dashes.");
        return;
      }

      const response = await fetch(`http://localhost:5138/api/account/check-username/${username}`);
      const data = await response.json();

      if (data.message === "Username already taken") {
        setUsernameError("This username is already taken. Please choose another.");
        return;
      } else {
        setUsernameError("");
      }
    }

    setStep(prev => prev + 1);
  };

  const finishSignUp = async () => {
    if (!birthdate) {
      alert("Please select a birthdate.");
      return;
    }

    const profileData = {
      username,
      birthday: birthdate,
      school,
      avatarChoice: ""
    };

    try {
      const res = await fetch("http://localhost:5138/api/account/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        navigate("/test");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Error completing profile:", err);
      alert("Something went wrong.");
    }
  };

  const validateUsername = (username) => {
    const regex = /^[A-Za-z0-9]+$/;
    return username.length >= 4 && username.length <= 16 && regex.test(username);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Create a Username</h3>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
            {usernameError && <div style={errorStyle}>{usernameError}</div>}
          </>
        );
      case 2:
        return (
          <>
            <h3>Enter Birth Date</h3>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <BasicDatePicker birthdate={birthdate} setBirthdate={setBirthdate} />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3>Enter School</h3>
            <label htmlFor="school">School name</label>
            <input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              style={inputStyle}
            />
            <div>
              <button onClick={finishSignUp} style={buttonStyle}>Finish</button>
            </div>
          </>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Checking session...</p>;

  return (
    <div style={wrapperStyle}>
      <h2>Create your Account</h2>
      {message && <p>{message}</p>}
      <div style={cardStyle}>
        <div style={progressStyle}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                ...circleStyle,
                borderColor: step >= n ? "#6938FC" : "#ccc",
                color: step === n ? "#6938FC" : "#999",
              }}
            >
              {n}
            </div>
          ))}
        </div>
        {renderStepContent()}
        {step < 3 && (
          <button onClick={nextStep} style={buttonStyle}>
            NEXT
          </button>
        )}
      </div>
    </div>
  );
}

// -- styles --
const wrapperStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#3C7AFF",
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "300px",
  textAlign: "center",
  marginTop: "20px",
};

const progressStyle = { display: "flex", justifyContent: "space-between", marginBottom: "30px" };

const circleStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: "3px solid black",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "18px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  marginBottom: "20px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  marginTop: "10px",
  backgroundColor: "#6938FC",
  border: "none",
  color: "white",
  padding: "12px",
  width: "100%",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
};

const errorStyle = {
  color: "red",
  fontSize: "14px",
  marginTop: "5px",
};

export default FirstSignUp;
