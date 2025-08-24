import React, { useState } from "react";
import "./AddMemberModal.css";
import axios from "axios";

const AddMemberModal = ({ isOpen, onClose, onSave }) => {
  // Teacher fields
  const [role, setRole] = useState("parent");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [className, setClassName] = useState("");
  
  // Parent/Child fields
  const [childName, setChildName] = useState("");
  const [childDOB, setChildDOB] = useState("");
  const [childClass, setChildClass] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    let userData;
    
    if (role === "teacher") {
      userData = {
        role: "teacher",
        username,
        password,
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        class_name: className
      };
    } else {
      userData = {
        role: "parent",
        child: {
          name: childName,
          date_of_birth: childDOB,
          class_name: childClass
        }
      };
    }
    
    try {
      // Send data to backend API
      const response = await axios.post('http://localhost:8000/app/create_user/', userData);
      console.log('User created successfully:', response.data);
      
      // Call onSave with the response data
      onSave(response.data);
      
      // Reset form
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };
  
  const resetForm = () => {
    setRole("parent");
    setUsername("");
    setPassword("");
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setClassName("");
    setChildName("");
    setChildDOB("");
    setChildClass("");
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
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {role === "teacher" ? (
            <>
              <div className="form-group">
                <label htmlFor="username">Username <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username" 
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" 
                  className="form-control"
                  required
                />
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
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address" 
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 555-123-4567" 
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="className">Class Name <span className="required">*</span></label>
                <select
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select a class</option>
                  <option value="K1-C1">K1-C1</option>
                  <option value="K2-C2">K2-C2</option>
                  <option value="3-A">3-A</option>
                </select>
              </div>
            </>
          ) : (
            <div className="student-details">
              <h3>Child Details</h3>
              
              <div className="form-group">
                <label htmlFor="childName">Child's Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="childName" 
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child's name" 
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="childDOB">Child's Date of Birth <span className="required">*</span></label>
                <input 
                  type="date" 
                  id="childDOB" 
                  value={childDOB}
                  onChange={(e) => setChildDOB(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="childClass">Child's Class <span className="required">*</span></label>
                <select
                  id="childClass"
                  value={childClass}
                  onChange={(e) => setChildClass(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select a class</option>
                  <option value="K1-C1">K1-C1</option>
                  <option value="K2-C2">K2-C2</option>
                  <option value="10-A">10-A</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn-add-member" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save Member</button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
