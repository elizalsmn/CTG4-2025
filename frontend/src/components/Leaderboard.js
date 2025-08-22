import React from 'react';
import { FaArrowLeft, FaCrown } from 'react-icons/fa';
import './Leaderboard.css';
import AvatarPlaceholder from '../assets/avatar-placeholder.jpg';

function Leaderboard() {
  const leaderboardData = [
    { id: 1, name: "Bryan Wolf", points: 43, avatar: AvatarPlaceholder },
    { id: 2, name: "Meghan Jes...", points: 40, avatar: AvatarPlaceholder },
    { id: 3, name: "Alex Turner", points: 38, avatar: AvatarPlaceholder },
    { id: 4, name: "Marsha Fisher", points: 36, avatar: AvatarPlaceholder },
    { id: 5, name: "Juanita Cormier", points: 35, avatar: AvatarPlaceholder },
    { id: 6, name: "You", points: 34, avatar: AvatarPlaceholder },
    { id: 7, name: "Tamara Schmidt", points: 33, avatar: AvatarPlaceholder },
    { id: 8, name: "Ricardo Veum", points: 32, avatar: AvatarPlaceholder },
    { id: 9, name: "Gary Sanford", points: 31, avatar: AvatarPlaceholder },
    { id: 10, name: "Becky Bartell", points: 30, avatar: AvatarPlaceholder }
  ];

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <div className="leaderboard-header">
        <FaArrowLeft className="back-arrow" />
        <h1>School Leaderboard</h1>
      </div>

      {/* Top 3 Podium */}
      <div className="podium">
        {/* Second Place */}
        <div className="podium-item second">
          <div className="podium-circle">
            <img src={leaderboardData[1].avatar} alt={leaderboardData[1].name} />
          </div>
          <div className="position-number">2</div>
          <div className="name">{leaderboardData[1].name}</div>
          <div className="points">{leaderboardData[1].points} pts</div>
        </div>

        {/* First Place */}
        <div className="podium-item first">
          <FaCrown className="crown" />
          <div className="podium-circle">
            <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} />
          </div>
          <div className="position-number">1</div>
          <div className="name">{leaderboardData[0].name}</div>
          <div className="points">{leaderboardData[0].points} pts</div>
        </div>

        {/* Third Place */}
        <div className="podium-item third">
          <div className="podium-circle">
            <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} />
          </div>
          <div className="position-number">3</div>
          <div className="name">{leaderboardData[2].name}</div>
          <div className="points">{leaderboardData[2].points} pts</div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-list">
        {leaderboardData.slice(3).map((user, index) => (
          <div 
            key={user.id} 
            className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''}`}
          >
            <div className="rank">{index + 4}</div>
            <div className="user-info">
              <img src={user.avatar} alt={user.name} className="avatar" />
              <span className="name">{user.name}</span>
            </div>
            <div className="points">{user.points} pts</div>
          </div>
        ))}
      </div>

      {/* Redeem Button */}
      <button className="redeem-button">
        Redeem your Points
      </button>
    </div>
  );
}

export default Leaderboard;