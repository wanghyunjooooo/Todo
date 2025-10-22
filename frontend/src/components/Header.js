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
    alignItems: "center",
    padding: "0 16px",
    height: "60px",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000", // 로고 글씨 색깔 검정
  },
  plusButton: {
    width: "48px",       // 버튼 크기 조금 키움
    height: "48px",
    padding: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    width: "28px",       // 아이콘 크기 키움
    height: "28px",
    filter: "invert(34%) sepia(0%) saturate(0%) hue-rotate(342deg) brightness(92%) contrast(85%)", // #595959 색상
  },
};

export default Header;
