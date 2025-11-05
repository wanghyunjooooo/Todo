import React from "react";

function LogoutBox({ onClose }) {
    // 확인 클릭 시 로그아웃 처리
    const handleConfirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
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
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    width: "330px",
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
                        onClick={onClose} // 취소 → 팝업 닫기
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
                        onClick={handleConfirmLogout} // 확인 → 로그아웃
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
    );
}

export default LogoutBox;
