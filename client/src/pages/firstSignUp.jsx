

import React, { useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function BasicDatePicker({birthdate, setBirthdate}) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker 
          label="Basic date picker"
          value={birthdate}
          onChange={(newValue) => setBirthdate(newValue)} />
        </DemoContainer>
      </LocalizationProvider>
    );
  }


    


function FirstSignUp()  {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [birthdate, setBirthdate] = useState(null);

    const [school, setSchool] = useState("");


    const nextStep = () => {
        setStep(prev => prev + 1);
        if (birthdate) {
            console.log(birthdate.$M + 1)

        }
    }
    const finishSignUp = () => {
        if (birthdate) {
          const message = `Username: ${username}\nBirthdate: ${birthdate.$M + 1}/${birthdate.$D}/${birthdate.$y}\nSchool: ${school}`;
          alert(message);
        } else {
          alert("Please select a birthdate.");
        }
      };

    const renderStepContent = () =>{
        switch(step) {
            
            case 1:
                return (
                    <>
                    <h3>Create a Username</h3>
                    <label htmlFor="">username</label>
                    <input type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={inputStyle} 
                    />
                    </>
                );
            case 2:
                return (
                    <>
                    <h3>Enter Birth Date</h3>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <BasicDatePicker 
                    birthdate={birthdate} 
                    setBirthdate={setBirthdate} 
                    />
                    </div>
                    </>
                );
            case 3:
                return (
                    <>
                    <h3>Enter School</h3>
                    <label htmlFor="">school name we will do this later</label>
                    <input type="text"
                    value={school}
                    onChange={e => setSchool(e.target.value)}
                    style={inputStyle} 
                    />
                    <div>
                        <button onClick={finishSignUp}style={buttonStyle}>Finish</button>
                    </div>
                    </>
                );
            default:
                return <div>Unknown step</div>;  
        }
    }


    return (
        <div style={wrapperStyle}>
            
          <h2>Create your Account</h2>
    
          <div style={cardStyle}>
            {/* Step progress (simplified) */}
            <div style={progressStyle}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  ...circleStyle,
                  borderColor: step >= n ? "#6938FC" : "#ccc",
                  color: step === n ? "#6938FC" : "#999"
                }}>
                  {n}
                </div>
              ))}
            </div>
    
            {renderStepContent()}

    
            {/* Next Button */}
            {step < 3 && (
              <button onClick={nextStep} style={buttonStyle}>NEXT</button>
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
      marginTop: "20px"
    };
    
    const logoStyle = { width: "150px", marginBottom: "20px" };
    
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
      fontSize: "18px"
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
      cursor: "pointer"
    };



export default FirstSignUp;