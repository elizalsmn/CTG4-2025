// Community.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scanner } from '@yudiel/react-qr-scanner';
import { FaQrcode } from "react-icons/fa";
import "./Community.css";
import Back from "./Back";

function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const [camError, setCamError] = useState(null);
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (!result) return;
    setShowCamera(false);
    setCamError(null);
    // You can add more logic here if needed
  };

  const handleError = (err) => {
    setCamError('Camera error: ' + err);
  };

  const openCamera = async () => {
    setCamError(null);
    setCamLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      setShowCamera(true);
    } catch (e) {
      setCamError('Camera error: ' + e.name);
    } finally {
      setCamLoading(false);
    }
  };
  
  // Using your provided chat list
  const chats = [
    { id: 1, emoji: "🧑‍🤝‍🧑", name: "My Community", lastMessage: "We are on our way!", time: "9:32 PM", unread: 2, pinned: true, isGroup: true },
    { id: 2, emoji: "🏫", name: "My Kindergarden", lastMessage: "Enjoy your night!!", time: "9:29 PM", unread: 3, pinned: true, isGroup: true },
    { id: 3, emoji: "🧑", name: "Teacher Ling", lastMessage: "Butterfly is an insect.", time: "9:18 PM", unread: 1, status: "online" },
    { id: 4, emoji: "🧑", name: "Jackson Wang", lastMessage: "What do you think?", time: "9:11 PM", unread: 2, status: "online" },
    { id: 5, emoji: "🧑", name: "Fidessa Tam", lastMessage: "Enjoy!", time: "9:12 PM", unread: 1, status: "offline" },
    { id: 6, emoji: "🧑", name: "Michelle Chen", lastMessage: "Good luck Tom!", time: "9:07 PM", unread: 0, status: "online" },
    { id: 7, emoji: "🧑", name: "Thomas Sanford", lastMessage: "I am ready for the hack!", time: "9:05 PM", unread: 1, status: "offline" },
    { id: 8, emoji: "🧑", name: "Rivaldo Jay", lastMessage: "How are you?", time: "9:02 PM", unread: 1, status: "online" },
    { id: 9, emoji: "🧑", name: "Lionel Messi", lastMessage: "I think its fine.", time: "9:00 PM", unread: 0, status: "offline" }
  ];

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="community-page-bg">
      {/* Header */}
      <header className="community-header">
        <Back to="/homePage" top="36px" />
        <h1 className="community-title">Community</h1>
        <button className="community-qr-btn" aria-label="QR Scanner" onClick={openCamera}>
          <FaQrcode size={28} />
        </button>
      </header>

      {showCamera && (
        <div style={{
          width: '100vw',
          height: '100vh',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999
        }}>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%', maxWidth: 500 }}
          />
          <button
            onClick={() => {
              setShowCamera(false);
              setCamError(null);
            }}
            style={{
              marginTop: 20,
              padding: '12px 28px',
              background: '#6b9b7a',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          {camError && <div style={{ color: 'red', marginTop: 10 }}>{camError}</div>}
        </div>
      )}

      {/* Search */}
      <div className="community-search-wrapper">
        <input
          type="text"
          className="community-search-input"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="community-search-btn">Search</button>
      </div>

      {/* Chat List */}
      <div className="community-chat-list">
        {filteredChats.map((chat) => (
          <Link
            to="/chat"
            state={chat}
            key={chat.id}
            className="community-chat-item"
          >
            <div className="community-avatar community-avatar-emoji">
              {chat.emoji}
            </div>
            <div className="community-chat-info">
              <div className="community-chat-top">
                <span className="community-chat-name">{chat.name}</span>
                <span className="community-chat-time">{chat.time}</span>
              </div>
              <div className="community-chat-bottom">
                <span className="community-chat-message">{chat.lastMessage}</span>
                <div className="community-chat-meta">
                  {chat.pinned && (
                    <svg className="community-pin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 17v5" />
                      <path d="M5 9h14l-3 8H8L5 9z" />
                      <path d="M9 4h6v5H9z" />
                    </svg>
                  )}
                  {chat.unread > 0 && (
                    <span className="community-chat-unread">{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Community;
