import React, { useState } from "react";
import "./ClassesPage.css";
import AdminMenu from "./AdminMenu";
import AddMemberModal from "./AddMemberModal";
import RegistrationType from "./RegistrationType";
import { useNavigate } from "react-router-dom";

// Icons
const PeopleIcon = ({ color = "#4fa07f", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={size} height={size} fill={color}>
    <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"/>
  </svg>
);

const AttendanceIcon = ({ color = "#4fa07f", size = 20 }) => (
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

const ClassesPage = () => {
  const [isRegistrationTypeOpen, setIsRegistrationTypeOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  // Mock data for classes
  const classes = [
    { id: 1, name: "K1-C1", students: 25 },
    { id: 2, name: "K2-C1", students: 22 },
    { id: 3, name: "K3-C1", students: 28 },
  ];

  const handleAddMember = (memberData) => {
    setMembers([...members, memberData]);
    console.log("New member added:", memberData);
    // Here you would typically send this data to your backend
  };

  const handleNavigateToNewAssignment = () => {
    navigate("/new-assignment");
  };
  
  const handleRegistrationTypeSelect = (type) => {
    setIsRegistrationTypeOpen(false);
    
    if (type === "individual") {
      setIsAddMemberModalOpen(true);
    } else {
      // For batch registration - just show an alert for now
      alert("Batch registration feature is coming soon!");
    }
  };

  return (
    <div className="classes-page">
      {/* Header */}
      <header className="classes-header">
        <h1>Class Management</h1>
      </header>

      {/* Class List Section */}
      <section className="class-list-section">
        <div className="classes-heading">
          <h2>Kindergarten Classes</h2>
          <button 
            className="add-member-btn"
            onClick={() => setIsRegistrationTypeOpen(true)}
          >
            <span>+</span> Add Member
          </button>
        </div>

        {/* Class Cards */}
        <div className="class-cards">
          {classes.map((classItem) => (
            <div key={classItem.id} className="class-card">
              <div className="class-info">
                <h3>{classItem.name}</h3>
                <p>{classItem.students} Students</p>
              </div>
              <div className="class-actions">
                <div style={{ display: 'flex', gap: '15px', flexGrow: 1 }}>
                  <button 
                    className="action-btn" 
                    onClick={handleNavigateToNewAssignment}
                  >
                    <PeopleIcon /> 
                    <span>New Assignment</span>
                  </button>
                  <button className="action-btn attendance-btn" onClick={() => {}}>
                    <AttendanceIcon /> 
                    <span>Mark Attendance</span>
                  </button>
                </div>
                <button className="options-btn">⋮</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Type Selection Modal */}
      <RegistrationType
        onSelectType={handleRegistrationTypeSelect}
        onClose={() => setIsRegistrationTypeOpen(false)}
        isOpen={isRegistrationTypeOpen}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onSave={handleAddMember}
      />

      {/* Admin Menu (with Classes selected) */}
      <AdminMenu selectedTab="Classes" />
    </div>
  );
};

export default ClassesPage;
