import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Button from "../components/Button";
import HachiLogoLong from "../assets/HachiLogoLong.png";
import quotes from "../assets/quotes"; // Import the quotes array
import Slideshow from "../components/Slideshow";
import './Home.css';

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
            fontSize: "2vh",
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
            minHeight:"100%",
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "1vw",
          }}
        >
          <span style={{ fontSize: "1.4vh", color: "#6A39FE" }}>For Teachers</span>
          <Button label="Log in" />
        </div>
      </Banner>
      <div 
      style={{
        textAlign: "center",
        marginTop: "3vh",
        fontSize: "3vh",
        fontWeight: "bold",
        opacity: 0,
        animation: "fadeIn 2s forwards"
      }}
    >
      LEARN YOUR WAY
      
    </div>
    <div 
      style={{
        textAlign: "center",
        fontSize: "2vh",
        fontWeight: "lighter",
        opacity: 0,
        animation: "fadeIn 2s forwards"
      }}
    >
      Hachi and friends provide various ways for you to gain and retain knowledge. Swipe Below to learn more!
      
    </div>
    
  
      <Slideshow />
      <div style={{textAlign: "center", marginTop: "6vh"}}>
    <Button label="Try Now!" style={{fontSize:"2.5vh"}} />
    </div>
    </div>
  );
}

export default Home;
