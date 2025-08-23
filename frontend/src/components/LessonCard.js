import React from "react";
import { FaRegClock } from "react-icons/fa";
import "./LessonCard.css";

function LessonCard({ lesson, onNavigate, onPressStart, onPressEnd }) {
  return (
    <div onClick={onNavigate} className="lesson-card">
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
          onMouseDown={(e) => onPressStart(lesson, e)}
          onMouseUp={onPressEnd}
          onMouseLeave={onPressEnd}
          onTouchStart={(e) => onPressStart(lesson, e)}
          onTouchEnd={onPressEnd}
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
  );
}

export default LessonCard;