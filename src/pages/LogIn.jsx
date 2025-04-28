import './Login.css'; // We will move the CSS into a separate file
import { useEffect, useState } from "react";
import monkeyorange from "../assets/monkeyorange.png"
import bubbles from "../assets/bubbles.png"
import octopus1 from "../assets/octopus1.png"
function BackgroundAnimation() {
    return (
        <div className="ocean-background">
            {/* <img src={bubbles} className="bubbles-background" alt="bubbles" />
            <img src={octopus1} className="octopus" alt="octopus" />
            <img src={octopus1} className="octopus" alt="octopus" />
            <img src={octopus1} className="octopus" alt="octopus" />
            <img src={octopus1} className="octopus" alt="octopus" /> */}

            {/* Add more images if you want */}
        </div>
    );
}
// Styles for the buttons
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

// Styles for icons inside the buttons
const iconStyle = {
    marginRight: "10px"
};


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
            transform: "translate(-50%, -50%)", // Center it perfectly
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            textAlign: "center",
            minWidth: "300px",
        }}>
            <h1 style={{ color: "#b300ff", marginBottom: "10px" }}>Hachi</h1>
            <p style={{ color: "#b300ff", marginBottom: "30px" }}>Welcome<br />Sign in with the following methods</p>

            <div style={buttonStyle}>
                <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" style={iconStyle} />
                Continue with Google
            </div>

            <div style={buttonStyle}>
                <img src="https://img.icons8.com/ios-filled/24/000000/mac-os.png" alt="Apple" style={iconStyle} />
                Continue with Apple
            </div>

            <div style={buttonStyle}>
                <img src="https://img.icons8.com/color/24/000000/microsoft.png" alt="Microsoft" style={iconStyle} />
                Continue with Microsoft
            </div>
        </div>
    );
}



function Login() {
    return (
        <div style={{ backgroundColor: "#3C79FF", minHeight: "100vh", overflow: "hidden" }}>
            
            <BackgroundAnimation />
            <MethodPicker />
            
        </div>
    );
}

export default Login;
