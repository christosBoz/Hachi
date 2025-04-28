import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function Test() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch("http://localhost:5138/api/auth/profile", {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data); // Save the claims into context
                } else {
                    navigate("/login"); // If not logged in, go back to login
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                navigate("/login");
            }
        }

        if (!user) {
            fetchProfile();
        }
    }, [navigate, setUser, user]);

    if (!user) {
        return <div>Loading your profile...</div>;
    }

    // Protect against non-array user
    if (!Array.isArray(user)) {
        return <div>Invalid user info.</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Welcome, {user.find(c => c.type.includes("name"))?.value || "User"}!</h1>

            <h2>Your Info:</h2>
            <ul>
                {user.map((claim, idx) => (
                    <li key={idx}><strong>{claim.type.split("/").pop()}:</strong> {claim.value}</li>
                ))}
            </ul>
        </div>
    );
}

export default Test;
