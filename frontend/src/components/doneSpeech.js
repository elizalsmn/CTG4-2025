import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './doneSpeech.css';
import Back from './Back';

function QuizComplete({ score = 80, totalQuestions = 5, correctAnswers = 4 }) {
  const navigate = useNavigate();

  const getScoreColor = (score) => {
    if (score >= 90) return "score-excellent";
    if (score >= 70) return "score-good";
    if (score >= 50) return "score-average";
    return "score-poor";
  };

  // Circle progress calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Get current date
  const today = new Date();
  const dateOptions = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <div className="quiz-complete-container">
      <div className="quiz-complete-card">
        {/* Header */}
        <div className="quiz-header">
        {/* <Back  to="/homePage" top="52px"/> */}
        </div>

        {/* Quiz Complete section */}
        <div className="quiz-complete-section">
          <div className="quiz-complete-header">
            <h2>Learning Complete!</h2>
            <p>Great job on finishing today's session</p>
          </div>
        </div>

        {/* Main progress circle */}
        <div className="progress-section">
          <div className="progress-ring-container">
            <svg className="progress-ring" width="180" height="180">
              {/* Background circle */}
              <circle
                className="progress-ring-background"
                cx="90"
                cy="90"
                r={radius}
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                className={`progress-ring-progress ${getScoreColor(score)}`}
                cx="90"
                cy="90"
                r={radius}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 90 90)"
              />
            </svg>
            
            {/* Score text in center */}
            <div className="score-center">
              <div className={`score-display ${getScoreColor(score)}`}>
                {score}%
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-label">Score</div>
              <div className="stat-value">{correctAnswers} / {totalQuestions}</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Questions</div>
              <div className="stat-value">{totalQuestions}</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">Accuracy</div>
              <div className="stat-value">{score}%</div>
            </div>
          </div>
        </div>

    

        {/* Done button */}
        <div className="action-section">
          <button 
            className="done-btn"
            onClick={() => navigate("/homePage")}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizComplete;