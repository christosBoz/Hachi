import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useUser } from "../contexts/UserContext";

function Test() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    
    const [userStatus, setUserStatus] = useState(null);
    const [message, setMessage] = useState("");

    const [username, setUsername] = useState("");
    const [birthday, setBirthday] = useState("");
    const [school, setSchool] = useState("");
    const [teacher, setTeacher] = useState(false);
    const [schoolInfo, setSchoolInfo] = useState(null);

    // ✅ Store JWT token after redirect (e.g., OAuth)
    useEffect(() => {
        const storeJwt = async () => {
            try {
                const session = await Auth.currentSession();
                const jwt = session.getIdToken().getJwtToken();
                localStorage.setItem("jwt", jwt);
                console.log("JWT stored:", jwt);
            } catch (err) {
                console.error("Failed to store JWT:", err);
                localStorage.removeItem("jwt");
            }
        };
        storeJwt();
    }, []);

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch("http://localhost:5138/api/account/profile", {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("User profile data:", data);
                    setUser(data.user);
                    if (data.user.schoolId) {
                        try {
                            const schoolRes = await fetch(`http://localhost:5138/api/schools/${data.user.schoolId}`);
                            if (schoolRes.ok) {
                                const schoolData = await schoolRes.json();
                                setSchoolInfo(schoolData);
                            }
                        } catch (error) {
                            console.error("Error fetching school info:", error);
                        }
                    }

                    if (!data.user.username || !data.user.birthday) {
                        setUserStatus("notFound");
                        setMessage("Please complete your profile.");
                    } else {
                        setUserStatus("exists");
                    }
                } else {
                    console.log("Error fetching user data:", response.statusText);
                    setUserStatus("error");
                }
            } catch (error) {
                console.error("Error fetching user data", error);
                setUserStatus("error");
                setMessage("Error fetching user data. Please try again later.");
            }
        }

        fetchUserProfile();
    }, [navigate, setUser]);

    const validateUsername = (username) => {
        const regex = /^[A-Za-z0-9]+$/;
        return username.length >= 4 && username.length <= 16 && regex.test(username);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!validateUsername(username)) {
            setMessage("Username must be between 4 and 16 characters and cannot contain spaces or dashes.");
            return;
        }

        const response = await fetch(`http://localhost:5138/api/account/check-username/${username}`);
        const data = await response.json();

        if (data.message === "Username already taken") {
            setMessage("This username is already taken. Please choose another.");
            return;
        }

        const profileData = { 
            username, 
            birthday, 
            school, 
            avatarChoice: "default", 
            teacher
        };

        const profileResponse = await fetch("http://localhost:5138/api/account/complete-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
            credentials: "include",
        });

        if (profileResponse.ok) {
            const data = await profileResponse.json();
            console.log("Profile updated successfully:", data);
            setUserStatus("exists");
            setUser(data.user);
            navigate("/home");
        } else {
            const errorData = await profileResponse.json();
            console.error("Error updating profile:", errorData);
            setMessage(errorData.message || "Error updating profile. Please try again.");
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch("http://localhost:5138/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            localStorage.removeItem("jwt");
            navigate("/");
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
        return <div>{message}</div>;
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
                <li><strong>School:</strong> 
                    {schoolInfo 
                        ? `${schoolInfo.name}, ${schoolInfo.city}, ${schoolInfo.state}` 
                        : "N/A"}
                </li>
                <li><strong>Teacher:</strong> {user.teacher ? "Yes" : "No"}</li>
            </ul>
            <button onClick={handleSignOut} style={logoutButtonStyle}>Sign Out</button>
        </div>
    );
}

export default Test;
