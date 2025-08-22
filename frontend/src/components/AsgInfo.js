import React from "react";
import { FaFilePdf } from "react-icons/fa";
import "./AsgInfo.css";

function AsgInfo({ status }) {
  // status: "graded" | "upload" | "video"

  const assignment = {
    title:
      status === "video"
        ? "Lesson 1: Speech Syllabus B"
        : "Lesson 1: Writing Syllabus A",
    due: "25 Aug 2025 at 23:59",
    submissionType:
      status === "video" ? "Video Upload" : "Photo/Video Upload",
    grade: status === "graded" ? "87/100" : null,
    icon:
      status === "video" ? "💬" : "✍️",
    iconBg:
      status === "video" ? "#fff4d6" : "#ffe1d6",
  };

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
      {status === "graded" && (
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
        <button className="cancel-btn">Cancel</button>
        {status === "upload" && (
          <button className="upload-btn">Upload</button>
        )}
        {status === "video" && (
          <button className="start-btn">Start Video</button>
        )}
      </div>
    </div>
  );
}

export default AsgInfo;