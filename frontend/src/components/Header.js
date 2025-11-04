import React from "react";
import { useNavigate } from "react-router-dom"; // React Router v6 기준
import LogoIcon from "../assets/logo.svg";
import SearchIcon from "../assets/search.svg";
import BellIcon from "../assets/bell.svg";
import SidebarIcon from "../assets/sidebar.svg";

function Header({ onSidebarToggle }) {
    const navigate = useNavigate();

    const handleNotificationClick = () => {
        navigate("/notifications"); // Notification 페이지로 이동
    };

    return (
        <header style={styles.header}>
            {/* 로고 */}
            <div style={styles.logo}>
                <img
                    src={LogoIcon}
                    alt="Logo"
                    style={{ width: "40px", height: "40px" }}
                />
            </div>

            {/* 오른쪽 아이콘 3개 */}
            <div style={styles.iconGroup}>
                <IconButton src={SearchIcon} alt="검색" />

                {/* 알람 아이콘 클릭 시 Notification 페이지 이동 */}
                <IconButton
                    src={BellIcon}
                    alt="알림"
                    onClick={handleNotificationClick}
                />

                {/* 사이드바 버튼 클릭 시 onSidebarToggle 호출 */}
                <IconButton
                    src={SidebarIcon}
                    alt="사이드바"
                    onClick={onSidebarToggle}
                />
            </div>
        </header>
    );
}

const IconButton = ({ src, alt, onClick }) => (
    <button
        onClick={onClick}
        style={{
            width: "23px",
            height: "23px",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <img
            src={src}
            alt={alt}
            style={{
                width: "23px",
                height: "23px",
                objectFit: "contain",
            }}
        />
    </button>
);

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        width: "100%",
        height: "80px",
        background: "#FBFBFB",
        boxSizing: "border-box",
    },
    logo: { display: "flex", alignItems: "center" },
    iconGroup: {
        display: "flex",
        gap: "16px",
        alignItems: "center",
    },
};

export default Header;
