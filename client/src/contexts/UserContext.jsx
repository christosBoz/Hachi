// src/contexts/UserContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getCurrentUser,
  fetchAuthSession,
  signOut as amplifySignOut,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (idToken) {
        localStorage.setItem("idToken", idToken);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user from session", err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkUser();

    const listener = (data) => {
      const { event } = data.payload;
      if (event === "signedIn") checkUser();
      if (event === "signedOut") setUser(null);
    };

    Hub.listen("auth", listener);
    return () => Hub.remove("auth", listener);
  }, [checkUser]);

  return (
    <UserContext.Provider value={{ user, setUser, checkUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
