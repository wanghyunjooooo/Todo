// src/pages/EditProfile.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Eye, EyeOff } from "lucide-react";
import api from "../api"; // JWT 토큰 자동 포함 Axios 인스턴스

function EditProfile() {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const userId = localStorage.getItem("user_id"); // login 시 저장된 userId 사용

    // ✅ 회원정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!userId) {
                alert("로그인이 필요합니다.");
                window.location.href = "/login";
                return;
            }

            try {
                const res = await api.get(`/users/profile/${userId}`);
                const data = res.data;
                console.log("회원정보:", data);

                setUserName(data.user_name || "");
                setUserEmail(data.user_email || "");
            } catch (err) {
                console.error("회원정보 조회 실패:", err);
                alert("회원 정보를 불러오지 못했습니다.");
            }
        };

        fetchUserInfo();
    }, [userId]);

    // ✅ 회원정보 수정
    const handleSave = async () => {
        if (!userName || !userEmail) {
            alert("이름과 이메일은 필수입니다.");
            return;
        }

        try {
            const payload = {
                user_name: userName,
                user_email: userEmail,
                ...(userPassword && { user_password: userPassword }), // 입력 시에만 포함
            };

            console.log("회원정보수정:", payload);

            const res = await api.put(`/users/profile/${userId}`, payload);
            console.log("수정 결과:", res.data);

            alert(res.data.message || "회원정보가 수정되었습니다.");
            window.location.href = "/mypage"; // 수정 완료 후 이동
        } catch (err) {
            console.error("회원정보 수정 실패:", err);
            alert("회원정보 수정에 실패했습니다.");
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    const inputStyle = {
        display: "flex",
        width: "350px",
        height: "56px",
        padding: "21px 20px",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        fontFamily: "Pretendard",
        fontSize: "12px",
        fontWeight: 400,
        borderRadius: "16px",
        border: "none",
        outline: "none",
        marginTop: "8px",
        color: "#595959",
    };

    const btnStyle = {
        display: "flex",
        width: "165px",
        height: "56px",
        padding: "19.5px 20px",
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
        fontWeight: 500,
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
            {/* Header */}
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }}>
                <Header showMenu={false} />
            </div>

            {/* 입력 폼 */}
            <div
                style={{
                    paddingTop: "100px",
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
                        fontWeight: 500,
                        margin: "0 0 12px 0",
                    }}
                >
                    회원 정보 수정
                </h2>

                <input style={inputStyle} type="text" placeholder="이름" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <input style={inputStyle} type="email" placeholder="이메일" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />

                {/* 비밀번호 입력 */}
                <div style={{ position: "relative", width: "350px", marginBottom: "12px" }}>
                    <input style={{ ...inputStyle, paddingRight: "40px" }} type={showPassword ? "text" : "password"} placeholder="비밀번호 (변경 시 입력)" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
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

            {/* 버튼 */}
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
