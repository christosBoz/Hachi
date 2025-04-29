import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicDatePicker from "../components/BasicDatePicker";  // For example, if it's in the components folder

function FirstSignUp() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [school, setSchool] = useState("");
  const [usernameError, setUsernameError] = useState(""); // State for username validation
  const [message, setMessage] = useState(""); // State to show general message

  const navigate = useNavigate();

  const nextStep = async () => {
    // Validate username before moving to the next step
    if (step === 1) {
      if (!validateUsername(username)) {
        setUsernameError("Username must be between 4 and 16 characters and cannot contain spaces or dashes.");
        return;
      }

      // Check if the username is unique
      const response = await fetch(`http://localhost:5138/api/account/check-username/${username}`);
      const data = await response.json();

      if (data.message === "Username already taken") {
        setUsernameError("This username is already taken. Please choose another.");
        return;
      } else {
        setUsernameError(""); // Reset the error if username is valid
      }
    }

    // Proceed to next step
    setStep(prev => prev + 1);
  };

  const finishSignUp = () => {
    if (!birthdate) {
      alert("Please select a birthdate.");
      return;
    }

    const profileData = {
      username,
      birthday: birthdate,
      school,
    };

    // Simulate sending data to the server (replace with actual backend call)
    console.log("Submitting profile data:", profileData);

    // Redirect to another page after profile submission
    navigate("/home");
  };

  const validateUsername = (username) => {
    const regex = /^[A-Za-z0-9]+$/; // Only alphanumeric characters allowed, no spaces, dashes
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

  return (
    <div style={wrapperStyle}>
      <h2>Create your Account</h2>
      <div style={cardStyle}>
        {/* Step progress (simplified) */}
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
        {/* Next Button */}
        {step < 3 && (
          <button onClick={nextStep} style={buttonStyle}>
            NEXT
          </button>
        )}
      </div>
    </div>
  );
}

// -- styles below --
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
