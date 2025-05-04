import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function Test() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    
    // State to track if the user needs to complete their profile
    const [userStatus, setUserStatus] = useState(null);
    const [message, setMessage] = useState("");
    
    // State for profile completion
    const [username, setUsername] = useState("");
    const [birthday, setBirthday] = useState("");
    const [school, setSchool] = useState("");
    const [teacher, setTeacher] = useState(false);

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch("http://localhost:5138/api/account/profile", {
                    credentials: "include", // Include session or authentication cookies
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("User profile data:", data);
                    setUser(data.user); // Set the user data
                    if (!data.user.username || !data.user.birthday) {
                        // If user data is incomplete, ask them to complete the profile
                        setUserStatus("notFound");
                        setMessage("Please complete your profile.");
                    } else {
                        setUserStatus("exists"); // Set status as exists if all data is there
                    }
                } else {
                    console.log("Error fetching user data:", response.statusText);
                    setUserStatus("error"); // Handle error if the API request fails
                }
            } catch (error) {
                console.error("Error fetching user data", error);
                setUserStatus("error"); // Handle error if the API request fails
                setMessage("Error fetching user data. Please try again later.");
            }
        }

        fetchUserProfile();  // Fetch the user profile data when the component mounts
    }, [navigate, setUser]);

    const validateUsername = (username) => {
        const regex = /^[A-Za-z0-9]+$/; // Only alphanumeric characters allowed, no spaces, dashes
        return username.length >= 4 && username.length <= 16 && regex.test(username);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // Validate username constraints
        if (!validateUsername(username)) {
            setMessage("Username must be between 4 and 16 characters and cannot contain spaces or dashes.");
            return;
        }

        // Check if username is unique by calling the backend
        const response = await fetch(`http://localhost:5138/api/account/check-username/${username}`);
        const data = await response.json();
        
        if (data.message === "Username already taken") {
            setMessage("This username is already taken. Please choose another.");
            return;
        }

        // Log the profile data being submitted
        console.log("Submitting profile data:", { username, birthday, school });
    
        // Send null or default value for AvatarChoice since you're not handling it yet
        const profileData = { 
            username, 
            birthday, 
            school, 
            avatarChoice: "default",  // Provide a default avatar choice or null,
            teacher
        };
    
        const profileResponse = await fetch("http://localhost:5138/api/account/complete-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
            credentials: "include", // Include session or authentication cookies
        });
    
        if (profileResponse.ok) {
            const data = await profileResponse.json();
            console.log("Profile updated successfully:", data);
            setUserStatus("exists"); // Change status to user exists after profile completion
            setUser(data.user); // Update the user context
            navigate("/home");  // Redirect to the home page or dashboard
        } else {
            const errorData = await profileResponse.json();  // Capture the error response
            console.error("Error updating profile:", errorData);
            setMessage(errorData.message || "Error updating profile. Please try again.");
        }
    };

    if (userStatus === "notFound") {
        return (
            <div>
                <h3>{message}</h3>
                <form onSubmit={handleProfileSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Birthday:</label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>School:</label>
                        <input
                            type="text"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Complete Profile</button>
                </form>
            </div>
        );
    }

    if (userStatus === "error") {
        return <div>{message}</div>; // Display error message if there was an issue
    }

    if (!user) {
        return <div>Loading your profile...</div>;
    }

    const handleSignOut = async () => {
        try {
            await fetch("http://localhost:5138/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
    
            setUser(null);         // Clear the user context
            navigate("/");         // Redirect to home or login
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    const logoutButtonStyle = {
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    };
    

    return (
        <div style={{ padding: "20px" }}>
            <h1>Welcome, {user.username || "User"}!</h1>
    
            <h2>Your Info:</h2>
            <ul>
                <li><strong>UserId:</strong> {user.userId}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Username:</strong> {user.username}</li>
                <li><strong>Birthday:</strong> {user.birthday}</li>
                <li><strong>School:</strong> {user.school}</li>
                <li><strong>Teacher:</strong> {user.teacher ? "Yes" : "No"}</li>
            </ul>
    
            <button onClick={handleSignOut} style={logoutButtonStyle}>Sign Out</button>
        </div>
    );
    
}



export default Test;
