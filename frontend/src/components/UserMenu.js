import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTasks,
  faTrophy,
  faGift,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import "./UserMenu.css";

const menuItems = [
  { name: "Home", icon: <FontAwesomeIcon icon={faHome} size="2x" />, path: "/HomePage" },
  { name: "Lesson", icon: <FontAwesomeIcon icon={faTasks} size="2x" />, path: "/LessonsLibrary" },
  { name: "Leaderboard", icon: <FontAwesomeIcon icon={faTrophy} size="2x" />, path: "/leaderboard" },
  { name: "Voucher", icon: <FontAwesomeIcon icon={faGift} size="2x" />, path: "/RedeemCoupon" },
  { name: "Community", icon: <FontAwesomeIcon icon={faComments} size="2x" />, path: "/Communication" }
];

const UserMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find the menu item that matches the current path
  const activeMenu = menuItems.find(item => location.pathname.startsWith(item.path));
  const active = activeMenu ? activeMenu.name : "Home"; // fallback to Home

  return (
    <div className="user-footer-container">
    <nav className="user-footer-navbar">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => navigate(item.path)}
          >
            <span className="icon">{item.icon}</span>
            {/* <p>{item.name}</p> */}
          </li>
        ))}
      </ul>
    </nav>
    </div>
  );
};

export default UserMenu;