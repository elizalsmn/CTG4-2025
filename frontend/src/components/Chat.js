import React from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

const messages = [
  { from: "me", text: "Hello! Did you enjoy story time today?", time: "9:02 PM" },
  { from: "other", text: "Yes! I loved the story about the caterpillar.", time: "9:03 PM" },
  { from: "me", text: "Which part was your favorite?", time: "9:04 PM" },
  { from: "other", text: "When the caterpillar turned into a butterfly!", time: "9:05 PM" },
  { from: "me", text: "That was magical! Do you want to draw a butterfly tomorrow?", time: "9:06 PM" },
  { from: "other", text: "Yes please! Can we use lots of colors?", time: "9:07 PM" },
  { from: "me", text: "Of course! We will use all the crayons.", time: "9:08 PM" },
];

function Chat() {
  const navigate = useNavigate();
  const chatPerson = {
    emoji: "🧑",
    name: "Teacher Ling",
    status: "online"
  };

  return (
    <div className="chat-page-bg">
      {/* HEADER with profile */}
      <header className="chat-header">
        <button
          className="chat-back-btn"
          aria-label="Back"
          onClick={() => navigate('/community')}
        >
          <span className="chat-back-arrow">←</span>
        </button>

        <div className="chat-header-profile">
          <div className="chat-avatar">{chatPerson.emoji}</div>
          <div className="chat-header-info">
            <span className="chat-header-name">{chatPerson.name}</span>
            <span className="chat-header-status">{chatPerson.status}</span>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <div className="chat-message-list">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.from === "me"
                ? "chat-message chat-message-me"
                : "chat-message chat-message-other"
            }
          >
            <div className="chat-message-bubble">
              <span className="chat-message-text">{msg.text}</span>
              <span className="chat-message-time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input-bar">
        <input className="chat-input" placeholder="Type a message..." disabled />
        <button className="chat-send-btn" disabled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Chat;