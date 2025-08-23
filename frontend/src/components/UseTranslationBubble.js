// useTranslationBubble.js
import { useState, useRef, useEffect } from "react";

export default function useTranslationBubble() {
  const [bubble, setBubble] = useState(null);
  const timerRef = useRef(null);

  const handlePressStart = (lesson, e) => {
    e.preventDefault();
    const isTouch = e.type === "touchstart";
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    timerRef.current = setTimeout(() => {
      setBubble({
        text: lesson.translation,
        x: clientX,
        y: clientY,
      });
    }, 600);
  };

  const handlePressEnd = () => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    const handleGlobalClick = () => setBubble(null);
    if (bubble) {
      document.addEventListener("mousedown", handleGlobalClick);
      document.addEventListener("touchstart", handleGlobalClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
      document.removeEventListener("touchstart", handleGlobalClick);
    };
  }, [bubble]);

  return { bubble, handlePressStart, handlePressEnd };
}