import React from "react";
import PlusIcon from "../assets/plus.svg"; // plus.svg 경로 확인

function Header() {
  return (
    <header style={styles.header}>
      {/* 왼쪽 로고 글씨 */}
      <div style={styles.logo}>LOGO</div>

      {/* 오른쪽 플러스 SVG 버튼 */}
      <button style={styles.plusButton}>
        <img src={PlusIcon} alt="plus" style={styles.plusIcon} />
      </button>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",        // 피그마 기준
    padding: "10px 20px",
    width: "390px",
    height: "80px",
    flexShrink: 0,
    background: "var(--grey-white-hover, #FBFBFB)",
    boxSizing: "border-box",       // ✅ padding 포함 크기 계산
  },
  plusButton: {
    width: "40px",                  // 아이콘과 버튼 크기 맞춤
    height: "40px",
    padding: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    width: "40px",
    height: "40px",
  },
};

export default Header;
