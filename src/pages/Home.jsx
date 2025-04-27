import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Button from "../components/Button";
import HachiLogoLong from "../assets/HachiLogoLong.png";
import quotes from "../assets/quotes"; 
import Slideshow from "../components/Slideshow";
import { CgProfile } from "react-icons/cg";
import { useInView } from "react-intersection-observer";
import './Home.css';
import ranks from "../assets/ranks.png"
import ranksNew from "../assets/ranksNew.png"
import ranksNewBlack from "../assets/ranksNewBlack.png"


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
    <div style={{ backgroundColor: "white", minHeight: "94.5vh", overflow: "hidden" }}>
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
          height: "calc(94.5vh)", 
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {/* --- Section 1 --- */}
        <div
          style={{
            height: "94.5vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center", marginTop: "-8vh", fontSize: "3vh", fontWeight: "bold", opacity: 0, animation: "fadeIn 2s forwards" }}>
            LEARN YOUR WAY
          </div>
          <div style={{ textAlign: "center", fontSize: "2vh", fontWeight: "lighter", opacity: 0, animation: "fadeIn 2s forwards" }}>
            Hachi and friends provide various ways for you to gain and retain knowledge. Swipe Below to learn more!
          </div>

          <Slideshow />
          <div style={{ textAlign: "center", marginTop: "0vh" }}>
            <Button label="Try Now!" style={{ fontSize: "2.5vh" }} />
          </div>
        </div>

        {/* --- Section 2 (Leaderboard Section) --- */}
        <div
        ref={leaderboardRef}
        style={{
          height: "94.5vh",
          scrollSnapAlign: "start",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // background: "linear-gradient(135deg, #6A39FE, #9E77FE)",
          backgroundColor: "#6A39FE",
          color: "white",
        }}
      >
        {/* <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>A FUN WAY TO LEARN</h2> */}

        {/* <p style={{ maxWidth: "600px", textAlign: "center", fontSize: "1.2rem", margin: "0" }}>
          Hachi Leagues
        </p> */}

       
          {/* <h2 style={{ marginBottom: "10px" }}>Leagues</h2> */}

          {/* Flex Row for Grid + Octopus */}
          <div
            style={{
                height: "100%",
                display: "flex",
                flexdirection: "row",
                width: "100%",
                /* flex-grow: 1; */
                /* margin-top: -10vh; */
            }}
          >
            {/* Octopus or Side Text */}
            <div
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <img src={ranks} alt="ranks" style={{height:"100%"}}/>
            </div>
              {/* League Text Explaining it */}
              <div
              style={{
                display: "block",

                width: "70%",
                textAlign: "center",
              }}
            >
              <div>
                <h3>Compete Against Friends</h3>
                <p>asdjhasjdhkajshdjkhas</p>
              </div>
              <div>
                <h3>Climb the Ranks</h3>
                <p>asdjhasjdhkajshdjkhas</p>
              </div>
              <div>
                <h3>Unlock Rewards</h3>
                <p>asdjhasjdhkajshdjkhas</p>
              </div>
              <div>
                <h3>Community Leaderboards</h3>
                <p>asdjhasjdhkajshdjkhas</p>
              </div>
              
            </div>
            {/* Octopus or Side Text */}
            <div
              style={{
                height:"100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >

              <img src={ranksNewBlack} alt="ranks" style={{height:"100%"}}/>
            </div>
          

            
          </div>
        

        {/* <Button label="Get Started" /> */}
      </div>

    

        {/* --- Section 3 (Future) --- */}
        <div
          style={{
            height: "94.5vh",
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
