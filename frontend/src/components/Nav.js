import React from "react";
import { Link, useLocation } from "react-router-dom";
import CheckIcon from "../assets/check.svg";
import BellIcon from "../assets/bell.svg";
import UserIcon from "../assets/user.svg";

function SvgIcon({ src, isActive, width = 37, height = 37 }) {
  return (
    <img
      src={src}
      alt=""
      style={{
        width,
        height,
        marginBottom: 4,
        filter: isActive
          ? "invert(46%) sepia(67%) saturate(447%) hue-rotate(92deg) brightness(90%) contrast(87%)"
          : "invert(35%) sepia(0%) saturate(0%) hue-rotate(340deg) brightness(93%) contrast(86%)",
      }}
    />
  );
}

function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: CheckIcon, label: "할 일" },
    { to: "/notifications", icon: BellIcon, label: "알림" },
    { to: "/profile", icon: UserIcon, label: "내 정보" },
  ];

  return (
    <nav
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#fff",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "60px",
        boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
        zIndex: 10,
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textDecoration: "none",
            color: location.pathname === item.to ? "#36A862" : "#595959",
          }}
        >
          <SvgIcon src={item.icon} isActive={location.pathname === item.to} />
        </Link>
      ))}
    </nav>
  );
}

export default BottomNav;
