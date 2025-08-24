import React, { useState, useEffect } from "react";
import "./HomePage.css";
import UserMenu from "./UserMenu";
import TranslationBubble from "./TranslationBubble";
import LessonCard from "./LessonCard";
import { useNavigate } from "react-router-dom";
import useTranslationBubble from "./UseTranslationBubble";
import { useTranslation } from 'react-i18next';
import PerformanceCard from "./PerformanceCard";
import lessonsData from './lessons.json'
import avatar from '../assets/Avatar.png'


// Get only the first 2 lessons for latest submissions
const latestLessons = lessonsData.lessons.slice(0, 2);

const CircularProgress = ({ size = 100, strokeWidth = 8, percentage = 75, color, label = "" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setTimeout(() => {
      setOffset(progressOffset);
    }, 100);  
  }, [circumference, percentage]);

  return (
    <div className="circular-wrapper">
      <svg width={size} height={size} className="circular-progress">
        <circle stroke="#e3e3e3ff" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill={color}
          transform={`rotate(90, ${size / 2}, ${size / 2})`}
        >
          {percentage}%
        </text>
      </svg>
      <div className="circle-text">{percentage}%</div>
      <p className="chart-label">{label}</p>
    </div>
  );
};

const HomePage = () => {
  const { bubble, handlePressStart, handlePressEnd } = useTranslationBubble();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Handle lesson navigation with proper data passing
  const handleLessonClick = (lesson) => {
    let route;
    if (lesson.typeKey === 'type_video') {
      route = '/AsgUpVideo';
    } else {
      route = '/AsgUp';
    }
    
    // Navigate with lesson data in state
    navigate(route, { state: { lesson } });
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-text">
          <h1> {t('hp_student_name')} </h1>
          <p style={{fontSize: "12px", color: "grey"}}> {t('hp_grade_level')} </p>
        </div>
        <div className="profile-icon">
          <button onClick={() => navigate("/profile")} className="profile-icon">
            <img
              src={avatar}
              alt="Profile avatar"
              className="profile-avatar"
              style={{ width: '50px', height: '50px' }}
            />
          </button>
        </div>
      </header>

      <PerformanceCard />
      <div className="content-container">
        {/* Attendance + Submissions */}
        <div className="row-cards">
          <div className="info-card chart-card hover-card">
            <CircularProgress percentage={85} color="#436448ff" label={t('attendance')} />
            <div className="hover-details">
              <p>{t('classes_attended', { done: 17, total: 20 })}</p>
            </div>
          </div>

          <div className="info-card-2 chart-card hover-card">
            <CircularProgress percentage={(8 / 10) * 100} color="#a46131ff" label={t('submissions')} />
            <div className="hover-details">
              <p>{t('assignments_submitted', { done: 8, total: 10 })}</p>
            </div>
          </div>
        </div>

        <div className="PerformanceSummary">
          <h2>{t('due_soon')}</h2>
          <div className="lessons-list">
            {latestLessons.map((lesson) => {
              const localized = {
                ...lesson,
                title: lesson.translations[i18n.language] || lesson.translations.en,
                type: t(lesson.typeKey),
                desc: t(lesson.descKey)
              };
              return (
                <LessonCard
                  key={lesson.id}
                  lesson={localized}
                  onNavigate={() => handleLessonClick(lesson)}
                  onPressStart={handlePressStart}
                  onPressEnd={handlePressEnd}
                />
              );
            })}
          </div>
        </div>

        {bubble && <TranslationBubble text={bubble.text} x={bubble.x} y={bubble.y} />}
      </div>

      <UserMenu />
    </div>
  );
};

export default HomePage;