import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './WrittenAssignment.css';

function WrittenAssignment() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please drop a PDF file');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('assignment', file);
    formData.append('studentId', '12345'); // This would come from user context in real app
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/assignments/submit/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.id) {
        // Navigate to graded assignment page with results
        navigate(`/AsgGrade?id=${response.data.id}`);
      }
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setError(err.response?.data?.error || 'Error submitting assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  return (
    <div className="written-assignment-container">
      <div className="written-assignment-header">
        <h1>Submit Written Assignment</h1>
        <p>Upload your completed sight words worksheet for AI grading</p>
      </div>
      
      <form onSubmit={handleSubmit} className="assignment-form">
        <div 
          className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <div className="upload-icon">📄</div>
              <h3>Drag & Drop your PDF here</h3>
              <p>or</p>
              <label htmlFor="assignment-file" className="file-input-label">
                Choose PDF File
                <input
                  type="file"
                  id="assignment-file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              <p className="file-requirements">
                PDF files only • Max 10MB
              </p>
            </>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button 
                  type="button" 
                  className="remove-file-btn"
                  onClick={removeFile}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={!file || loading} 
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Processing Assignment...
              </>
            ) : (
              'Submit for AI Grading'
            )}
          </button>
        </div>
      </form>

      <div className="grading-info">
        <h3>How AI Grading Works:</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">🔍</div>
            <div>
              <h4>OCR Scanning</h4>
              <p>AI reads your handwritten answers using advanced OCR technology</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">📝</div>
            <div>
              <h4>Answer Matching</h4>
              <p>Compares your answers against the sight words answer key</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">⭐</div>
            <div>
              <h4>Instant Results</h4>
              <p>Get your score and detailed feedback immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WrittenAssignment;
