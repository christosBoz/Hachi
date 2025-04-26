function Button({ label, onClick, style = {} }) {
    return (
      <button
        onClick={onClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#6A39FE", // purple
          color: "white",
          border: "none",
          borderRadius: "9999px", // fully round
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
          ...style,
        }}
      >
        {label}
      </button>
    );
  }
  
  export default Button;
  