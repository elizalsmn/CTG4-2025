import React from "react";
import "./AsgUp.css";
import { FaFilePdf } from "react-icons/fa";

function UpAsg() {
  return (
    <div className="upasg-page">
      {/* Header */}
      <p className="assignment-label">Assignment Details</p>
      <h3 className="assignment-title">Lesson 1: Writing Syllabus A</h3>

      {/* Icon Circle */}
      <div className="icon-circle">
        <span role="img" aria-label="writing">
          ✍️
        </span>
      </div>

      {/* Due Date */}
      <div className="info-box">
        <p className="info-label">Due</p>
        <p className="info-value">25 Aug 2025 at 23:59</p>
      </div>

      {/* Submission Type */}
      <div className="info-box">
        <p className="info-label">Submission Type</p>
        <p className="info-value">Photo/Video Upload</p>
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

      {/* Footer Buttons */}
      <div className="footer">
        <button className="cancel-btn">Cancel</button>
        <button className="upload-btn">Upload</button>
      </div>
    </div>
  );
}

export default UpAsg;