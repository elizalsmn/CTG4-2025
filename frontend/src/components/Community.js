import React from "react";
import { useNavigate } from "react-router-dom";
import "./Community.css";



const chats = [
  {
    emoji: "🧑‍🤝‍🧑",
    name: "My Community",
    message: "We are on our way!",
    time: "9:32 PM",
    unread: 2
  },
  {
    emoji: "🏫",
    name: "My Kindergarden",
    message: "Enjoy your night!!",
    time: "9:29 PM",
    unread: 1
  },
  {
    emoji: "🧑",
    name: "Teacher Ling",
    message: "Butterfly is an insect.",
    time: "9:18 PM",
    unread: 1
  },
  {
    emoji: "🧑",
    name: "Jackson Wang",
    message: "What do you think?",
    time: "9:11 PM",
    unread: 2
  },
  {
    emoji: "🧑",
    name: "Fidessa Tam",
    message: "Enjoy!",
    time: "9:12 PM",
    unread: 1
  },
  {
    emoji: "🧑",
    name: "Michelle Chen",
    message: "Good luck Tom!",
    time: "9:07 PM",
    unread: 1
  },
  {
    emoji: "🧑",
    name: "Thomas Sanford",
    message: "I am ready for the hack!",
    time: "9:05 PM",
    unread: 1
  },
  {
    emoji: "🧑",
    name: "Rivaldo Jay",
    message: "How are you?",
    time: "9:02 PM",
    unread: 1
  },
  {
    emoji: "🧑",
    name: "Lionel Messi",
    message: "I think its fine.",
    time: "9:00 PM",
    unread: 1
  }
];


function Community() {
  const navigate = useNavigate();
  return (
    <div className="community-page-bg">
      <header className="community-header">
        <button className="community-back-btn" aria-label="Back">
          <span className="community-back-arrow">&#8592;</span>
        </button>
        <span className="community-title">Community</span>
        <button className="community-menu-btn" aria-label="Menu">
          <span className="community-menu-icon">&#9776;</span>
        </button>
      </header>
      <div className="community-chat-list">
        {chats.map((chat, idx) => (
          <div
            className="community-chat-item"
            key={chat.name}
            onClick={() => navigate('/chat')}
            style={{ cursor: 'pointer' }}
          >
            <div className="community-avatar-wrapper">
              <div className="community-avatar community-avatar-emoji">
                <span style={{fontSize: '2rem'}}>{chat.emoji}</span>
              </div>
            </div>
            <div className="community-chat-info">
              <div className="community-chat-top">
                <span className="community-chat-name">{chat.name}</span>
                <span className="community-chat-time">{chat.time}</span>
              </div>
              <div className="community-chat-bottom">
                <span className="community-chat-message">{chat.message}</span>
                {chat.unread > 0 && (
                  <span className="community-chat-unread">{chat.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Community;
