import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AuthForm.css";
import { Eye, EyeOff } from "lucide-react";

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 👈 추가
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👈 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // 로그인
        const res = await api.post("/users/login", {
          user_email: email,
          user_password: password,
        });

        const { token, user_id, user_name, user_email } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("user_name", user_name);
        localStorage.setItem("user_email", user_email);

        alert(`${user_name}님, 로그인 성공!`);
        if (onLogin) onLogin();
        navigate("/");
      } else {
        // 회원가입
        if (password !== confirmPassword) {
          setError("비밀번호가 일치하지 않습니다.");
          setLoading(false);
          return;
        }

        await api.post("/users/signup", {
          user_name: username,
          user_email: email,
          user_password: password,
        });

        alert("회원가입 성공! 로그인해주세요.");
        setIsLogin(true);
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
    } catch (err) {
      console.error("에러:", err);
      setError(err.response?.data?.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form" id="auth-form">
        {/* 회원가입일 때만 닉네임 입력 */}
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

        {/* 비밀번호 */}
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

        {/* 회원가입일 때만 비밀번호 확인 */}
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

      {/* 버튼 위치 동일 */}
      <div className="auth-buttons">
        <button type="submit" form="auth-form" className="auth-button" disabled={loading}>
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
