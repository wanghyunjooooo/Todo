import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ProfileInfoBox from "../components/ProfileInfoBox";
import ProgressBar from "../components/ProgressBar";

function MyProfile() {
    const [name, setName] = useState("홍길동");
    const [email, setEmail] = useState("hong@example.com");
    const [userId, setId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("user_id"); // 로그인 시 저장한 user_id
        setId(id);
    }, []);

    const handleSaveProfile = () => {
        alert(`회원정보가 저장되었습니다.\n이름: ${name}\n이메일: ${email}`);
    };

    return (
        <div
            style={{
                height: "100vh",
                position: "relative",
                fontFamily: "Pretendard",
            }}
        >
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 100,
                }}
            >
                <Header showMenu={false} />
            </div>

            <div
                style={{
                    padding: "20px",
                    paddingTop: "100px",
                    paddingBottom: "120px",
                    overflowY: "auto",
                    height: "100%",
                }}
            >
                <ProfileInfoBox name={name} setName={setName} email={email} setEmail={setEmail} onSave={handleSaveProfile} />

                {userId ? <ProgressBar userId={userId} /> : <div>주간 통계 로딩중...</div>}
            </div>

            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "80px",
                    background: "transparent",
                }}
            ></div>
        </div>
    );
}

export default MyProfile;
