import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import AuthCallback from "./pages/AuthCallback";
import FirstSignUp from "./pages/firstSignUp";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./pages/Logout";

import PublicOnlyRoute from "./PublicOnlyRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/fsu" element={<FirstSignUp />} />
      <Route path="/dash" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}


export default App;
