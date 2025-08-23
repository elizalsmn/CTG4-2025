import React, { useState, useRef, useEffect } from "react";
import "./LessonsLibrary.css";
import { FaArrowLeft} from 'react-icons/fa';
import TranslationBubble from "./TranslationBubble";
import { useNavigate } from "react-router-dom";
import LessonCard from "./LessonCard";
import UserMenu from "./UserMenu";

function LessonsLibrary() {
  const [bubble, setBubble] = useState(null);
  const timerRef = useRef(null);

  const navigate = useNavigate();

  const lessons = [
    {
      id: 1,
      title: "Lesson 1: Writing A",
      type: "Video",
      due: "25 Aug 2025, at 23:59",
      desc: "Writing materials for group A, age xx to xx",
      translation: "第 1 课: 写作",
      path: "/AsgUpVideo",
    },
    {
      id: 2,
      title: "Lesson 2: Writing A",
      type: "Photo",
      due: "25 Aug 2025, at 23:59",
      desc: "Writing materials for group A, age xx to xx",
      translation: "第 2 课: 写作",
      path: "/AsgUp",
    },
    {
      id: 3,
      title: "Lesson 3: Writing A",
      type: "Video",
      due: "25 Aug 2025, at 23:59",
      desc: "Writing materials for group A, age xx to xx",
      translation: "第 3 课: 写作",
      path: "/AsgUpVideoLesson3",
    },
    {
      id: 4,
      title: "Lesson 4: Writing A",
      type: "Photo",
      due: "25 Aug 2025, at 23:59",
      desc: "Writing materials for group A, age xx to xx",
      translation: "第 4 课: 写作",
      path: "/AsgUpPhotoLesson4",
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

  return (
    <div className="lessons-library">
        <div className="header">
            <FaArrowLeft onClick={() => navigate("/HomePage")}className="back-arrow" />
            <h2 className="page-title">Lessons Library</h2>
        </div>
      
      <div className="lessons-list">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onNavigate={() => navigate(lesson.path)}
            onPressStart={handlePressStart}
            onPressEnd={handlePressEnd}
          />
        ))}
      </div>

      {bubble && (
        <TranslationBubble text={bubble.text} x={bubble.x} y={bubble.y} />
      )}

      <UserMenu/>
    </div>
  );
}

export default LessonsLibrary;