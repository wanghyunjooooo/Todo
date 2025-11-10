import React from "react";

function LogoutBox({ onClose }) {
    // 확인 클릭 시 로그아웃 처리
    const handleConfirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        sessionStorage.clear();

        alert("로그아웃 되었습니다.");
        window.location.href = "/login"; // 로그인 페이지로 이동
    };

    return (
        <>
            {/* 반투명 배경 클릭 시 팝업 닫기 */}
            <div
                onClick={onClose}
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
                    display: "flex",
                    width: "350px",
                    padding: "20px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                    borderRadius: "16px",
                    background: "var(--grey-white-hover, #FBFBFB)",

                    position: "fixed",
                    bottom: "41px",
                    left: "20px",
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
                    }}
                >
                    <span
                        style={{
                            flex: "1 0 0",
                            color: "var(--Red, #FD5344)",
                            fontFamily: "Pretendard",
                            fontSize: "12px",
                            fontStyle: "normal",
                            fontWeight: "500",
                            lineHeight: "normal",
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
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <span
                        style={{
                            flex: "1 0 0",
                            color: "var(--Grey-Darker, #2A2A2A)",
                            textAlign: "center",
                            fontFamily: "Pretendard",
                            fontSize: "12px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "normal",
                        }}
                    >
                        정말로 로그아웃 하시겠습니까?
                    </span>
                </div>

                {/* 버튼 영역 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        alignSelf: "stretch",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            width: "151px",
                            height: "40px",
                            padding: "20px",
                            alignItems: "center",
                            gap: "8px",
                            background: "transparent",
                        }}
                    >
                        <button
                            onClick={onClose} // 취소 → 팝업 닫기
                            style={{
                                flex: "1 0 0",
                                color: "var(--Grey-Dark, #595959)",
                                textAlign: "center",
                                fontFamily: "Pretendard",
                                fontSize: "12px",
                                fontStyle: "normal",
                                fontWeight: "500",
                                lineHeight: "normal",
                                border: "none",
                                background: "transparent",
                            }}
                        >
                            취소
                        </button>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            width: "151px",
                            height: "40px",
                            padding: "20px",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <button
                            onClick={handleConfirmLogout} // 확인 → 로그아웃
                            style={{
                                flex: "1 0 0",
                                color: "var(--Grey-Dark, #595959)",
                                textAlign: "center",
                                fontFamily: "Pretendard",
                                fontSize: "12px",
                                fontStyle: "normal",
                                fontWeight: "500",
                                lineHeight: "normal",
                                border: "none",
                                background: "transparent",
                            }}
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LogoutBox;
