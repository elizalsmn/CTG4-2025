import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {  FaCrown } from 'react-icons/fa';
import './Leaderboard.css';
import AvatarPlaceholder from '../assets/avatar-placeholder.jpg';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Back from "./Back"
import UserMenu from "./UserMenu";

function Leaderboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackData = [
    { id: 1, name: "Bryan Wolf", points: 43, avatar: AvatarPlaceholder },
    { id: 2, name: "Meghan Jes", points: 40, avatar: AvatarPlaceholder },
    { id: 3, name: "Alex Turner", points: 38, avatar: AvatarPlaceholder },
    { id: 4, name: "Marsha Fisher", points: 36, avatar: AvatarPlaceholder },
    { id: 5, name: "Juanita Cormier", points: 35, avatar: AvatarPlaceholder },
    { id: 6, name: "You", points: 34, avatar: AvatarPlaceholder },
    { id: 7, name: "Tamara Schmidt", points: 33, avatar: AvatarPlaceholder },
    { id: 8, name: "Ricardo Veum", points: 32, avatar: AvatarPlaceholder },
    { id: 9, name: "Gary Sanford", points: 31, avatar: AvatarPlaceholder },
    { id: 10, name: "Becky Bartell", points: 30, avatar: AvatarPlaceholder }
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/app/top_leaderboard/');
        // Add hardcoded avatar to API response and map child_name to name
        const dataWithAvatar = response.data.results.map((user, index) => ({
          ...user,
          id: user.parent_user_id || index,
          name: user.child_name,
          avatar: AvatarPlaceholder
        }));
        setLeaderboardData(dataWithAvatar);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
        // Fallback to hardcoded data if API fails
        setLeaderboardData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) console.warn(error);

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <Back />
      <div className="leaderboard-header">
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
          <div className="points">{t('points_suffix', { count: leaderboardData[1].points })}</div>
        </div>

        {/* First Place */}
        <div className="podium-item first">
          <FaCrown className="crown" />
          <div className="podium-circle">
            <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} />
          </div>
          <div className="position-number">1</div>
          <div className="name">{leaderboardData[0].name}</div>
          <div className="points">{t('points_suffix', { count: leaderboardData[0].points })}</div>
        </div>

        {/* Third Place */}
        <div className="podium-item third">
          <div className="podium-circle">
            <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} />
          </div>
          <div className="position-number">3</div>
          <div className="name">{leaderboardData[2].name}</div>
          <div className="points">{t('points_suffix', { count: leaderboardData[2].points })}</div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-list">
        {leaderboardData.slice(3).map((user, index) => (
          <div 
            key={user.id || index} 
            className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''}`}
          >
            <div className="rank">{index + 4}</div>
            <div className="user-info">
              <img src={user.avatar} alt={user.name} className="avatar" />
              <span className="name">{user.name}</span>
            </div>
            <div className="points">{t('points_suffix', { count: user.points })}</div>
          </div>
        ))}
      </div>

      {/* Redeem Button */}
      <button 
          className="redeem-button" 
          onClick={() => {
            const myData = leaderboardData.find(user => user.name === "You");
            const myPoints = myData ? myData.points : 0;
            navigate("/Milestone", { state: { points: myPoints } });
          }}
        >
          View Milestones
        </button>

      <UserMenu />
    </div>
  );
}

export default Leaderboard;