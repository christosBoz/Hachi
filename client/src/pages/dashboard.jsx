import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Banner from "../components/Banner";
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import HachiLogoLong from "../assets/HachiLogoLong.png";
import SearchBar from '../components/Searchbar';
import homeIcon from '../assets/sidebarIcons/homeIcon.png'
import folderIcon from '../assets/sidebarIcons/folderIcon.png'
import notification from '../assets/sidebarIcons/notification.png'
import plusIcon from '../assets/sidebarIcons/plusIcon.png'
import defaultpic from '../assets/defaultprofilepic.png'
import { borderRadius, color, display, margin, width } from '@mui/system';



function CreateFolderForm({ school, setSchool, folderName, setFolderName, subject, setSubject, onSubmit, onClose, }) {
  
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Got file: ", file)
    // fetch("https://yourapi.com/api/upload", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log("Uploaded image URL:", data.imageUrl);
    //     // Save this URL in your folder metadata
    //   })
    //   .catch(err => console.error(err));
  };
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>×</button>
        <h2 style={styles.title}>Create a New Folder</h2>
        <form style={styles.formStyles} onSubmit={onSubmit}>
          <label style={styles.label}>Folder Name</label>
          <input
            style={styles.input}
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
          <label style={styles.label}>Folder Icon</label>
          <input
            type="file"
            accept='image/*'
            onChange={(e)=> handleFileUpload(e.target.files[0])}
          />
          

          <label style={styles.checkboxRow}>
            <span style={styles.label}>Is this for a School?</span>
            <input type="checkbox" style={styles.checkbox} checked={showMoreInfo} onChange={()=>setShowMoreInfo(prev => !prev)}/>
            
          </label>

          {showMoreInfo && (
          <>
          <label style={styles.label}>School</label>
          <input
            style={styles.input}
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Enter school name"
          />

          <label style={styles.label}>Subject</label>
          <input
            style={styles.input}
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
          />
          </>
          )}

          <button type="submit" style={styles.createButton}>Create</button>
        </form>
      </div>
    </div>
  );
}

function ProfileDropdown() {
  const menuItems = [
    { label: "settings", onClick: () => console.log("flashcards") },
    { label: "logout", onClick: () => console.log("sg") },


  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "0",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
        zIndex: 10,
        padding: "8px 0",
        width: "180px"
      }}
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={item.onClick}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f7f7f7")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

function TopBanner() {
  const navigate = useNavigate();
  const [showPlusDropdown, setShowPlusDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handlePlusClick = () => {
    setShowPlusDropdown(prev => !prev);
    setShowProfileDropdown(false); // Close the other dropdown if open
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(prev => !prev);
    setShowPlusDropdown(false); // Close the other dropdown if open
  };
  return (
    <Banner>
      <img src={HachiLogoLong} alt="Hachi Logo" style={{ height: "100%" }} />
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
          position: "relative",
          height: "100%",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap:"1vw"
        }}
      >
        <img
          src={notification}
          alt="notification"
          style={{ height: "55%", cursor: "pointer"}}
        />
        <img
          src={plusIcon}
          alt="plus"
          style={{ height: "55%", cursor: "pointer" }}
          onClick={handlePlusClick}
        />
        {showPlusDropdown && <PlusDropdown />}
        <img
          src={defaultpic}
          alt="plus"
          style={{ height: "55%", cursor: "pointer" }}
          onClick={handleProfileClick}
        />
        {showProfileDropdown && <ProfileDropdown />}
      </div>
    </Banner>
  );
}
function PlusDropdown() {
  const menuItems = [
    { label: "Flashcards", onClick: () => console.log("flashcards") },
    { label: "Study Guides", onClick: () => console.log("sg") },
    { label: "Exams", onClick: () => console.log("xam") },
    { label: "Notes", onClick: () => console.log("nites") },

  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "0",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
        zIndex: 10,
        padding: "8px 0",
        width: "180px"
      }}
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={item.onClick}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f7f7f7")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}




