import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Button from "../components/Button";
import HachiLogoLong from "../assets/HachiLogoLong.png";
import quotes from "../assets/quotes"; 
import Slideshow from "../components/Slideshow";
import { CgProfile } from "react-icons/cg";
import { useInView } from "react-intersection-observer";
import './Home.css';

function Home() {
  const [randomQuote, setRandomQuote] = useState({ quote: "", author: "" });
  const { ref: leaderboardRef, inView: isLeaderboardVisible } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, []);

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", overflow: "hidden" }}>
      {/* --- Banner (not scrollable) --- */}
      <Banner>
        <img src={HachiLogoLong} alt="Hachi Logo" style={{ height: "100%" }} />

        {/* Center Quote */}
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "2vh",
            color: "#6A39FE",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90vw",
            display: "flex",
            justifyContent: "right",
          }}
        >
          <span style={{ fontWeight: "bold" }}>"{randomQuote.quote}"</span>
          <br />
          <span style={{ fontWeight: "normal" }}>&nbsp;- {randomQuote.author}</span>
        </span>

        {/* Right side buttons */}
        <div
          style={{
            minHeight: "100%",
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

      {/* --- Scroll Sections --- */}
      <div
        style={{
          height: "calc(100vh - 80px)", 
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {/* --- Section 1 --- */}
        <div
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center", marginTop: "3vh", fontSize: "3vh", fontWeight: "bold", opacity: 0, animation: "fadeIn 2s forwards" }}>
            LEARN YOUR WAY
          </div>
          <div style={{ textAlign: "center", fontSize: "2vh", fontWeight: "lighter", opacity: 0, animation: "fadeIn 2s forwards" }}>
            Hachi and friends provide various ways for you to gain and retain knowledge. Swipe Below to learn more!
          </div>

          <Slideshow />
          <div style={{ textAlign: "center", marginTop: "6vh" }}>
            <Button label="Try Now!" style={{ fontSize: "2.5vh" }} />
          </div>
        </div>

        {/* --- Section 2 (Leaderboard Section) --- */}
        <div
          ref={leaderboardRef}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #6A39FE, #9E77FE)",
            color: "white",
            gap: "20px",
            padding: "20px",
          }}
        >
          <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>A FUN WAY TO LEARN</h2>
          <p style={{ maxWidth: "600px", textAlign: "center", fontSize: "1.2rem", margin: "0" }}>
            Challenge your classmates with Hachi Ranked
          </p>
          <p style={{ fontSize: "1rem" }}>Unlock Cosmetics to Customize Your Character</p>

          {/* Leaderboard */}
          <div
            style={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "20px",
              padding: "20px",
              width: "500px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {/* Top 3 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                marginBottom: "20px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <CgProfile size={40} style={{ borderRadius: "50%", border: "2px solid brown" }}/>
                <p style={{ fontWeight: "bold", marginTop: "5px" }}>Chris</p>
                <p style={{ color: "#6A39FE" }}>900 pts</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <CgProfile size={50} style={{ borderRadius: "50%", border: "2px solid gold" }} />
                <p style={{ fontWeight: "bold", marginTop: "5px" }}>John</p>
                <p style={{ color: "#6A39FE" }}>930 pts</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <CgProfile size={40} style={{ borderRadius: "50%", border: "2px solid silver" }}/>
                <p style={{ fontWeight: "bold", marginTop: "5px" }}>Jack</p>
                <p style={{ color: "#6A39FE" }}>910 pts</p>
              </div>
            </div>

            {/* Hall of Fame */}
            <div
              style={{
                width: "100%",
                backgroundColor: "#e6e6e6",
                textAlign: "center",
                opacity: isLeaderboardVisible ? 1 : 0,
                transform: isLeaderboardVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 1s ease, transform 1s ease",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>Leaderboard</h4>
              <div style={{ fontSize: "0.9rem" }}>
                <p>4. <CgProfile /> Amelia — 880 pts</p>
                <p>5. <CgProfile /> Harper — 870 pts</p>
                <p>6. <CgProfile /> James — 840 pts</p>
                <p>7. <CgProfile /> Benjamin — 830 pts</p>
              </div>
            </div>
          </div>

          <Button label="Get Started" />
        </div>

        {/* --- Section 3 (Future) --- */}
        <div
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, rgb(240,240,240), rgb(23,22,24))",
            color: "white",
            gap: "20px",
            padding: "20px",
          }}
        >
          <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>do next section here</h2>
        </div>
      </div>
    </div>
  );
}

export default Home;
