import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome back, let's learn!</h1>
      </header>
      
      <div className="content-container">
        {/* Attendance Section */}
        <div className="info-card">
          <h2>Attendance</h2>
          <div className="card-content">
            <p>Current attendance: 85%</p>
            <p>Classes attended: 17/20</p>
          </div>
        </div>

        {/* Submission Section */}
        <div className="info-card">
          <h2>Submission</h2>
          <div className="card-content">
            <p>Assignments submitted: 8/10</p>
            <p>Pending submissions: 2</p>
          </div>
        </div>

        {/* Grade Section */}
        <div className="info-card">
          <h2>Grade</h2>
          <div className="card-content">
            <p>Current GPA: 3.7/4.0</p>
            <p>Overall percentage: 87%</p>
          </div>
        </div>

        {/* Assigned Task Section */}
        <div className="info-card">
          <h2>Assigned Task</h2>
          <div className="card-content">
            <div className="task-item">
              <p><strong>Math Assignment 5</strong></p>
              <p>Due: Aug 25, 2025</p>
              <span className="status pending">Pending</span>
            </div>
            <div className="task-item">
              <p><strong>Science Lab Report</strong></p>
              <p>Due: Aug 27, 2025</p>
              <span className="status pending">Pending</span>
            </div>
          </div>
        </div>

        {/* Quick Menu Section */}
        <div className="quick-menu">
          <h2>Quick Menu</h2>
          <div className="menu-buttons">
            <button className="menu-btn community" onClick={() => console.log('Community clicked')}>
              <span>Community</span>
            </button>
            <button className="menu-btn coupons" onClick={() => console.log('Coupons clicked')}>
              <span>Coupons</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
