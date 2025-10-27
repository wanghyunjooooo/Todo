import React from "react";

function LogoutBox({ onLogout }) {
  return (
    <div
      onClick={onLogout}
      style={{
        display: "flex",
        width: "350px",
        height: "56px",
        padding: "8px 20px",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        borderRadius: "16px",
        background: "var(--Grey-White, #FFF)",
        cursor: "pointer",
        marginTop: "20px"
      }}
    >
      <span
        style={{
          color: "var(--Red, #FD5344)",
          fontFamily: "Pretendard",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
          width: "310px",
          flexShrink: 0
        }}
      >
        로그아웃
      </span>
    </div>
  );
}

export default LogoutBox;
