import React from "react";
import "./AnimationBox.css";
import SpeechVideo from '../assets/Fox_OP.MOV';

function AnimationBoxTemplate() {
  return (
    <div className="animationbox-template">
      <div className="animation-placeholder-box">
        <video
          className="animation-element"
        //   controls
          width="100%"
          height="100%"
          // poster="/thumbnail.jpg"
          autoPlay={true}
          muted
          loop
        >
          <source src={SpeechVideo} type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default AnimationBoxTemplate;