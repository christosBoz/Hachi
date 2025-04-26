import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Button from "../components/Button";
import HachiLogoLong from "../assets/HachiLogoLong.png";
import quotes from "../assets/quotes"; // Import the quotes array

function Home() {
  // State to store the random quote
  const [randomQuote, setRandomQuote] = useState({ quote: "", author: "" });

  // Randomly select a quote on page load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, []);

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
            fontSize: "20px",
            color: "#6A39FE",
            whiteSpace: "nowrap",  // Prevent line break
            overflow: "hidden",    // Hide any overflow
            textOverflow: "ellipsis", // Show ellipsis when the text overflows
            maxWidth: "90vw",  // Optional: limit the max width to 90% of the viewport
            display: "inline-block", // Ensure the text behaves like inline text
            display:"flex",
            justifyContent:"right"
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            "{randomQuote.quote}"
          </span>
          <br />
          <span style={{ fontWeight: "normal" }}> &nbsp;- {randomQuote.author}</span>

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
          <Button label="Log " />
        </div>
      </Banner>
    </div>
  );
}

export default Home;
