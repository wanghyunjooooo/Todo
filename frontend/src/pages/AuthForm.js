// AuthForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_URL = "http://localhost:8080";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // ✅ 로그인 요청
        const res = await axios.post(`${API_URL}/users/login`, {
          user_email: email,
          user_password: password,
        });

        console.log("로그인 성공:", res.data);

      const { token, user_id, user_name, user_email } = res.data;

localStorage.setItem("token", token);
localStorage.setItem("user_id", user_id);
localStorage.setItem("user_name", user_name);
localStorage.setItem("user_email", user_email);

alert(`${user_name}님, 로그인 성공!`);

        // 부모 컴포넌트에 로그인 상태 전달
        onLogin && onLogin();

        // 홈으로 이동
        navigate("/");
      } else {
        // ✅ 회원가입 요청
        const res = await axios.post(`${API_URL}/users/signup`, {
          user_name: username,
          user_email: email,
          user_password: password,
        });

        console.log("회원가입 성공:", res.data);
        alert("회원가입 성공! 로그인해주세요.");

        // 회원가입 완료 후 로그인 화면으로 전환
        setIsLogin(true);
      }

      // 입력값 초기화
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (err) {
      console.error("에러:", err);
      setError(err.response?.data?.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "로그인" : "회원가입"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* 회원가입일 때만 이름 입력 */}
        {!isLogin && (
          <input
            type="text"
            placeholder="사용자 이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
        )}

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <p style={styles.toggleText}>
        {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
        <span style={styles.toggleLink} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "회원가입" : "로그인"}
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: "320px",
    margin: "60px auto",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 0 12px rgba(0,0,0,0.08)",
    background: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#36A862",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  toggleText: {
    marginTop: "12px",
    fontSize: "14px",
  },
  toggleLink: {
    color: "#36A862",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AuthForm;
