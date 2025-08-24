import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Community.css";
import Back from "./Back";
import UserMenu from "./UserMenu";

const chats = [
  { emoji: "🧑‍🤝‍🧑", name: "My Community", message: "We are on our way!", time: "9:32 PM", unread: 2, pinned: true },
  { emoji: "🏫", name: "My Kindergarden", message: "Enjoy your night!!", time: "9:29 PM", unread: 3, pinned: true },
  { emoji: "🧑", name: "Teacher Ling", message: "Butterfly is an insect.", time: "9:18 PM", unread: 1 },
  { emoji: "🧑", name: "Jackson Wang", message: "What do you think?", time: "9:11 PM", unread: 2 },
  { emoji: "🧑", name: "Fidessa Tam", message: "Enjoy!", time: "9:12 PM", unread: 1 },
  { emoji: "🧑", name: "Michelle Chen", message: "Good luck Tom!", time: "9:07 PM" },
  { emoji: "🧑", name: "Thomas Sanford", message: "I am ready for the hack!", time: "9:05 PM", unread: 1 },
  { emoji: "🧑", name: "Rivaldo Jay", message: "How are you?", time: "9:02 PM", unread: 1 },
  { emoji: "🧑", name: "Lionel Messi", message: "I think its fine.", time: "9:00 PM" }
];

function Community() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredChats = chats
  .filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase()) ||
    chat.message.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0; // keep original order otherwise
  });

  return (
    <div className="community-page-bg">
      <header className="community-header">
        <Back />
        <span className="community-title">Community</span>

      </header>

      {/* 🔍 Search Bar */}
      <div className="community-search-wrapper">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="community-search-input"
        />
        <button className="community-search-btn">Search</button>
      </div>

      {/* Chats */}
      <div className="community-chat-list">
        {filteredChats.map((chat) => (
          <div
            className="community-chat-item"
            key={chat.name}
            onClick={() => navigate('/chat')}
            style={{ cursor: 'pointer' }}
          >
            <div className="community-avatar-wrapper">
              <div className="community-avatar community-avatar-emoji">
                <span style={{ fontSize: '2rem' }}>{chat.emoji}</span>
              </div>
            </div>
            <div className="community-chat-info">
              <div className="community-chat-top">
                <span className="community-chat-name">{chat.name}</span>
                <div className="community-chat-meta">
                  {chat.pinned && (
                    <svg
                      className="community-pin"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 17v4m-4-12h8l-1 5H9l-1-5z" />
                      <path d="M15 3H9v2h6V3z" />
                    </svg>
                  )}
                  <span className="community-chat-time">{chat.time}</span>
                </div>
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

      <UserMenu />
    </div>
  );
}

export default Community;