import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"; // <-- import the User Context
import Home from "./pages/Home";
import Login from "./pages/LogIn"; // <--- correct casing (match your folder/filename)
import Test from "./pages/test";   // <--- correct casing (Test, not test)
import Slideshow from "./components/Slideshow"; // You imported this but not used yet
import FirstSignUp from "./pages/firstSignUp";

function App() {
  return (
    <UserProvider> {/* Provide user context to whole app */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
          <Route path="/fsu" element={<FirstSignUp />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
