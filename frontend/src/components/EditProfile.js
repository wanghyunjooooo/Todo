import React, { useState } from "react";
import Header from "../components/Header";
import { Eye, EyeOff } from "lucide-react"; // lucide-react 아이콘

function EditProfile() {
  const [nickname, setNickname] = useState("홍길동");
  const [email, setEmail] = useState("hong@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    alert(`저장됨\n닉네임: ${nickname}\n이메일: ${email}\n비밀번호: ${password}`);
  };

  const handleCancel = () => {
    window.history.back();
  };

  const inputStyle = {
    display: "flex",
    width: "350px",
    height: "56px",
    padding: "8px 20px",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    fontFamily: "Pretendard",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    marginBottom: "12px",
  };

  const btnStyle = {
    display: "flex",
    width: "165px",
    height: "56px",
    padding: "0 20px",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
    borderRadius: "16px",
    cursor: "pointer",
    fontFamily: "Pretendard",
    border: "none",
    outline: "none",
    fontSize: "14px",
    fontWeight: 600,
    fontStyle: "normal",
    lineHeight: "normal",
    textAlign: "center",
    color: "var(--Grey-Dark, #595959)",
  };

  return (
    <div
      style={{
        fontFamily: "Pretendard",
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        paddingLeft: "20px",
        paddingRight: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }}>
        <Header showMenu={false} />
      </div>

      <div
        style={{
          paddingTop: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        <h2
          style={{
            color: "var(--Grey-Darker, #2A2A2A)",
            fontFamily: "Pretendard",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "20px",
            marginBottom: "16px",
          }}
        >
          회원 정보 수정
        </h2>

        <input
          style={inputStyle}
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          style={inputStyle}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 비밀번호 + 눈 아이콘 */}
        <div style={{ position: "relative", width: "350px", marginBottom: "12px" }}>
          <input
            style={{ ...inputStyle, paddingRight: "40px" }}
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          paddingBottom: "120px",
        }}
      >
        <button onClick={handleCancel} style={{ ...btnStyle, backgroundColor: "var(--Grey-Light, #F3F3F3)" }}>
          취소
        </button>
        <button onClick={handleSave} style={{ ...btnStyle, backgroundColor: "#36A862", color: "#fff" }}>
          저장
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
