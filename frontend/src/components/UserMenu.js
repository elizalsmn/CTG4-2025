import React, { useState} from "react";
import "./UserMenu.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const HomeIcon = ({ color = "#565D6D", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={size} height={size} fill={color}>
    <path d="M541 229.16 512 205.9V56c0-13.25-10.75-24-24-24H424c-13.25 0-24 10.75-24 
    24v24L314.65 10.3c-11.6-9.2-28.7-9.2-40.3 0L35 229.16c-10.2 8.1-11.9 
    22.9-3.7 33.1s22.9 11.9 33.1 3.7L96 243.5V456c0 30.9 25.1 56 56 
    56h272c30.9 0 56-25.1 56-56V243.5l31.6 22.5c10.2 8.2 24.9 6.4 
    33.1-3.7 8.2-10.2 6.5-24.9-3.8-33.14z"/>
  </svg>

);

const LeaderboardIcon = ({ color = "#565D6D", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={size} height={size} fill={color}>
    <path d="M552 64H424V24c0-13.3-10.7-24-24-24H176c-13.3 0-24 
    10.7-24 24V64H24C10.7 64 0 74.7 0 88v56c0 60.6 38.9 112 
    93.3 131.8C111.4 356.9 164.9 406.7 232 414.4V464H160c-17.7 
    0-32 14.3-32 32s14.3 32 32 32h256c17.7 0 32-14.3 
    32-32s-14.3-32-32-32h-72v-49.6c67.1-7.7 120.6-57.5 
    138.7-138.6C537.1 256 576 204.6 576 144V88c0-13.3-10.7-24-24-24zM48 
    144v-40h104v119.1c0 24.6 4.6 47.6 13 68.9C104.4 282.5 
    48 219.9 48 144zm480 0c0 75.9-56.3 138.5-117 
    147.9 8.4-21.3 13-44.3 13-68.9V104h104v40z"/>
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


  const VoucherIcon = ({ color = "#565D6D", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={size} height={size} fill={color}>
    <path d="M0 128C0 92.7 28.7 64 64 64H512c35.3 0 64 28.7 64 
    64v256c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zm128 
    0a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0 192a32 32 0 1 0 0 64 
    32 32 0 1 0 0-64zm224-96c0-17.7-14.3-32-32-32H256c-17.7 
    0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 32-14.3 
    32-32zm0 96c0-17.7-14.3-32-32-32H256c-17.7 
    0-32 14.3-32 32s14.3 32 32 32h64c17.7 0 
    32-14.3 32-32z"/>
  </svg>
);

const UserMenu = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('home');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', tKey: 'menu_home', icon: <HomeIcon />, path: '/HomePage' },
    { id: 'assignments', tKey: 'menu_assignments', icon: <AssignmentsIcon />, path: '/LessonsLibrary' },
    { id: 'leaderboard', tKey: 'menu_leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
    { id: 'voucher', tKey: 'menu_voucher', icon: <VoucherIcon />, path: '/RedeemCoupon' },
    { id: 'communicate', tKey: 'menu_communicate', icon: <CommunicateIcon />, path: '/Communication' }
  ];

  return (
    <nav className="user-footer-navbar">
      <ul>
        {menuItems.map(item => (
          <li
            key={item.id}
            className={active === item.id ? 'active' : ''}
            onClick={() => {
              setActive(item.id);
              navigate(item.path);
            }}
          >
            <span className="icon">{item.icon}</span>
            <p>{t(item.tKey)}</p>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default UserMenu;
