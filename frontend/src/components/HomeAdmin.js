import React from "react";
import "./HomeAdmin.css";
import { FaFileAlt } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { FaBullhorn } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";

const HomeAdmin = () => {
  return (
    <div className="HomeAdmin">
      {/* Navbar */}
      <nav className="navbar">
        <h2 class="title">Dashboard</h2>
        {/* <ul>
          <li className="active">Home</li>
          <li>Students</li>
          <li>Assignments</li>
          <li>Classes</li>
        </ul> */}
      </nav>

      {/* Overview Section */}
      <section className="overview">
        <h3>Overview</h3>
        <div className="cards">
          <div className="card">
            <p>Total Students</p>
            <h2>245</h2>
            <span className="tag new">+5 New</span>
          </div>
          <div className="card green">
            <p>Assignments Due Today</p>
            <h2>7</h2>
            <span className="tag overdue">2 Overdue</span>
          </div>
          <div className="card">
            <p>Pending Grades</p>
            <h2>32</h2>
            <span className="tag attention">Needs Attention</span>
          </div>
          <div className="card green">
            <p>Attendance Rate</p>
            <h2>92%</h2>
            <span className="tag consistent">Consistent</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions">
          <div className="action-card"><FaFileAlt></FaFileAlt> Create Assignment</div>
          <div className="action-card"><FaCalendarCheck></FaCalendarCheck> Mark Attendance</div>
          <div className="action-card"><FaBullhorn></FaBullhorn> Send Announcement</div>
        </div>
      </section>

      {/* Recent Alerts */}
      <section className="alerts">
        <h3>Recent Alerts</h3>
        <div className="alert-card">
          <div className="alert-header">
            <span className="alert-icon"><FaExclamationTriangle></FaExclamationTriangle></span>
            <span className="alert-title">Low Performing Student</span>
            <span className="time">10 min ago</span>
          </div>
          <p>
            Sarah Johnson’s Math scores have consistently dropped. Immediate
            intervention required.
          </p>
          <button className="profile-btn">View Student Profile</button>
        </div>
        <div className="alert-card">
          <div className="alert-header">
            <span className="alert-icon"><FaExclamationTriangle></FaExclamationTriangle></span>
            <span className="alert-title">Missing Assignment</span>
            <span className="time">10 min ago</span>
          </div>
          <p>
            Sarah Johnson’s Math scores have consistently dropped. Immediate
            intervention required.
          </p>
          <button className="profile-btn">View Student Profile</button>
        </div>
        <div className="alert-card">
          <div className="alert-header">
            <span className="alert-icon"><FaExclamationTriangle></FaExclamationTriangle></span>
            <span className="alert-title">Absenteeism Alert</span>
            <span className="time">10 min ago</span>
          </div>
          <p>
            Sarah Johnson’s Math scores have consistently dropped. Immediate
            intervention required.
          </p>
          <button className="profile-btn">View Student Profile</button>
        </div>

      </section>
      

      {/* Sticky Bottom Navbar */}
      <nav className="footer-navbar">
        <ul>
          <li className="active">
            <span className="icon">🏠</span>
            <p>Home</p>
          </li>
          <li>
            <span className="icon">👨‍🎓</span>
            <p>Students</p>
          </li>
          <li>
            <span className="icon">📄</span>
            <p>Assignments</p>
          </li>
          <li>
            <span className="icon">📘</span>
            <p>Classes</p>
          </li>
          <li>
            <span className="icon">💬</span>
            <p>Communicate</p>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomeAdmin;