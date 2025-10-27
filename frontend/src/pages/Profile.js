import React, { useState } from "react";
import Header from "../components/Header";
import ProfileInfoBox from "../components/ProfileInfoBox";
import ProgressBar from "../components/ProgressBar";
import BottomNav from "../components/Nav";
import LogoutBox from "../components/LogoutBox"; // 새로 추가

function MyProfile() {
  const [username, setUsername] = useState("홍길동");
  const [email, setEmail] = useState("hong@example.com");
  const [completionRate, setCompletionRate] = useState(75);

  const handleSaveProfile = () => {
    alert(`회원정보가 저장되었습니다.\n이름: ${username}\n이메일: ${email}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <div style={{ height: "100vh", position: "relative", fontFamily: "Pretendard" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }}>
        <Header showMenu={false} />
      </div>

      <div style={{ padding: "20px", paddingTop: "100px", paddingBottom: "120px", overflowY: "auto", height: "100%" }}>
        <ProfileInfoBox
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          onSave={handleSaveProfile}
        />

        <ProgressBar completionRate={completionRate} />

        {/* 로그아웃 박스 컴포넌트로 교체 */}
        <LogoutBox onLogout={handleLogout} />
      </div>

      {/* BottomNav 자리 확보 */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: "80px", background: "transparent" }}>
        <BottomNav />
      </div>
    </div>
  );
}

export default MyProfile;
