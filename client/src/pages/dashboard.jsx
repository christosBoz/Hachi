import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Banner from "../components/Banner";
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import HachiLogoLong from "../assets/HachiLogoLong.png";
import SearchBar from '../components/Searchbar';
import homeIcon from '../assets/sidebarIcons/homeIcon.png'
import folderIcon from '../assets/sidebarIcons/folderIcon.png'

export default function Dashboard() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBanner />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <StudentSidebar />
        <div style={{ flexGrow: 1, padding: "20px" }}>
          {/* Replace with your main dashboard content */}
          <h1>Welcome to the Dashboard</h1>
        </div>
      </div>
    </div>
  );
}

function TopBanner() {
  const navigate = useNavigate();

  return (
    <Banner>
      <img src={HachiLogoLong} alt="Hachi Logo" style={{ height: "100%" }} />
      {/* Center Search Bar */}
      <span
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: "40vw",
        }}
      >
        <SearchBar onSearch={(text) => console.log("Search submitted:", text)} />
      </span>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "1vw",
        }}
      >
        <span style={{ fontSize: "1.4vh", color: "#6A39FE" }}>For Teachers</span>
      </div>
    </Banner>
  );
}

function StudentSidebar() {
    return (
      <Sidebar>
        {(isOpen) => (
          <div>
            <Category label="" isOpen={isOpen} />
            <SidebarItem label="Dashboard" icon={homeIcon} isOpen={isOpen} />
            <SidebarItem label="Materials" icon={folderIcon} isOpen={isOpen} />
            <Separator isOpen={isOpen} />
  
            <Category label="User" isOpen={isOpen} />
            <SidebarItem label="Messages" icon={homeIcon} isOpen={isOpen} />
            <SidebarItem label="Profile" icon={homeIcon} isOpen={isOpen} />
            <Separator isOpen={isOpen} />
  
            <Category label="Settings" isOpen={isOpen} />
            <SidebarItem label="Settings" icon={homeIcon} isOpen={isOpen} />
          </div>
        )}
      </Sidebar>
    );
  }
  function Category({ label, isOpen }) {
    if (!isOpen) return null;
    return (
      <div
        style={{
          fontSize: "1.1vh",
          color: "black",
          margin: "10px 10px 4px 10px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
    );
  }
  function Separator({ isOpen }) {
    return (
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #999",
          margin: "8px auto",
          width: isOpen ? "80%" : "60%",
          transition: "width 0.3s ease"
        }}
      />
    );
  }
  
  
  
  
  function SidebarItem({ label, icon, isOpen }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "1.3vh",
          cursor: "pointer",
          borderRadius: "8px",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <img
          src={icon}
          alt={label}
          style={{
            width: "3vh",
            height: "3vh",
            marginRight: isOpen ? "10px" : "0",
            objectFit: "contain"
          }}
        />
        {isOpen && <span>{label}</span>}
      </div>
    );
  }
  