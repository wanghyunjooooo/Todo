import React from "react";

function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* 사이드바 */}
            <div
                style={{
                    ...styles.sidebar,
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                }}
            >
                {/* 닫기 버튼 */}
                <button style={styles.closeBtn} onClick={onClose}>
                    X
                </button>
            </div>

            {/* 오버레이 */}
            {isOpen && <div style={styles.overlay} onClick={onClose}></div>}
        </>
    );
}

const styles = {
    sidebar: {
        position: "fixed",
        top: 0,
        right: 0,
        width: "165px", // 디자인 기준
        height: "844px", // 디자인 기준
        padding: "80px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexShrink: 0,
        background: "#EBF6EF", // Green/Light
        boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
        zIndex: 20,
        transition: "transform 0.3s ease-in-out",
    },
    closeBtn: {
        alignSelf: "flex-end",
        marginBottom: "20px",
        background: "none",
        border: "none",
        fontSize: 20,
        cursor: "pointer",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
    },
    menuItem: {
        width: "100%",
        padding: "10px",
        background: "#36A862", // Green/Normal
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        textAlign: "left",
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)",
        zIndex: 15,
    },
};

export default Sidebar;
