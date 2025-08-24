import React, { useState } from "react";
import "./AdminMenu.css";
import { useNavigate } from "react-router-dom";

const HomeIcon = ({ color = "#565D6D", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={size} height={size} fill={color}>
    <path d="M541 229.16 512 205.9V56c0-13.25-10.75-24-24-24H424c-13.25 0-24 10.75-24 
    24v24L314.65 10.3c-11.6-9.2-28.7-9.2-40.3 0L35 229.16c-10.2 8.1-11.9 
    22.9-3.7 33.1s22.9 11.9 33.1 3.7L96 243.5V456c0 30.9 25.1 56 56 
    56h272c30.9 0 56-25.1 56-56V243.5l31.6 22.5c10.2 8.2 24.9 6.4 
    33.1-3.7 8.2-10.2 6.5-24.9-3.8-33.14z"/>
  </svg>
);

const StudentsIcon = ({ color = "#565D6D", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={size} height={size} fill={color}>
    <path d="M622.3 271.1 343.4 457.5c-10.9 7.1-25 .7-25-12V310.2c0-14.6 
    8-28 20.9-34.9L512 192 339.3 108.7c-12.9-6.9-20.9-20.3-20.9-34.9V66.5c0-12.7 
    14.1-19.1 25-12l278.9 186.4c8.8 5.9 8.8 18.9 0 24.8zM192 96c53 0 96 
    43 96 96s-43 96-96 96-96-43-96-96 43-96 96-96zm0 
    224c61.9 0 192 31 192 96v32c0 17.7-14.3 32-32 
    32H32c-17.7 0-32-14.3-32-32v-32c0-65 130.1-96 192-96z"/>
  </svg>
);

const AssignmentsIcon = ({ color = "#565D6D", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={size} height={size} fill={color}>
    <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 
    24 24h336c13.3 0 24-10.7 24-24V160H248c-13.3 
    0-24-10.7-24-24zM96 280c0-4.4 3.6-8 8-8h176c4.4 
    0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H104c-4.4 
    0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h176c4.4 
    0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H104c-4.4 
    0-8-3.6-8-8v-16zm208-268.1V128h91.1L304 75.9z"/>
  </svg>
);

const ClassesIcon = ({ color = "#565D6D", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={size} height={size} fill={color}>
    <path d="M96 64C96 28.7 124.7 0 160 0h256c17.7 
    0 32 14.3 32 32v352c0 35.3-28.7 64-64 
    64H160c-35.3 0-64-28.7-64-64V64zM0 
    128c0-17.7 14.3-32 32-32h32v320c0 
    53 43 96 96 96h256c17.7 0 32-14.3 
    32-32s-14.3-32-32-32H160c-17.7 
    0-32-14.3-32-32V128H32c-17.7 
    0-32-14.3-32-32z"/>
  </svg>
);

const CommunicateIcon = ({ color = "#565D6D", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size} fill={color}>
    <path d="M256 32C114.6 32 0 125.1 0 
    240c0 46 19.6 88.3 52.6 121.7-8.1 
    29.8-22.6 56.4-41.6 78.2-6.9 
    7.8-8.7 19.2-4.6 28.9C10.5 
    478.6 18.9 484 28 484c61.9 
    0 109.6-25.8 138.8-46.3 28.5 
    8.5 59.4 13.3 91.2 13.3 
    141.4 0 256-93.1 256-208S397.4 
    32 256 32z"/>
  </svg>
);

const AdminMenu = ({ selectedTab = "Home" }) => {
  const [active, setActive] = useState(selectedTab);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", icon: <HomeIcon />, path: "/admin" },
    { name: "Students", icon: <StudentsIcon />, path: "/students" },
    { name: "Assignments", icon: <AssignmentsIcon />, path: "/assignments" },
    { name: "Classes", icon: <ClassesIcon />, path: "/classes" },
    { name: "Communicate", icon: <CommunicateIcon />, path: "/communicate" },
  ];

  const handleNavigation = (item) => {
    setActive(item.name);
    navigate(item.path);
  };

  return (
    <nav className="footer-navbar">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => handleNavigation(item)}
          >
            <span className="icon">{item.icon}</span>
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminMenu;