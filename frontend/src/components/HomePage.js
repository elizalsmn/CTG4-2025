import React, { useState, useEffect } from "react";
import "./HomePage.css";
import UserMenu from "./UserMenu";
import TranslationBubble from "./TranslationBubble";
import LessonCard from "./LessonCard";
import { useNavigate } from "react-router-dom";
import useTranslationBubble from "./UseTranslationBubble";

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
];

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
  // ✅ use the custom hook
  const { bubble, handlePressStart, handlePressEnd } = useTranslationBubble();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-text">
          <h1> Shannon Sie 👧🏻 </h1>
          <p style={{fontSize: "12px", color: "grey"}}> Pre Kindergaten (K2)  </p>
        </div>
        <div className="profile-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="28" height="28" fill="#4fa07f">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm89.6 
            32h-11.8c-22.2 10.2-46.9 16-73.8 
            16s-51.6-5.8-73.8-16h-11.8C64.5 
            288 0 352.5 0 432c0 44.2 35.8 
            80 80 80h288c44.2 0 80-35.8 
            80-80 0-79.5-64.5-144-134.4-144z"/>
          </svg>
        </div>
      </header>

      <div className="content-container">
        {/* Attendance + Submissions */}
        <div className="row-cards">
          <div className="info-card chart-card hover-card">
            <CircularProgress percentage={85} color="#436448ff" label="Attendance" />
            <div className="hover-details">
              <p>Classes attended: 17/20</p>
            </div>
          </div>

          <div className="info-card-2 chart-card hover-card">
            <CircularProgress percentage={(8 / 10) * 100} color="#a46131ff" label="Submissions" />
            <div className="hover-details">
              <p>Assignments submitted: 8/10</p>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="PerformanceSummary">
          <h2>Performance Summary</h2>
          <div className="performance-box">
            <p>place holder for AI analytics :D</p>
            <p>place holder for AI analytics :D</p>
          </div>
        </div>

        {/* Latest Submission */}
        <div className="PerformanceSummary">
          <h2>Latest Submission</h2>
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
        </div>

        {bubble && <TranslationBubble text={bubble.text} x={bubble.x} y={bubble.y} />}
      </div>

      <UserMenu />
    </div>
  );
};

export default HomePage;