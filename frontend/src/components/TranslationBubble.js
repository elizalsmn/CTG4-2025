import React from "react";
import "./TranslationBubble.css";

const TranslationBubble = ({ text, x = 0, y = 0, maxWidth = 250 }) => {
  return (
    <div
      className="translation-bubble"
      style={{ left: x, top: y, maxWidth: maxWidth }}
    >
      {text}
      <div className="translation-bubble-tail"></div>
    </div>
  );
};

export default TranslationBubble;