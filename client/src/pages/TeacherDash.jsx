import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Banner from "../components/Banner";
import SearchBar from '../components/Searchbar';
import homeIcon from '../assets/sidebarIcons/homeIcon.png';
import folderIcon from '../assets/sidebarIcons/folderIcon.png';
import notification from '../assets/sidebarIcons/notification.png';
import plusIcon from '../assets/sidebarIcons/plusIcon.png';
import HachiLogoLong from "../assets/HachiLogoLong.png";
import { useNavigate } from 'react-router-dom';

// ✅ CreateClassForm is now OUTSIDE
function CreateClassForm({ school, setSchool, className, setClassName, subject, setSubject, onSubmit }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create a New Class</h2>
        <p style={styles.subtitle}>Fill in the details to get started.</p>
        <p style={styles.subtitle}>Select your school if you are making a class for that school.</p>
        <form style={styles.form} onSubmit={onSubmit}>
          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>School</label>
              <input
                type="text"
                style={styles.schoolInput}
                placeholder="Select School"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Class Name</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Enter class name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Subject</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>
          <div style={styles.buttonRow}>
            <button type="submit" style={styles.nextButton}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TeacherDashboard() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createClassOpen, setCreateClassOpen] = useState(false);
  const [school, setSchool] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");

  const submitCreateClass = (event) => {
    event.preventDefault();
    console.log("School:", school, "Class Name:", className, "Subject:", subject);
  };

  function TopBanner() {
    const navigate = useNavigate();
    return (
      <Banner>
        <img src={HachiLogoLong} alt="Hachi Logo" style={{ height: "100%" }} />
        <span style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: "40vw",
        }}>
          <SearchBar onSearch={(text) => console.log("Search submitted:", text)} />
        </span>
        <div style={{
          height: "100%",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "1vw",
        }}>
          <img src={notification} alt="Notification" style={{ height: "55%" }} />
          <span style={{ fontSize: "1.4vh", color: "#6A39FE" }}>For Students</span>
        </div>
      </Banner>
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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBanner />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <Sidebar>
          {(isOpen) => (
            <div>
              <SidebarItem label="Dashboard" icon={homeIcon} isOpen={isOpen} onClick={() => setCreateClassOpen(false)} />
              <SidebarItem label="Materials" icon={folderIcon} isOpen={isOpen} />
              <SidebarItem label="Create folder" icon={plusIcon} isOpen={isOpen} />
              <SidebarItem label="Create class" icon={plusIcon} isOpen={isOpen} onClick={() => setCreateClassOpen(true)} />
              <SidebarItem label="Join class" icon={plusIcon} isOpen={isOpen} />
              <SidebarItem label="Settings" icon={homeIcon} isOpen={isOpen} />
            </div>
          )}
        </Sidebar>

        <div style={{ flexGrow: 1, padding: "20px" }}>
          {createClassOpen ? (
            <CreateClassForm
              school={school}
              setSchool={setSchool}
              className={className}
              setClassName={setClassName}
              subject={subject}
              setSubject={setSubject}
              onSubmit={submitCreateClass}
            />
          ) : (
            <h1>Welcome to the Teacher Dashboard</h1>
          )}
        </div>
      </div>
    </div>
  );
}



const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "#f5f5f5",
    height: "100%",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    width: "600px",
    maxWidth: "90%",
  },
  title: {
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    marginBottom: "30px",
    fontSize: "14px",
    color: "#777",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  inputGroup: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontSize: "13px",
    color: "#555",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  schoolInput: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  nextButton: {
    backgroundColor: "#6938FC",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default TeacherDashboard;
