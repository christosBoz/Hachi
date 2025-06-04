// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        // Make sure the tokens are ready
        await fetchAuthSession();
        await getCurrentUser();
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        const accessToken = session.tokens?.accessToken?.toString()
        console.log(accessToken)

        if (!idToken || !accessToken) {
          console.error("Missing tokens");
        }

        // ✅ Send to backend
        const response = await fetch("http://localhost:5138/api/auth/callback", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken, accessToken }),
        });

        if (!response.ok) {
          console.error("Backend returned error:", response.status);
        }

        const data = await response.json();
        console.log(data.exists)

        // ✅ Redirect based on user existence
        if (data.exists === false) {
          navigate("/fsu"); // first sign-up page
        } else {
          navigate("/dash"); // dashboard
        }
      } catch (error) {
        console.error("Error handling callback:", error);
      }
    };

    completeAuth();
  }, [navigate]);

  return <div>Signing you in...</div>;
}
