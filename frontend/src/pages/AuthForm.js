import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AuthForm.css";
import { Eye, EyeOff } from "lucide-react";

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("📌 제출 시작", { isLogin, email, password, username });

    try {
      if (isLogin) {
        // ✅ 로그인 요청
        console.log("🔑 로그인 요청 전");

        const res = await api.post("/users/login", {
          user_email: email,
          user_password: password,
        });

        console.log("✅ 로그인 응답:", res.data);

        const { token, user_id, user_name, user_email } = res.data;

        // ✅ localStorage에 저장
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user_id);
        localStorage.setItem("user_name", user_name);
        localStorage.setItem("user_email", user_email);

        console.log("📦 localStorage 저장 완료:", {
          token: localStorage.getItem("token"),
          userId: localStorage.getItem("userId"),
        });

        alert(`${user_name}님, 로그인 성공!`);
        if (onLogin) onLogin();
        navigate("/");
      } else {
        // ✅ 회원가입 요청
        if (password !== confirmPassword) {
          setError("비밀번호가 일치하지 않습니다.");
          console.warn("⚠️ 비밀번호 불일치");
          setLoading(false);
          return;
        }

        console.log("📝 회원가입 요청 전", { username, email, password });

        const res = await api.post("/users/signup", {
          user_name: username,
          user_email: email,
          user_password: password,
        });

        console.log("✅ 회원가입 응답:", res.data);
        alert("회원가입 성공! 로그인해주세요.");
        setIsLogin(true);
      }

      // ✅ 입력값 초기화
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
    } catch (err) {
      console.error("❌ 요청 실패:", err);
      console.error("🔍 err.response:", err.response);
      setError(err.response?.data?.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
      console.log("⏹️ 제출 종료");
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form" id="auth-form">
        {!isLogin && (
          <input
            type="text"
            placeholder="닉네임"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            required
          />
        )}

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input password-input"
            required
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {!isLogin && (
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input password-input"
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        {error && <p className="auth-error">{error}</p>}
      </form>

      <div className="auth-buttons">
        <button
          type="submit"
          form="auth-form"
          className="auth-button"
          disabled={loading}
        >
          {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
        </button>

        {isLogin ? (
          <button
            type="button"
            className="auth-signup-button"
            onClick={() => setIsLogin(false)}
          >
            회원가입하기
          </button>
        ) : (
          <button
            type="button"
            className="auth-signup-button"
            onClick={() => setIsLogin(true)}
          >
            로그인하기
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
