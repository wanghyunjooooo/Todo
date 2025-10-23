// Header.js
import React, { useState, useRef, useEffect } from "react";
import ThreeIcon from "../assets/three.svg"; // three.svg 불러오기

function Header() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const menuRef = useRef(null);
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });

  const handleMenuClick = () => {
    setIsMenuActive(!isMenuActive);
    setShowPopup(!showPopup);
  };

  const handleAddCategoryClick = () => {
    alert("카테고리 추가 폼 열기");
  };

  const handleEditCategoryClick = () => {
    alert("카테고리 수정 폼 열기");
  };

  // 점 3개 버튼 기준으로 팝업 위치 계산
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const boxWidth = 150;
      const screenWidth = window.innerWidth;

      let left = rect.left;
      if (rect.left + boxWidth > screenWidth) {
        left = screenWidth - boxWidth - 8;
      }

      setBoxPosition({
        top: rect.bottom + 4,
        left,
      });
    }
  }, [showPopup]);

  return (
    <header style={styles.header}>
      <div style={styles.logo}>LOGO</div>

      {/* 점 3개 버튼 */}
      <button
        ref={menuRef}
        style={{
          ...styles.menuButton,
          filter: isMenuActive
            ? "invert(46%) sepia(67%) saturate(447%) hue-rotate(92deg) brightness(90%) contrast(87%)"
            : "invert(0%)",
        }}
        onClick={handleMenuClick}
      >
        <img
          src={ThreeIcon}
          alt="three dots"
          style={{ width: "100%", height: "100%" }}
        />
      </button>

      {/* 팝업 */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: boxPosition.top,
            left: boxPosition.left,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <PopupButton text="카테고리 추가하기" onClick={handleAddCategoryClick} />
          <PopupButton text="카테고리 수정하기" onClick={handleEditCategoryClick} />
        </div>
      )}
    </header>
  );
}

// 팝업 버튼 컴포넌트
const PopupButton = ({ text, onClick }) => (
  <div
    onClick={onClick}
    style={{
      height: "40px",
      minWidth: "90px",
      padding: "0 10px",
      borderRadius: "16px",
      border: "1px solid var(--green-light-active, #C1E4CE)",
      backgroundColor: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Pretendard, sans-serif",
      fontSize: "12px",
      fontWeight: 600,
      color: "#36A862",
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: "10px 20px",
    width: "390px",
    height: "80px",
    background: "#FBFBFB",
    boxSizing: "border-box",
    position: "relative",
  },
  logo: { fontSize: "16px", fontWeight: "600" },
  menuButton: {
    width: "40px",
    height: "40px",
    aspectRatio: "1 / 1",
    padding: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Header;
