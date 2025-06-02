import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Test from "./pages/test";
import FirstSignUp from "./pages/firstSignUp";
import ProtectedRoute from "./ProtectedRoute"; // ← import it
import Profile from "./pages/Profile";
import Dashboard from "./pages/dashboard";
import Teacher from "./pages/TeacherDash"
import Folder from "./pages/Folder"
import FlashCard from "./pages/flashcard";
function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fsu" element={<FirstSignUp />} />
          <Route path="/flash" element={<FlashCard />} />
          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <Test />
              </ProtectedRoute>
            }
          />,
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />,
          <Route
            path="/dash"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />,
          <Route
            path="/folder/:name"
            element={
              <ProtectedRoute>
                <Folder />
              </ProtectedRoute>
            }
          />,
          <Route
            path="/teach"
            element={
              <ProtectedRoute>
                <Teacher />
              </ProtectedRoute>
            }
          />,
          <Route
            path="/flash"
            element={
              <ProtectedRoute>
                <FlashCard />
              </ProtectedRoute>
            }
          />,
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
