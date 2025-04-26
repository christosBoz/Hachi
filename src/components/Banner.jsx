function Banner({ children }) {
  return (
    <div style={{
      backgroundColor: "white",
      height: "60px",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      fontFamily: "'Inter', sans-serif"
    }}>
      {children}
    </div>
  );
}

export default Banner;