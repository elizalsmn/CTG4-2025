import React, { useState } from "react";
import "./NewAssignmentPage.css";
import AdminMenu from "./AdminMenu";
import Back from "./Back";

const NewAssignmentPage = () => {
  const [aiGrading, setAiGrading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(false);
  const [gradingVisibility, setGradingVisibility] = useState("Show to Me");
  const [analysisVisibility, setAnalysisVisibility] = useState("Show to Me");
  const [questionFile, setQuestionFile] = useState(null);
  const [answerKeyFile, setAnswerKeyFile] = useState(null);

  const handleQuestionFileChange = (e) => {
    if (e.target.files[0]) {
      setQuestionFile(e.target.files[0]);
    }
  };

  const handleAnswerKeyFileChange = (e) => {
    if (e.target.files[0]) {
      setAnswerKeyFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      aiGrading,
      aiAnalysis,
      gradingVisibility,
      analysisVisibility,
      questionFile,
      answerKeyFile
    });
    
    // You would typically send this data to your backend here
  };

  return (
    <div className="new-assignment-page">
      {/* Header */}
      <header className="assignment-header">
        <Back to="/classes" />
        <h1>Create New Assignment</h1>
      </header>

      <form onSubmit={handleSubmit} className="assignment-form">
        <div className="form-section">
          <label htmlFor="assignmentTitle" className="form-label">Assignment Title</label>
          <input 
            type="text" 
            id="assignmentTitle" 
            className="form-input"
            placeholder="Enter assignment title" 
            required
          />
        </div>
        
        <div className="form-section">
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input 
            type="date" 
            id="dueDate" 
            className="form-input"
            required
          />
        </div>

        <div className="form-section">
          <div className="toggle-container">
            <div className="toggle-label">
              <span>AI Grading</span>
              <span className="toggle-description">
                Enable automatic grading using AI
              </span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={aiGrading}
                onChange={(e) => setAiGrading(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {aiGrading && (
            <div className="toggle-options">
              <label htmlFor="gradingVisibility" className="form-label">Visibility</label>
              <select
                id="gradingVisibility"
                className="form-select"
                value={gradingVisibility}
                onChange={(e) => setGradingVisibility(e.target.value)}
              >
                <option value="Show to Me">Show to Me</option>
                <option value="Show to Me & Parents">Show to Me & Parents</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="toggle-container">
            <div className="toggle-label">
              <span>AI Analysis</span>
              <span className="toggle-description">
                Enable detailed performance analysis using AI
              </span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={aiAnalysis}
                onChange={(e) => setAiAnalysis(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {aiAnalysis && (
            <div className="toggle-options">
              <label htmlFor="analysisVisibility" className="form-label">Visibility</label>
              <select
                id="analysisVisibility"
                className="form-select"
                value={analysisVisibility}
                onChange={(e) => setAnalysisVisibility(e.target.value)}
              >
                <option value="Show to Me">Show to Me</option>
                <option value="Show to Me & Parents">Show to Me & Parents</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>File Upload</h3>
          
          <div className="file-upload-container">
            <label htmlFor="questionFile" className="file-label">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <span className="file-title">Questions File</span>
                <span className="file-description">Upload PDF, DOCX, or image files</span>
              </div>
              <div className="file-button">Upload</div>
            </label>
            <input 
              type="file" 
              id="questionFile" 
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              onChange={handleQuestionFileChange}
              required
              className="file-input"
            />
            {questionFile && (
              <div className="file-name">
                Selected: {questionFile.name}
              </div>
            )}
          </div>

          {aiGrading && (
            <div className="file-upload-container">
              <label htmlFor="answerKeyFile" className="file-label">
                <div className="file-icon">🔑</div>
                <div className="file-info">
                  <span className="file-title">Answer Key File</span>
                  <span className="file-description">Required for AI grading</span>
                </div>
                <div className="file-button">Upload</div>
              </label>
              <input 
                type="file" 
                id="answerKeyFile" 
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleAnswerKeyFileChange}
                required={aiGrading}
                className="file-input"
              />
              {answerKeyFile && (
                <div className="file-name">
                  Selected: {answerKeyFile.name}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => window.history.back()}>
            Cancel
          </button>
          <button type="submit" className="create-button">
            Create Assignment
          </button>
        </div>
      </form>

      {/* Admin Menu */}
      <AdminMenu selectedTab="Classes" />
    </div>
  );
};

export default NewAssignmentPage;
