import React from "react";
import "./HomeAdmin.css";
import AdminMenu from "./AdminMenu";
import { FaExclamationTriangle } from "react-icons/fa";

// Custom SVG Icons
const CreateAssignmentIcon = ({ color = "#4fa07f", size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={size} height={size} fill={color}>
    <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.3 0-24-10.7-24-24zM96 280c0-4.4 3.6-8 8-8h176c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H104c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h176c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H104c-4.4 0-8-3.6-8-8v-16zm208-268.1V128h91.1L304 75.9z"/>
  </svg>
);

const MarkAttendanceIcon = ({ color = "#4fa07f", size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={size} height={size} fill={color}>
    <path d="M128 0c17.7 0 32 14.3 32 32v32h128V32c0-17.7 14.3-32 32-32s32 14.3 32 
    32v32h32c35.3 0 64 28.7 64 64v288c0 35.3-28.7 64-64 
    64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 
    64h32V32c0-17.7 14.3-32 32-32zm180.4 228.7c7-11.2 
    3.6-26-7.6-33.1s-26-3.6-33.1 7.6l-61.4 98.3-27-36c-8-10.6-23-12.8-33.6-4.8s-12.8 
    23-4.8 33.6l48 64c4.7 6.3 12.3 9.9 20.2 9.6s15.1-4.5 
    19.3-11.3l80-128z"/>
  </svg>
);

const SendAnnouncementIcon = ({ color = "#4fa07f", size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size} fill={color}>
    <path d="M461.2 18.9C472.7 24 480 35.4 480 48v416c0 
    12.6-7.3 24-18.8 29.1s-24.8 3.2-34.3-5.1l-46.6-40.7c-43.6-38.1-98.7-60.3-156.4-63v95.7c0 
    17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-96C57.3 
    384 0 326.7 0 256s57.3-128 128-128h84.5c61.8-.2 121.4-22.7 
    167.9-63.3l46.6-40.7c9.4-8.3 22.9-10.2 34.3-5.1zM224 
    320v.2c70.3 2.7 137.8 28.5 192 
    73.4V118.3c-54.2 44.9-121.7 70.7-192 
    73.4V320z"/>
  </svg>
);


const HomeAdmin = () => {
  return (
    <div className="HomeAdmin">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="title">Dashboard</h2>
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
          <div className="action-card"><CreateAssignmentIcon /> <br></br> Create Assignment</div>
          <div className="action-card"><MarkAttendanceIcon /> <br></br> Mark Attendance</div>
          <div className="action-card"><SendAnnouncementIcon /> <br></br> Send Announcement</div>
        </div>
      </section>

      {/* Recent Alerts */}
      <section className="alerts">
        <h3>Recent Alerts</h3>
        <div className="alert-card">
          <div className="alert-header">
            <span className="alert-icon"><FaExclamationTriangle /></span>
            <span className="alert-title">Low Performing Student</span>
            <span className="time">10 min ago</span>
          </div>
          <p>Sarah Johnson’s Math scores have consistently dropped. Immediate intervention required.</p>
          <button className="profile-btn">View Student Profile</button>
        </div>
        <div className="alert-card">
          <div className="alert-header">
            <span className="alert-icon"><FaExclamationTriangle /></span>
            <span className="alert-title">Missing Assignment</span>
            <span className="time">10 min ago</span>
          </div>
          <p>5 students in Grade 7-A have not submitted their Science project.</p>
          <button className="profile-btn">Review Assignments</button>
        </div>
        <div className="alert-card">
          <div className="alert-header">
            <span className="alert-icon"><FaExclamationTriangle /></span>
            <span className="alert-title">Absenteeism Alert</span>
            <span className="time">10 min ago</span>
          </div>
          <p>Mark Davis has been absent for 3 consecutive days without notification.</p>
          <button className="profile-btn">Contact Parent</button>
        </div>
      </section>

      {/* Sticky Bottom Navbar */}
      <AdminMenu selectedTab="Home" />
    </div>
  );
};

export default HomeAdmin;