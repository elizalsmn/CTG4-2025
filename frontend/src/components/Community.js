import React from 'react';
import './Community.css';

const communities = [
  {
    name: 'My Community',
    message: 'We are all Our kids!',
    time: '9:32 PM',
    icon: '🌸',
    unread: 3,
  },
  {
    name: 'My Kindergarten',
    message: 'Enjoy your night!',
    time: '9:29 PM',
    icon: '🏫',
    unread: 1,
  },
  {
    name: 'Teacher Ling',
    message: 'Definitely my mission',
    time: '9:18 PM',
    icon: '🧑‍🏫',
    unread: 2,
  },
  {
    name: 'Jackson Wang',
    message: 'What do you think?',
    time: '9:11 PM',
    icon: '🧑',
    unread: 0,
  },
  {
    name: 'Firdessa Tam',
    message: '',
    time: '9:12 PM',
    icon: '🧑',
    unread: 0,
  },
  {
    name: 'Michelle Chen',
    message: 'Good luck Mom',
    time: '9:07 PM',
    icon: '🧑',
    unread: 0,
  },
  {
    name: 'Thomas Sanford',
    message: 'I am ready for the hack!',
    time: '9:05 PM',
    icon: '🧑',
    unread: 0,
  },
  {
    name: 'Rivaldo Jay',
    message: 'Hey are we...',
    time: '9:02 PM',
    icon: '🧑',
    unread: 0,
  },
];

function Community() {
  return (
    <div className="community-container">
      <div className="community-header">
        <span className="community-back">←</span>
        <span className="community-title">Community</span>
        <span className="community-menu">≡</span>
      </div>
      <div className="community-list">
        {communities.map((c, idx) => (
          <div className="community-item" key={idx}>
            <div className="community-icon">{c.icon}</div>
            <div className="community-info">
              <div className="community-name-time">
                <span className="community-name">{c.name}</span>
                <span className="community-time">{c.time}</span>
              </div>
              <div className="community-message">{c.message}</div>
            </div>
            {c.unread > 0 && (
              <div className="community-unread">{c.unread}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
