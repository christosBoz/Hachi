function Button({ label, onClick, style = {} }) {
    return (
      <button
        onClick={onClick}
        style={{
          padding: "1vh 1vh",
          backgroundColor: "#6A39FE", // purple
          color: "white",
          border: "none",
          borderRadius: "9999px", // fully round
          cursor: "pointer",
          fontSize: "1.2vh",
          fontWeight: "bold",
          ...style,
        }}
      >
        {label}
      </button>
    );
  }
  
  export default Button;
  