import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./LessonsLibrary.css";
import { FaArrowLeft} from 'react-icons/fa';
import TranslationBubble from "./TranslationBubble";
import { useNavigate } from "react-router-dom";
import LessonCard from "./LessonCard";
import UserMenu from "./UserMenu";
import Back from "./Back";
import lessonsData from './lessons.json'

function LessonsLibrary() {
  const [bubble, setBubble] = useState(null);
  const timerRef = useRef(null);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const lessons = lessonsData.lessons.map(lesson => ({
    ...lesson,
    title: lesson.translations[i18n.language] || lesson.translations.en,
    type: t(lesson.typeKey)
  }));
  

  const handlePressStart = (lesson, e) => {
    e.preventDefault();

    const isTouch = e.type === "touchstart";
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
 
    timerRef.current = setTimeout(() => {
      setBubble({
        text: lesson.translations.zh,
        x: clientX,
        y: clientY,
      });
    }, 600);
  };

  const handleLessonClick = (lesson) => {
  // Determine the route based on lesson type
    let route;
    if (lesson.typeKey === 'type_video') {
      route = '/AsgUpVideo';
    } else {
      route = '/AsgUp';
    }
    
    // Navigate with lesson data in state
    console.log("lesson", lesson)
    navigate(route, { state: { lesson } });
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
            <Back top="52px"/>
            <h2 className="page-title">{t('lessons_library_title')}</h2>
        </div>
      
      <div className="lessons-list">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onNavigate={() => handleLessonClick(lesson)} // Pass the lesson here
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