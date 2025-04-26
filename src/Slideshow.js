import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function Slideshow() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings} className="slideshow">
      <div className="slideShowSlide">
        <div className="ImageSection">
          <img 
            alt="test" 
            src="/images/flashcardoct.png"
          />
        </div>

        <div className="TextSection">
          <h3>Flash Cards</h3>
          <p>Learn with SRS Learning</p>
          <p>Placeholder Text</p>
          <p>Placeholder Text</p>
          <p>Placeholder Text</p>
          <p>Placeholder Text</p>
          <p>Placeholder Text</p>
        </div>
      </div>

      {/* other slides... */}
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div>
      <div><h3>5</h3></div>
      <div><h3>6</h3></div>
    </Slider>
  );
}
