import React, { useState } from "react";
import LogoIcon from "../assets/logo.svg"; // 로고
import SearchIcon from "../assets/search.svg"; // 검색 아이콘
import BellIcon from "../assets/bell.svg"; // 종 아이콘
import SidebarIcon from "../assets/sidebar.svg"; // 사이드바 아이콘

function Header() {
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
                <IconButton src={BellIcon} alt="알림" />
                <IconButton src={SidebarIcon} alt="사이드바" />
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
                objectFit: "contain", // 비율 유지하며 꽉 채움
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
        gap: "16px", // 아이콘 사이 간격
        alignItems: "center",
    },
};

export default Header;
