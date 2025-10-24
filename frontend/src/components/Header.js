// Header.js
import React, { useState, useRef, useEffect } from "react";
import ThreeIcon from "../assets/three.svg";
import CategoryEditor from "./EditCategoryBox";

function Header() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false); // Editor 표시 여부
  const menuRef = useRef(null);
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });

  // ✅ “수정하기” 클릭 시 에디터 표시
  const handleEditCategoryClick = () => {
    setShowCategoryEditor(true); // 에디터 열기
    setShowPopup(false); // 팝업 닫기
  };

  // ❌ 기존 추가하기 클릭 시에는 아무것도 안 하도록 변경 (또는 나중에 추가 로직 연결)
  const handleAddCategoryClick = () => {
    alert("카테고리 추가 폼 열기 예정"); // 임시
  };

  const handleMenuClick = () => {
    setIsMenuActive(!isMenuActive);
    setShowPopup(!showPopup);
  };

  // 팝업 위치 계산
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const boxWidth = 135;
      let left = rect.left + 40; // 오른쪽 이동
      const screenWidth = window.innerWidth;
      if (left + boxWidth > screenWidth) left = screenWidth - boxWidth - 8;

      setBoxPosition({ top: rect.bottom + 4, left });
    }
  }, [showPopup]);

  return (
    <header style={styles.header}>
      <div style={styles.logo}>LOGO</div>

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
        <img src={ThreeIcon} alt="three dots" style={{ width: "100%", height: "100%" }} />
      </button>

      {/* 팝업 */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: boxPosition.top,
            left: boxPosition.left,
            width: "107px",
            padding: "8px 0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "16px",
            border: "1px solid var(--green-light-active, #C1E4CE)",
            background: "#FFF",
            zIndex: 1000,
          }}
        >
          <PopupButton text="카테고리 추가하기" onClick={handleAddCategoryClick} />
          <PopupButton text="카테고리 수정하기" onClick={handleEditCategoryClick} />
        </div>
      )}

      {/* ✅ 수정하기 누르면 뜨는 CategoryEditor */}
      {showCategoryEditor && (
        <CategoryEditor onClose={() => setShowCategoryEditor(false)} />
      )}
    </header>
  );
}

const PopupButton = ({ text, onClick }) => (
  <div
    onClick={onClick}
    style={{
      width: "100%",
      height: "35px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Pretendard, sans-serif",
      fontSize: "12px",
      fontWeight: 600,
      color: "#36A862",
      cursor: "pointer",
      background: "transparent",
      border: "none",
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
