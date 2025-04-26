import Banner from "../components/Banner";
import Button from "../components/Button";
import HachiLogoLong from "../assets/HachiLogoLong.png";

function Home() {
  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Banner>
        <img src={HachiLogoLong} alt="Cat" style={{ height: "100%" }} />
        
        {/* Center the text */}
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)", // This will center the span horizontally
            fontSize: "1rem",
            color: "#6A39FE",
            fontWeight:"bold",
            fontSize:"20px"
          }}
        >
          The mind is not a vessel to be filled but a fire to be kindled." - Plutarch
        </span>

        {/* Right-aligned section */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <span style={{ fontSize: "1rem", color: "#6A39FE" }}>For Teachers</span>
          <Button label="Menu" />
        </div>
      </Banner>
    </div>
  );
}

export default Home;
