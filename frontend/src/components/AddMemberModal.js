import React, { useState } from "react";
import "./AddMemberModal.css";

const AddMemberModal = ({ isOpen, onClose, onSave }) => {
  const [role, setRole] = useState("Parent");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [classesResponsible, setClassesResponsible] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentDOB, setStudentDOB] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      role,
      fullName,
      phoneNumber,
      classesResponsible,
      studentDetails: role === "Parent" ? { name: studentName, dob: studentDOB } : null
    });
    
    // Reset form
    setRole("Parent");
    setFullName("");
    setPhoneNumber("");
    setClassesResponsible("");
    setStudentName("");
    setStudentDOB("");
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-time">9:41</div>
          <h2>Add New Member</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="role">Role <span className="required">*</span></label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
            >
              <option value="Parent">Parent</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name <span className="required">*</span></label>
            <input 
              type="text" 
              id="fullName" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name" 
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., +1 (555) 123-4567" 
              className="form-control"
            />
          </div>

          {role === "Teacher" ? (
            <div className="form-group">
              <label htmlFor="classesResponsible">Classes Responsible</label>
              <select
                id="classesResponsible"
                value={classesResponsible}
                onChange={(e) => setClassesResponsible(e.target.value)}
                className="form-control"
              >
                <option value="">Select a class</option>
                <option value="K1-C1">K1-C1</option>
                <option value="K2-C2">K2-C2</option>
              </select>
            </div>
          ) : (
            <div className="student-details">
              <h3>Student Details</h3>
              
              <div className="form-group">
                <label htmlFor="studentName">Student Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="studentName" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name" 
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="studentDOB">Student's Date of Birth <span className="required">*</span></label>
                <input 
                  type="date" 
                  id="studentDOB" 
                  value={studentDOB}
                  onChange={(e) => setStudentDOB(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save Member</button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
