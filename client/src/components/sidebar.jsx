import { useState } from "react";

function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true); // default open

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div
      style={{
        height: "94.5vh",
        width: isOpen ? "200px" : "60px",
        backgroundColor: "white",
        boxShadow: "2px 0 4px rgba(0, 0, 0, 0.1)",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div
        style={{
          padding: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          textAlign: "center",
          borderBottom: "1px solid #eee"
        }}
        onClick={toggleSidebar}
      >
        {isOpen ? "←" : "☰"}
      </div>

      {/* 🔁 Pass isOpen to children */}
      <div style={{ padding: isOpen ? "10px" : "4px", flexGrow: 1 }}>
        {typeof children === "function" ? children(isOpen) : children}
      </div>
    </div>
  );
}

export default Sidebar;
