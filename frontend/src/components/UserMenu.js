import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTasks,
  faTrophy,
  faGift,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import "./UserMenu.css";

const UserMenu = () => {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", icon: <FontAwesomeIcon icon={faHome} size="2x" />, path: "/HomePage" },
    { name: "Lesson", icon: <FontAwesomeIcon icon={faTasks} size="2x" />, path: "/LessonsLibrary" },
    { name: "Leaderboard", icon: <FontAwesomeIcon icon={faTrophy} size="2x" />, path: "/leaderboard" },
    { name: "Voucher", icon: <FontAwesomeIcon icon={faGift} size="2x" />, path: "/RedeemCoupon" },
    { name: "Community", icon: <FontAwesomeIcon icon={faComments} size="2x" />, path: "/Communication" }
  ];

  return (
    <nav className="user-footer-navbar">
      <ul>
        {menuItems.map(item => (
          <li
            key={item.id}
            className={active === item.id ? 'active' : ''}
            onClick={() => {
              setActive(item.name);
              navigate(item.path);
            }}
          >
            <span className="icon">{item.icon}</span>
            {/* <p>{item.name}</p> */}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default UserMenu;