// GroupChat.js for "My Community" group
import React, { useState, useEffect, useRef } from "react";
import Back from "./Back";
import "./Chat.css";

// Community group chat messages
const communityMessages = [
  { from: "David", emoji: "👨", text: "I'm heading to the school now for pickup", time: "9:15 PM" },
  { from: "Sarah", emoji: "👩", text: "I'm already here, parked near the front entrance", time: "9:18 PM" },
  { from: "Mike", emoji: "👨", text: "Traffic is heavy on Main Street, might be a few minutes late", time: "9:20 PM" },
  { from: "Jennifer", emoji: "👩", text: "The art exhibition in the hall looks amazing!", time: "9:22 PM" },
  { from: "Carlos", emoji: "👨", text: "Just arrived. Where is everyone meeting?", time: "9:25 PM" },
  { from: "Lisa", emoji: "👩", text: "We're gathered by the main office", time: "9:26 PM" },
  { from: "Emily", emoji: "👩", text: "I see you all, coming over now", time: "9:28 PM" },
  { from: "Mark", emoji: "👨", text: "We are on our way!", time: "9:32 PM" },
];

function GroupChat({ chatData }) {
  const [messages, setMessages] = useState(communityMessages);
  const [newMessage, setNewMessage] = useState("");
  const messageListRef = useRef(null);

  // Scroll to bottom of messages when component mounts or messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to handle sending new messages
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        from: "You",
        emoji: "👤",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  // Handle pressing Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page-bg">
      {/* Header */}
      <header className="chat-header">
        <Back to="/community" />

        <div className="chat-header-profile">
          <div className="chat-avatar">{chatData.emoji || "🧑‍🤝‍🧑"}</div>
          <div className="chat-header-info">
            <span className="chat-header-name">{chatData.name || "My Community"}</span>
            <span className="chat-header-status">8 members</span>
          </div>
        </div>

        <button className="chat-menu-btn" aria-label="Menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </header>

      {/* Messages */}
      <div className="chat-message-list" ref={messageListRef}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={msg.from === "You" ? "chat-message chat-message-me" : "chat-message chat-message-other"}
          >
            <div className="chat-message-bubble">
              {msg.from !== "You" && (
                <span className="chat-sender">
                  {msg.emoji} {msg.from}
                </span>
              )}
              <span className="chat-message-text">{msg.text}</span>
              <span className="chat-message-time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <input 
          className="chat-input" 
          placeholder="Type a message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="chat-send-btn" 
          onClick={handleSendMessage}
          disabled={newMessage.trim() === ""}
        >
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

export default GroupChat;