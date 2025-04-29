import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function Test() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    
    // State to track if the user exists or needs to complete their profile
    const [userStatus, setUserStatus] = useState(null);
    const [message, setMessage] = useState("");
    
    // State for profile completion
    const [username, setUsername] = useState("");
    const [birthday, setBirthday] = useState("");
    const [school, setSchool] = useState("");

    useEffect(() => {
        async function checkUserExists() {
            try {
                const response = await fetch("http://localhost:5138/api/account/exists", {
                    credentials: "include", // Include session or authentication cookies
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Check message from backend
                    if (data.message === "User exists") {
                        console.log("User exists:", data.user);
                        setUserStatus("exists"); // Set the status if the user exists
                        setUser(data.user); // Store the user data
                    } else if (data.message === "User does not exist, please complete your profile.") {
                        console.log("User not found, please complete your profile.");
                        setUserStatus("notFound"); // Set the status if the user does not exist
                        setMessage(data.message); // Set the message to prompt the user to complete their profile
                    }
                } else {
                    console.log("Error with the response from the backend.");
                    setUserStatus("error"); // Handle error if the API request fails
                }
            } catch (error) {
                console.error("Error checking user existence", error);
                setUserStatus("error"); // Handle error if the API request fails
                setMessage("Error checking user status. Please try again later.");
            }
        }

        if (!user) {
            checkUserExists(); // Call the API to check if the user exists after login
        }
    }, [navigate, setUser, user]);

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
            avatarChoice: "default"  // Provide a default avatar choice or null
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
            </ul>
        </div>
    );
}

export default Test;
