import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AuthForm.css";
import { Eye, EyeOff } from "lucide-react";
import BigLogo from "../assets/biglogo.svg"; // 로고 import

function AuthForm({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setname] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // 🔐 비밀번호 검증 함수
    const validatePassword = (pwd) => {
        const minLength = 8;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).+$/;
        if (pwd.length < minLength) {
            return `비밀번호는 최소 ${minLength}자리 이상이어야 합니다.`;
        }
        if (!regex.test(pwd)) {
            return "비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                if (!email || !password) {
                    setError("이메일과 비밀번호를 입력해주세요.");
                    setLoading(false);
                    return;
                }

                const res = await api.post("/users/login", { email, password });
                const data = res.data;

                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("name", data.name);
                localStorage.setItem("email", data.email);

                alert(`${data.name}님, 로그인 성공!`);
                if (onLogin) onLogin();
                navigate("/");
            } else {
                if (!name || !email || !password || !confirmPassword) {
                    setError("모든 필드를 입력해주세요.");
                    setLoading(false);
                    return;
                }

                const pwdError = validatePassword(password);
                if (pwdError) {
                    setError(pwdError);
                    setLoading(false);
                    return;
                }

                if (password !== confirmPassword) {
                    setError("비밀번호가 일치하지 않습니다.");
                    setLoading(false);
                    return;
                }

                await api.post("/users/signup", { name, email, password });
                alert("회원가입 성공! 로그인해주세요.");
                setIsLogin(true);
            }

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setname("");
        } catch (err) {
            console.error("로그인 요청 에러:", err);
            console.error("응답 데이터:", err.response?.data);
            console.error("응답 상태:", err.response?.status);
            console.error("요청 URL:", err.config?.url);
            setError("로그인 실패: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page" style={{ backgroundColor: "#FBFBFB" }}>
            <div className="auth-logo-container">
                <img src={BigLogo} alt="로고" />
            </div>

            <form onSubmit={handleSubmit} className="auth-form" id="auth-form">
                {!isLogin && <input type="text" placeholder="닉네임" value={name} onChange={(e) => setname(e.target.value)} className="auth-input" required />}

                <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" required />

                <div className="password-container">
                    <input type={showPassword ? "text" : "password"} placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input password-input" required />
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {!isLogin && (
                    <div className="password-container">
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-input password-input" required />
                        <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                )}

                {error && <p className="auth-error">{error}</p>}
            </form>

            <div className="auth-buttons">
                <button type="submit" form="auth-form" className="auth-button" disabled={loading}>
                    {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
                </button>

                {isLogin ? (
                    <button type="button" className="auth-signup-button" onClick={() => setIsLogin(false)}>
                        회원가입하기
                    </button>
                ) : (
                    <button type="button" className="auth-signup-button" onClick={() => setIsLogin(true)}>
                        로그인하기
                    </button>
                )}
            </div>
        </div>
    );
}

export default AuthForm;
