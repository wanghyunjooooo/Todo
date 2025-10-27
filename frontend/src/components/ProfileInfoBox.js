import React from "react";
import { useNavigate } from "react-router-dom"; // React Router hook
import ArrowIcon from "../assets/icon-arrow-right.svg";

function ProfileHeaderBox() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/edit-profile"); // 클릭 시 이동할 경로
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        width: "350px",
        height: "56px",
        padding: "8px 20px",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        marginBottom: "12px",
        cursor: "pointer" // 클릭 가능한 느낌
      }}
    >
      <span
        style={{
          color: "var(--Grey-Darker, #2A2A2A)",
          fontFamily: "Pretendard",
          fontSize: "12px",
          fontWeight: 600
        }}
      >
        회원정보 수정
      </span>
      <img
        src={ArrowIcon}
        alt="arrow"
        style={{
          width: "40px",
          height: "40px",
          transform: "rotate(0deg)", // 오른쪽 향하도록
          flexShrink: 0,
          aspectRatio: "1/1"
        }}
      />
    </div>
  );
}

export default ProfileHeaderBox;
