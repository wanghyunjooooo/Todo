import React from "react";

function LogoutBox() {
  const handleLogout = () => {
    // ✅ 로컬스토리지 데이터 제거
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");

    // ✅ 세션 관련된 데이터도 혹시 있을 경우 제거
    sessionStorage.clear();

    // ✅ 알림
    alert("로그아웃 되었습니다.");

    // ✅ 로그인 페이지로 이동
    window.location.href = "/login";
  };

  return (
    <div
      onClick={handleLogout}
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
        marginTop: "20px",
        boxShadow: "0 0 4px rgba(0,0,0,0.05)",
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
          flexShrink: 0,
        }}
      >
        로그아웃
      </span>
    </div>
  );
}

export default LogoutBox;
