import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaFilePdf, FaCommentDots, FaPaperPlane, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Back from "./Back";
import "./AsgGraded.css";

function AsgGraded({ assignmentId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const endRef = useRef(null);

  const assignment = useMemo(
    () => ({
      id: assignmentId || "asg-001",
      title: t("asg_lesson1_writingA"),
      icon: "✍️",
      iconBg: "#ffe1d6",
      due: "25 Aug 2025 23:59",
      submissionType: t("asg_photo_video_upload"),
      grade: "87/100",
      attachments: [
        { id: "a1", name: `${t("asg_instruction_file")}_LessonA`, type: t("asg_pdf") },
      ],
      teacherSummary: t("asg_teacher_overall_feedback", {
        defaultValue:
          "Nice Job! Please help Shannon to practice how to say 3-syllables word more if you have time~",
      }),
    }),
    [assignmentId, t]
  );

  // read: whether the parent has read this student-authored message
  const [comments, setComments] = useState([
    
    {
      id: "c2",
      authorRole: "student",
      authorName: "You",
      text: "Shannon now can pronounce butterfly correctly.",
      createdAt: "2025-08-26T09:02:00Z",
      read: true, // parent has read this one
    },
    {
      id: "c1",
      authorRole: "teacher",
      authorName: "Ms. Lee",
      text: "That's great!",
      createdAt: "2025-08-26T10:15:00Z",
    }
  ]);
  const [newComment, setNewComment] = useState("");

  const commentCount = comments.length;

  const addComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    const c = {
      id: `c${Date.now()}`,
      authorRole: "student",
      authorName: "You",
      text: trimmed,
      createdAt: new Date().toISOString(),
      read: false, // new messages start as unread by parent
    };
    setComments((prev) => [...prev, c]);
    setNewComment("");
  };

  const toggleRead = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, read: !c.read } : c
      )
    );
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      addComment();
    }
  };

  return (
    <div className="graded-asg-page">
      <Back to="/LessonsLibrary" />

      <p className="assignment-label">{t("asg_details")}</p>
      <h3 className="assignment-title">{assignment.title}</h3>

      <div className="icon-circle" style={{ background: assignment.iconBg }}>
        <span role="img" aria-label="icon">
          {assignment.icon}
        </span>
      </div>

      <div className="grade-box">
        <p className="grade-label">{t("asg_grade")}</p>
        <p className="grade-value">
          <span className="grade-score">{assignment.grade}</span>
        </p>
      </div>

      <div className="info-box">
        <p className="info-label">{t("asg_due")}</p>
        <p className="info-value">{assignment.due}</p>
      </div>

      <div className="info-box">
        <p className="info-label">{t("asg_submission_type")}</p>
        <p className="info-value">{assignment.submissionType}</p>
      </div>

      <hr className="divider" />

      <div className="attachments">
        <p className="info-label">{t("asg_attachments")}</p>
        {assignment.attachments.map((att) => (
          <div key={att.id} className="attachment-item">
            <FaFilePdf className="pdf-icon" />
            <div className="attachment-text">
              <p className="attachment-name">{att.name}</p>
              <p className="attachment-type">{att.type}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="divider" />

      <div className="teacher-feedback">
        <div className="tf-header">
          <FaCommentDots className="tf-icon" />
          <p className="tf-title">
            {t("asg_teacher_comment", { defaultValue: "Teacher’s Comment" })}
          </p>
        </div>
        <p className="tf-body">{assignment.teacherSummary}</p>
      </div>

      <div className="thread-section">
        <div className="thread-header">
          <p className="info-label">
            {t("asg_comments", { defaultValue: "Comments" })} ({commentCount})
          </p>
        </div>

        <div className="thread-list">
          {comments.map((c) => {
            const isStudent = c.authorRole === "student";
            return (
              <div
                key={c.id}
                className={`thread-item ${c.authorRole}`}
              >
                <div className="thread-top">
                  <div className="thread-meta">
                    <span className="author">{c.authorName}</span>
                    <span className="dot">•</span>
                    <span className="role">
                      {isStudent
                        ? t("asg_student", { defaultValue: "Student" })
                        : t("asg_teacher", { defaultValue: "Teacher" })}
                    </span>
                    <span className="dot">•</span>
                    <span className="time">{formatTime(c.createdAt)}</span>
                  </div>

                  {/* Read status only for student's own messages */}
                  {isStudent && c.read === true && (
                    <span
                        className="read-pill read"
                        aria-label={t("asg_parent_has_read", { defaultValue: "Teacher has read" })}
                        title={t("asg_parent_has_read", { defaultValue: "Teacher has read" })}
                    >
                        <FaEye />
                        <span>{t("asg_read", { defaultValue: "Read" })}</span>
                    </span>
                    )}
                </div>
                <p className="thread-text">{c.text}</p>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <div className="composer">
          <textarea
            className="composer-input"
            placeholder={t("asg_add_comment_placeholder", {
              defaultValue: "Add a comment…",
            })}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <button
            className="composer-send"
            onClick={addComment}
            disabled={!newComment.trim()}
          >
            <FaPaperPlane />
            <span>{t("asg_send", { defaultValue: "Send" })}</span>
          </button>
        </div>
      </div>

      <div className="footer">
        <button
          onClick={() => navigate("/LessonsLibrary")}
          className="cancel-btn"
        >
          {t("asg_back_to_library", { defaultValue: "Back to Library" })}
        </button>
      </div>
    </div>
  );
}

export default AsgGraded;