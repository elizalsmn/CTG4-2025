import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./LessonsLibrary.css";
import { FaArrowLeft} from 'react-icons/fa';
import TranslationBubble from "./TranslationBubble";
import { useNavigate } from "react-router-dom";
import LessonCard from "./LessonCard";
import UserMenu from "./UserMenu";
import Back from "./Back";

function LessonsLibrary() {
  const [bubble, setBubble] = useState(null);
  const timerRef = useRef(null);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const lessons = [1,2,3,4].map(n => ({
    id: n,
    title: `${t('lesson_prefix')} ${n}: ${t('writing_a')}`,
    type: n % 2 === 0 ? t('type_photo') : t('type_video'),
    due: '25 Aug 2025, at 23:59',
    desc: 'Writing materials for group A, age xx to xx',
    translation: i18n.language === 'zh' ? `第 ${n} 课: 写作` : `${t('lesson_prefix')} ${n}: ${t('writing_a')}`,
    path: n === 1 || n === 3 ? '/AsgUpVideo' + (n===3 ? 'Lesson3' : '') : (n===2 ? '/AsgUp' : '/AsgUpPhotoLesson4')
  }));

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
            <Back/>
            <h2 className="page-title">{t('lessons_library_title')}</h2>
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