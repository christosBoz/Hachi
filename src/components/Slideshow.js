import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Slide 1 Component
function FlashcardSlide() {
  return (
    <div className="slideShowSlide">
      <div className="ImageSection">
        <img alt="Flashcards" src="/images/flashcardoct.png" />
      </div>
      <div className="TextSection">
        <h3>Flash Cards</h3>
        <p>Learn with SRS Learning</p>
        <p>Placeholder Text</p>
        <p>Placeholder Text</p>
        <p>Placeholder Text</p>
      </div>
    </div>
  );
}

// Slide 2 Component
function SlideTwo() {
  return (
    <div className="slideShowSlide">
      <div className="ImageSection">
        <img alt="Flashcards" src="/images/flashcardoct.png" />
      </div>
      <div className="TextSection">
        <h3>Exams</h3>
        <p>Learn with SRS Learning</p>
        <p>Placeholder Text</p>
        <p>Placeholder Text</p>
        <p>Placeholder Text</p>
      </div>
    </div>
  );
}

// Slide 3 Component
function SlideThree() {
  return (
    <div className="slideShowSlide">
      <div className="ImageSection">
        <img alt="Flashcards" src="/images/flashcardoct.png" />
      </div>
      <div className="TextSection">
        <h3>Games</h3>
        <p>Learn with SRS Learning</p>
        <p>Placeholder Text</p>
        <p>Placeholder Text</p>
        <p>Placeholder Text</p>
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
          bottom: "-30px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          listStyle: "none",
        }}
      >
        <ul style={{ display: "flex", gap: "10px" }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          fontSize: "24px",
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
      <SlideTwo />
      <SlideThree />
      <SlideFour />
    </Slider>
  );
}