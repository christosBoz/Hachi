import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import flashcardLogo from "../assets/slideshowIcons/flashcard.png";
import studyguideLogo from "../assets/slideshowIcons/studyguide.png"
import monkeyorange from "../assets/monkeyorange.png"
// Slide 1 Component
function FlashcardSlide() {
  return (
    <div className="slideShowSlide">
      <div className="ImageSection">
      <img src={flashcardLogo} alt="Cat" style={{ height: "100%" }} />      </div>
      <div className="TextSection">
        <h3 style={{color: "#5d3fe4", margin:0}}>Flash Cards</h3>
        <h1 style={{margin:0}}>Spaced Repetition (SRS)</h1>
        <p style={{marginTop:0}}>Faster, longer-lasting memory.</p>
        <h1 style={{margin:0}}>Fully Customizable</h1>
        <p style={{marginTop:0}}>Add images, audio, hints, mnemonic devices and more!</p>
        <h1 style={{margin:0}}>Automically Synced</h1>
        <p style={{marginTop:0}}>Pick up where you left off. Anywhere, anytime, anyway.</p>
        <h1 style={{margin:0}}>Easy Imports</h1>
        <p style={{marginTop:0}}>Bring your flash cards from other applications.</p>
      </div>
    </div>
  );
}

// Slide 2 Component
function StudyguidesSlide() {
  return (
    <div className="slideShowSlide">
      <div className="TextSection" style={{ marginLeft: "2%" }}>
        <h3 style={{ color: "#85beeb", margin: 0 }}>Study Guides</h3>
        <h1 style={{ margin: 0 }}>Organized Learning</h1>
        <p style={{ marginTop: 0 }}>Easily structure complex topics into simple guides.</p>
        <h1 style={{ margin: 0 }}>Fully Customizable</h1>
        <p style={{ marginTop: 0 }}>Add headings, subtopics, images, and notes for better comprehension.</p>
        <h1 style={{ margin: 0 }}>Automatic Sync</h1>
        <p style={{ marginTop: 0 }}>Access your study guides anywhere, anytime — always up to date.</p>
        <h1 style={{ margin: 0 }}>Collaborative Editing</h1>
        <p style={{ marginTop: 0 }}>Work with classmates and share guides in real-time.</p>
        <h1 style={{ margin: 0 }}>Easy Imports</h1>
        <p style={{ marginTop: 0 }}>Bring in study materials from PDFs, Word docs, or other apps.</p>
      </div>
      <div className="ImageSection">
        <img src={studyguideLogo} alt="Study Guide" style={{ height: "100%" }} />
      </div>
    </div>
  );
}


// Slide 3 Component
// Slide 3 Component (Games)
function GameSlide() {
  return (
    <div className="slideShowSlide">
      <div className="TextSection" style={{ marginLeft: "2%" }}>
        <h3 style={{ color: "#ff8600", margin: 0 }}>Games</h3>
        <h1 style={{ margin: 0 }}>Learn Through Play</h1>
        <p style={{ marginTop: 0 }}>Boost memory and understanding with fun educational games.</p>
        <h1 style={{ margin: 0 }}>Interactive Challenges</h1>
        <p style={{ marginTop: 0 }}>Compete against yourself or friends with timed quizzes and puzzles!</p>
        <h1 style={{ margin: 0 }}>Adaptive Difficulty</h1>
        <p style={{ marginTop: 0 }}>Games get easier or harder based on your skill level.</p>
        <h1 style={{ margin: 0 }}>Rewards & Achievements</h1>
        <p style={{ marginTop: 0 }}>Earn badges and milestones to keep you motivated!</p>
      </div>
      <div className="ImageSection">
        <img src={monkeyorange} alt="Games" style={{ height: "100%" }} />
      </div>
    </div>
  );
}


function SlideFour() {
  return (
    <div className="slideShowSlide">
      <div className="ImageSection">
        <img alt="Flashcards" src="/images/flashcardoct.png" />
      </div>
      <div className="TextSection">
        <h3>Study Guides</h3>
        <p>Learn with SRS Learning</p>
        <p>Placeholder Text</p>
        <p>Placeholder Text</p>
        <p>Placeholder Text</p>
      </div>
    </div>
  );
}

// Main Slideshow
export default function Slideshow() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: dots => (
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          listStyle: "none",
        }}
      >
        <ul style={{ display: "flex", gap: "3vh" , paddingInlineStart:0}}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          fontSize: "2vh",
          fontWeight: "bold",
        }}
      >
        __
      </div>
    ),
  };

  return (
    <Slider {...settings} className="slideshow">
      <FlashcardSlide />
      <StudyguidesSlide />
      <GameSlide />
    </Slider>
  );
}