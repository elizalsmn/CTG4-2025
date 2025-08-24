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
  return (
    <div className="chat-page-bg">
      <header className="chat-header">
        <button className="chat-back-btn" aria-label="Back" onClick={() => navigate('/community')}>
          <span className="chat-back-arrow">&#8592;</span>
        </button>
        <span className="chat-title">Chat</span>
      </header>
      <div className="chat-message-list">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.from === "me" ? "chat-message chat-message-me" : "chat-message chat-message-other"
            }
          >
            <div className="chat-message-bubble">
              {msg.text}
              <span className="chat-message-time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-bar">
        <input className="chat-input" placeholder="Type a message..." disabled />
        <button className="chat-send-btn" disabled>
          <span role="img" aria-label="send">📤</span>
        </button>
      </div>
    </div>
  );
}

export default Chat;