export default function Dashboard() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [school, setSchool] = useState('');
  const [folderName, setFolderName] = useState('');
  const [subject, setSubject] = useState('');
  const [showMoreInfo, setShowMoreInfo] = useState(false);


  const handleCreateFolder = () => {
    console.log("foldername ", folderName)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBanner />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <StudentSidebar setCreateFolderOpen={setCreateFolderOpen}/>
        <div style={{ flexGrow: 1, padding: "20px" }}>
          {/* Replace with your main dashboard content */}
          <h1>Welcome to the Dashboard</h1>
        </div>
      </div>
      {createFolderOpen && (
        <CreateFolderForm
          school={school}
          setSchool={setSchool}
          folderName={folderName}
          setFolderName={setFolderName}
          subject={subject}
          setSubject={setSubject}
          onSubmit={handleCreateFolder}
          onClose={() => setCreateFolderOpen(false)}
        />
      )}
    </div>
  );
}

// function TopBanner() {
//   const navigate = useNavigate();

//   return (
//     <Banner>
//       <img src={HachiLogoLong} alt="Hachi Logo" style={{ height: "100%" }} />
//       {/* Center Search Bar */}
//       <span
//         style={{
//           position: "absolute",
//           left: "50%",
//           transform: "translateX(-50%)",
//           maxWidth: "40vw",
//         }}
//       >
//         <SearchBar onSearch={(text) => console.log("Search submitted:", text)} />
//       </span>
//       <div
//         style={{
//             height: "100%",
//             marginLeft: "auto",
//             display: "flex",
//             alignItems: "center",
//             gap: "1vw",
//         }}
//       >
//         <img src={notification} alt="Hachi Logo" style={{ height: "55%" }} />
//         <span style={{ fontSize: "1.4vh", color: "#6A39FE" }}>For Teachers</span>
//       </div>
//     </Banner>
//   );
// }

function StudentSidebar( {setCreateFolderOpen} ) {
    return (
      <Sidebar>
        {(isOpen) => (
          <div>
            <Category label="" isOpen={isOpen} />
            <SidebarItem label="Dashboard" icon={homeIcon} isOpen={isOpen} />
            <SidebarItem label="Materials" icon={folderIcon} isOpen={isOpen} />
            <Separator isOpen={isOpen} />

            <Category label="Your Folders" isOpen={isOpen} />
            <SidebarItem label="Create folder" icon={plusIcon} isOpen={isOpen} onClick={()=> setCreateFolderOpen(true)}/>
            <Separator isOpen={isOpen} />

            <Category label="Your Classes" isOpen={isOpen} />
            <SidebarItem label="Join class" icon={plusIcon} isOpen={isOpen} />
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
  
  
  
  
  function SidebarItem({ label, icon, isOpen, onClick }) {
    return (
      <div
        onClick={onClick}
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
  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    },
    modal: {
      backgroundColor: "#6A39FE",
      borderRadius: "16px",
      padding: "32px",
      width: "400px",
      position: "relative",
      color: "white",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
    },
    closeButton: {
      position: "absolute",
      top: "12px",
      right: "16px",
      fontSize: "24px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "white",
    },
    title: {
      marginBottom: "24px",
      fontSize: "22px",
      fontWeight: "bold",
    },
    formStyles: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    label: {
      fontSize: "20px",
      marginBottom: "-8px",
    },
    input: {
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "14px",
      backgroundColor: "#f0f0f0", // light gray instead of white
      color: "#333",
    },
    checkbox: {
      transform: "scale(1.2)",
      marginTop: "4px",
    },
    checkboxRow: {
      display: 'flex',
      alignItems: "center",
      gap: "10%",

    },
    createButton: {
      backgroundColor: "white",
      color: "#6A39FE",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "20px",
      alignSelf: "flex-start",
    },


  

    
    
  };
  
  