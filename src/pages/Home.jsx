import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Button from "../components/Button";
import HachiLogoLong from "../assets/HachiLogoLong.png";
import quotes from "../assets/quotes";
import Slideshow from "../components/Slideshow";
import { useInView } from "react-intersection-observer";
import './Home.css';
import ranks from "../assets/ranks.png";
import ranksNew from "../assets/ranksNew.png";
import ranksNewBlack from "../assets/ranksNewBlack.png";
import leaderboard from "../assets/leaderboard.png";

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
      <TopBanner randomQuote={randomQuote} />
      <MainScrollArea leaderboardRef={leaderboardRef} />
    </div>
  );
}

function TopBanner({ randomQuote }) {
  return (
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
      {/* Right Side Buttons */}
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
  );
}

function MainScrollArea({ leaderboardRef }) {
  return (
    <div
      style={{
        height: "calc(94.5vh)",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
      }}
    >
      <LearnYourWaySection />
      <LeaderboardSection leaderboardRef={leaderboardRef} />
      <FutureSection />
    </div>
  );
}

function LearnYourWaySection() {
  return (
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
  );
}

function LeaderboardSection({ leaderboardRef }) {
  return (
    <div
      ref={leaderboardRef}
      style={{
        height: "94.5vh",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6A39FE",
        color: "white",
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        {/* Left Side Image */}
        <div
          style={{
            height: "100%",
            display: "flex",
            marginLeft: "2%",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <img src={leaderboard} alt="leaderboard" style={{ height: "80%" }} />
        </div>

        {/* Center Text */}
        <div
          style={{
            display: "block",
            width: "70%",
            textAlign: "center",
            display:"flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems:"center",
            justifyContent:"center"
          }}
          className="leaderboardInfo"
        >
          <div>
            <h3>Compete Against Friends</h3>
            <p>Challenge your friends in games and climb the leaderboards together.</p>
          </div>
          <div>
            <h3>Climb the Ranks</h3>
            <p>Earn points to promote to higher leagues and showcase your skills.</p>
          </div>
          <div>
            <h3>Unlock Rewards</h3>
            <p>Win exclusive rewards and bonuses for reaching new ranks and milestones.</p>
          </div>
          <div>
            <h3>Community Leaderboards</h3>
            <p>See how you stack up against players worldwide and dominate your league.</p>
          </div>
        </div>

        {/* Right Side Image */}
        <div
          style={{
            height: "100%",
            display: "flex",
            marginRight: "2%",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <img src={ranks} alt="ranks" style={{ height: "80%" }} />
        </div>
      </div>
    </div>
  );
}

function FutureSection() {
  return (
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
  );
}

export default Home;
