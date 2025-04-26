function Banner({ children }) {
  return (
    <div style={{
      backgroundColor: "white",
      height: "5.5vh",
      display: "flex",
      alignItems: "center",
      padding: "0 1vw",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      fontFamily: "'Inter', sans-serif"
    }}>
      {children}
    </div>
  );
}

export default Banner;