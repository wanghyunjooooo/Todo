import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api";
import ArrowLeftIcon from "../assets/icon-arrow-right.svg";
import "./EditProfile.css";

function EditProfile() {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!userId) {
                alert("로그인이 필요합니다.");
                window.location.href = "/login";
                return;
            }
            try {
                const res = await api.get(`/users/profile/${userId}`);
                setUserName(res.data.user_name || "");
                setUserEmail(res.data.user_email || "");
            } catch (err) {
                console.error(err);
                alert("회원 정보를 불러오지 못했습니다.");
            }
        };
        fetchUserInfo();
    }, [userId]);

    const handleSave = async () => {
        if (!userName || !userEmail) {
            alert("이름과 이메일은 필수입니다.");
            return;
        }
        if (userPassword && userPassword !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        try {
            const payload = {
                user_name: userName,
                user_email: userEmail,
                ...(userPassword && { user_password: userPassword }),
            };
            await api.put(`/users/profile/${userId}`, payload);
            alert("회원정보가 수정되었습니다.");
            window.history.back();
        } catch (err) {
            console.error(err);
            alert("회원정보 수정 실패");
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-form">
                {/* 상단: 화살표 + 회원정보 수정 같은 줄 */}
                <div className="edit-profile-header">
                    <img src={ArrowLeftIcon} alt="back" className="back-arrow" onClick={() => window.history.back()} />
                    <h2>회원 정보 수정</h2>
                </div>

                <input className="edit-profile-input" type="text" placeholder="이름" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <input className="edit-profile-input" type="email" placeholder="이메일" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />

                <div className="password-container">
                    <input className="edit-profile-input" type={showPassword ? "text" : "password"} placeholder="비밀번호 (변경 시 입력)" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="password-container">
                    <input className="edit-profile-input" type={showConfirmPassword ? "text" : "password"} placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {error && <p className="auth-error">{error}</p>}
            </div>

            {/* 버튼 */}
            <div className="edit-profile-btns">
                <button className="edit-profile-btn cancel" onClick={handleCancel}>
                    취소
                </button>
                <button className="edit-profile-btn save" onClick={handleSave}>
                    저장
                </button>
            </div>
        </div>
    );
}

export default EditProfile;
