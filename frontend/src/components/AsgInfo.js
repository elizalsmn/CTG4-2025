import React from "react";
import { FaFilePdf } from "react-icons/fa";
import "./AsgInfo.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Back from "./Back";
import UserMenu from "./UserMenu";

function AsgInfo({ status }) {
  // status: "graded" | "upload" | "video"
  const { t } = useTranslation();
  const navigate = useNavigate();

  const assignment = {
    title: status === 'video' ? t('asg_lesson1_speechB') : t('asg_lesson1_writingA'),
    due: '25 Aug 2025 23:59',
    submissionType: status === 'video' ? t('asg_video_upload') : t('asg_photo_video_upload'),
    grade: status === 'graded' ? '87/100' : null,
    icon: status === 'video' ? '💬' : '✍️',
    iconBg: status === 'video' ? '#fff4d6' : '#ffe1d6'
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
      {/* Always-visible back button in a consistent position */}
      <Back to="/LessonsLibrary" />

      {/* Header */}
      <p className="assignment-label">{t('asg_details')}</p>
      <h3 className="assignment-title">{assignment.title}</h3>

      {/* Icon Circle */}
      <div className="icon-circle" style={{ background: assignment.iconBg }}>
        <span role="img" aria-label="icon">
          {assignment.icon}
        </span>
      </div>

      {/* Grade (only if graded) */}
      {status === "graded" && (
        <div className="grade-box">
          <p className="grade-label">{t('asg_grade')}</p>
          <p className="grade-value">
            <span className="grade-score">{assignment.grade}</span>
          </p>
        </div>
      )}

      {/* Due Date */}
      <div className="info-box">
        <p className="info-label">{t('asg_due')}</p>
        <p className="info-value">{assignment.due}</p>
      </div>

      {/* Submission Type */}
      <div className="info-box">
        <p className="info-label">{t('asg_submission_type')}</p>
        <p className="info-value">{assignment.submissionType}</p>
      </div>

      <hr className="divider" />

      {/* Attachments */}
      <div className="attachments">
        <p className="info-label">{t('asg_attachments')}</p>
        <div className="attachment-item">
          <FaFilePdf className="pdf-icon" />
          <div className="attachment-text">
            <p className="attachment-name">{t('asg_instruction_file')}_LessonA</p>
            <p className="attachment-type">{t('asg_pdf')}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        {/* Keep your existing navigation buttons */}
        <button onClick={() => navigate("/LessonsLibrary")} className="cancel-btn">
          {t('asg_cancel')}
        </button>
        {status === "upload" && (
          <button className="upload-btn">{t('asg_upload')}</button>
        )}
        {status === "video" && (
          <button onClick={() => navigate("/TakeVideo")} className="start-btn">
            {t('asg_start_video')}
          </button>
        )}
      </div>
      {/* <UserMenu /> */}
    </div>
  );
}

export default AsgInfo;