import React, { useState, useEffect } from "react";
import { FaFilePdf, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import "./AsgInfo.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';


function AsgInfo({ status }) {
  // status: "graded" | "upload" | "video"
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const assignmentId = searchParams.get('id');

  // Fetch grade data if this is a graded assignment
  useEffect(() => {
    if (status === "graded" && assignmentId) {
      fetchGradeData();
    }
  }, [status, assignmentId]);

  const fetchGradeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/assignments/${assignmentId}/grade/`);
      setGradeData(response.data);
    } catch (err) {
      console.error('Error fetching grade data:', err);
      setError('Failed to load grade data');
    } finally {
      setLoading(false);
    }
  };

  const assignment = {
    title: gradeData ? gradeData.worksheet_title : 
      (status === "video" ? "Lesson 1: Speech Syllabus B" : "Lesson 1: Writing Syllabus A"),
    due: "25 Aug 2025 at 23:59",
    submissionType: status === "video" ? "Video Upload" : "Photo/Video Upload",
    grade: gradeData ? `${gradeData.grade.correct_answers}/${gradeData.grade.total_questions}` : 
      (status === "graded" ? "87/100" : null),
    percentage: gradeData ? gradeData.grade.percentage : null,
    icon: status === "video" ? "💬" : "✍️",
    iconBg: status === "video" ? "#fff4d6" : "#ffe1d6",
  };

  if (status === "graded" && loading) {
    return (
      <div className="graded-page">
        <div className="loading-container">
          <FaClock className="loading-icon" />
          <p>Loading grade information...</p>
        </div>
      </div>
    );
  }

  if (status === "graded" && error) {
    return (
      <div className="graded-page">
        <div className="error-container">
          <FaTimesCircle className="error-icon" />
          <p>{error}</p>
          <button onClick={() => navigate("/LessonsLibrary")} className="cancel-btn">
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        status === "graded"
          ? "graded-page"
          : status === "upload"
          ? "upasg-page"
          : "asgupvid-page"
      }
    >
      {/* Header */}
      <p className="assignment-label">Assignment Details</p>
      <h3 className="assignment-title">{assignment.title}</h3>
      
      {gradeData && (
        <p className="student-name">Student: {gradeData.student_name}</p>
      )}

      {/* Icon Circle */}
      <div
        className="icon-circle"
        style={{ background: assignment.iconBg }}
      >
        <span role="img" aria-label="icon">
          {assignment.icon}
        </span>
      </div>

      {/* Grade (only if graded) */}
      {status === "graded" && gradeData && (
        <div className="ai-grade-section">
          <div className="grade-box">
            <p className="grade-label">AI Grade</p>
            <p className="grade-value">
              <span className="grade-score">{assignment.grade}</span>
              <span className="grade-percentage">({assignment.percentage}%)</span>
            </p>
          </div>
          
          {/* AI Feedback */}
          {gradeData.grade.feedback && (
            <div className="feedback-box">
              <h4>AI Feedback</h4>
              <p className="feedback-text">{gradeData.grade.feedback}</p>
            </div>
          )}
          
          {/* Detailed Results */}
          <div className="results-section">
            <h4>Detailed Results</h4>
            <div className="answers-grid">
              {gradeData.answers.map((answer, index) => (
                <div key={index} className={`answer-item ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                  <div className="answer-header">
                    <span className="question-number">Q{answer.question_number}</span>
                    {answer.is_correct ? 
                      <FaCheckCircle className="status-icon correct" /> : 
                      <FaTimesCircle className="status-icon incorrect" />
                    }
                  </div>
                  <p className="question-text">{answer.question_text}</p>
                  <div className="answer-comparison">
                    <div className="answer-row">
                      <strong>Correct:</strong> <span className="correct-answer">{answer.correct_answer}</span>
                    </div>
                    <div className="answer-row">
                      <strong>Your answer:</strong> 
                      <span className={`student-answer ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                        {answer.student_answer || '(no answer)'}
                      </span>
                    </div>
                    {answer.confidence > 0 && (
                      <div className="confidence-row">
                        <small>OCR Confidence: {Math.round(answer.confidence)}%</small>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Processing Info */}
          <div className="processing-info">
            <h4>Processing Details</h4>
            <div className="info-grid">
              <div className="info-item">
                <strong>Submitted:</strong> {new Date(gradeData.submitted_at).toLocaleString()}
              </div>
              <div className="info-item">
                <strong>Graded:</strong> {new Date(gradeData.grade.graded_at).toLocaleString()}
              </div>
              <div className="info-item">
                <strong>Processing Method:</strong> AI + OCR Analysis
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Grade Display for non-AI assignments */}
      {status === "graded" && !gradeData && (
        <div className="grade-box">
          <p className="grade-label">Grade</p>
          <p className="grade-value">
            <span className="grade-score">{assignment.grade}</span>
          </p>
        </div>
      )}

      {/* Due Date */}
      <div className="info-box">
        <p className="info-label">Due</p>
        <p className="info-value">{assignment.due}</p>
      </div>

      {/* Submission Type */}
      <div className="info-box">
        <p className="info-label">Submission Type</p>
        <p className="info-value">{assignment.submissionType}</p>
      </div>

      <hr className="divider" />

      {/* Attachments */}
      <div className="attachments">
        <p className="info-label">Attachments</p>
        <div className="attachment-item">
          <FaFilePdf className="pdf-icon" />
          <div className="attachment-text">
            <p className="attachment-name">InstructionFile_LessonA</p>
            <p className="attachment-type">PDF</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <button onClick={() => navigate("/LessonsLibrary")} className="cancel-btn">
          {status === "graded" ? "Back to Lessons" : "Cancel"}
        </button>
        {status === "upload" && (
          <button 
            onClick={() => navigate("/written-assignment")} 
            className="upload-btn"
          >
            Upload Assignment
          </button>
        )}
        {status === "video" && (
          <button onClick={() => navigate("/TakeVideo")} className="start-btn">
            Start Video
          </button>
        )}
        {status === "graded" && gradeData && (
          <button 
            onClick={() => navigate("/written-assignment")} 
            className="retry-btn"
          >
            Try Another Assignment
          </button>
        )}
      </div>
    </div>
  );
}

export default AsgInfo;