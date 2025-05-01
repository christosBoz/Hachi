import React, { useState, useEffect } from "react";

const Profile = () => {
  // Define state for user data
  const [user, setUser] = useState(null);  // Store user data
  const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null);  // To handle errors

  // Fetch the profile data when the component is mounted
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5138/api/account/profile", {
          credentials: "include",  // Include cookies for authenticated requests
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data = await response.json();
        setUser(data.user);  // Set user data in state
      } catch (err) {
        setError(err.message);  // Set error message
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };

    fetchUserProfile();
  }, []);  // Empty array ensures this runs only once after the first render

  // Loading and error handling UI
  if (loading) {
    return <div>Loading your profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render user profile
  return (
    <div style={profileWrapperStyle}>
      <h1>Profile Page</h1>
      {user ? (
        <div style={profileCardStyle}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Birthday:</strong> {new Date(user.birthday).toLocaleDateString()}</p>
          <p><strong>School:</strong> {user.school}</p>
        </div>
      ) : (
        <p>No user profile available.</p>
      )}
    </div>
  );
};

// -- styles --
const profileWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#f0f4f8",
  padding: "20px",
};

const profileCardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  width: "300px",
  textAlign: "center",
};

export default Profile;
