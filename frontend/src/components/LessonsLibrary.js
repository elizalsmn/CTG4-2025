import React, { useState, useRef, useEffect } from "react";
import "./LessonsLibrary.css";
import { FaRegClock } from "react-icons/fa";
import TranslationBubble from "./TranslationBubble";

function LessonsLibrary() {
  const [bubble, setBubble] = useState(null); // { text, x, y }
  const timerRef = useRef(null);

  const lessons = [
    {
      id: 1,
      title: "Lesson 1: Writing A",
      type: "Video",
      due: "25 Aug 2025, at 23:59",
      desc: "Writing materials for group A, age xx to xx",
      translation: "第 1 课: 写作",
    },
    {
      id: 2,
      title: "Lesson 2: Writing A",
      type: "Photo",
      due: "25 Aug 2025, at 23:59",
      desc: "Writing materials for group A, age xx to xx",
      translation: "第 2 课: 写作",
    },
    {
      id: 3,
      title: "Lesson 3: Writing A",
      type: "Video",
      due: "25 Aug 2025, at 23:59",
      desc: "Writing materials for group A, age xx to xx",
      translation: "第 3 课: 写作",
    },
    {
      id: 4,
      title: "Lesson 4: Writing A",
      type: "Photo",
      due: "25 Aug 2025, at 23:59",
      desc: "Writing materials for group A, age xx to xx",
      translation: "第 4 课: 写作",
    },
  ];

const handlePressStart = (lesson, e) => {
  e.preventDefault();

  const isTouch = e.type === "touchstart";
  const clientX = isTouch ? e.touches[0].clientX : e.clientX;
  const clientY = isTouch ? e.touches[0].clientY : e.clientY;

  timerRef.current = setTimeout(() => {
    setBubble({
      text: lesson.translation,
      x: clientX,
      y: clientY, // will adjust in bubble CSS
    });
  }, 2000);
};

  const handlePressEnd = () => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    // ❌ Do not hide bubble here — it stays until another tap
  };

  // Hide bubble when clicking anywhere else
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

  return (
    <div className="lessons-library">
      <h2 className="page-title">Lessons Library</h2>

      <div className="lessons-list">
        {lessons.map((lesson) => (
          <div className="lesson-card" key={lesson.id}>
            <div className="lesson-header">
              <span
                className={`lesson-tag ${
                  lesson.type === "Video" ? "video" : "photo"
                }`}
              >
                {lesson.type}
              </span>

              <h3
                className="lesson-title"
                onMouseDown={(e) => handlePressStart(lesson, e)}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={(e) => handlePressStart(lesson, e)}
                onTouchEnd={handlePressEnd}
              >
                {lesson.title}
              </h3>
            </div>

            <div className="lesson-info">
              <FaRegClock className="clock-icon" />
              <p className="due-text">{lesson.due}</p>
            </div>

            <p className="lesson-desc">{lesson.desc}</p>
          </div>
        ))}
      </div>

      {bubble && (
        <TranslationBubble text={bubble.text} x={bubble.x} y={bubble.y} />
      )}
    </div>
  );
}

export default LessonsLibrary;