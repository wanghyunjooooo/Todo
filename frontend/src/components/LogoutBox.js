import React, { useState } from "react";

function LogoutBox() {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmLogout = () => {
        // ✅ 로컬스토리지 데이터 제거
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
        sessionStorage.clear();

        alert("로그아웃 되었습니다.");
        window.location.href = "/login";
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    return (
        <>
            {/* 로그아웃 버튼 */}
            <div
                onClick={handleLogoutClick}
                style={{
                    display: "flex",
                    width: "350px",
                    height: "56px",
                    padding: "21px 20px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "16px",
                    background: "#FFF",
                    cursor: "pointer",
                    marginTop: "20px",
                }}
            >
                <span
                    style={{
                        color: "#FD5344",
                        fontFamily: "Pretendard",
                        fontSize: "12px",
                        fontWeight: 500,
                    }}
                >
                    로그아웃
                </span>
            </div>

            {/* 로그아웃 확인 팝업 */}
            {showConfirm && (
                <>
                    {/* 반투명 배경 */}
                    <div
                        onClick={handleCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100vh",
                            background: "rgba(42,42,42,0.2)",
                            zIndex: 9998,
                        }}
                    ></div>

                    {/* 팝업 본체 */}
                    <div
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            width: "350px",
                            padding: "20px",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "8px",
                            borderRadius: "16px",
                            background: "#FFF",
                            zIndex: 10000,
                        }}
                    >
                        {/* 첫 번째 박스: 로그아웃 */}
                        <div
                            style={{
                                display: "flex",
                                width: "310px",
                                padding: "13px 8px",
                                alignItems: "center",
                                gap: "8px",
                                borderRadius: "12px",
                                background: "#fff",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Pretendard",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    color: "#FD5344",
                                }}
                            >
                                로그아웃
                            </span>
                        </div>

                        {/* 두 번째 박스: 안내문 */}
                        <div
                            style={{
                                display: "flex",
                                width: "310px",
                                padding: "13px 0",
                                gap: "8px",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "Pretendard",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    color: "#2A2A2A",
                                }}
                            >
                                정말로 로그아웃 하시겠습니까?
                            </span>
                        </div>

                        {/* 버튼 영역 */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                width: "100%",
                                gap: "10px",
                                marginTop: "8px",
                            }}
                        >
                            <button
                                onClick={handleCancel}
                                style={{
                                    flex: "1",
                                    padding: "13px 20px",
                                    borderRadius: "16px",
                                    border: "none",
                                    background: "#fff",
                                    fontFamily: "Pretendard",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    color: "#595959",
                                }}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                style={{
                                    flex: "1",
                                    padding: "13px 20px",
                                    borderRadius: "16px",
                                    border: "none",
                                    background: "#fff",
                                    color: "#595959",
                                    fontFamily: "Pretendard",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default LogoutBox;
