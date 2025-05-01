import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true); // For initial loading state

  useEffect(() => {
    let hasValidated = false;

    const validateSession = async () => {
      if (hasValidated) return; // 🧠 Don't revalidate if we already did
      hasValidated = true;

      try {
        const res = await fetch("http://localhost:5138/api/auth/validate", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setProfileComplete(data.profileComplete);
        } else {
          setUser(null);
          setProfileComplete(false);
        }
      } catch (err) {
        console.error("Session validation failed:", err);
        setUser(null);
        setProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    validateSession(); // ✅ Called once on first mount
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, profileComplete, setProfileComplete, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
