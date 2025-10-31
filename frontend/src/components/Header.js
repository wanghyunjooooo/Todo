import React, { useState, useRef, useEffect } from "react";
import ThreeIcon from "../assets/three.svg";
import LogoIcon from "../assets/logo.svg"; // ← 추가
import CategoryEditor from "./EditCategoryBox";

function Header({ showMenu = true, onCategoryAdded }) {
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showCategoryEditor, setShowCategoryEditor] = useState(false);
    const [editorMode, setEditorMode] = useState("add"); // "edit" | "add"
    const menuRef = useRef(null);
    const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });

    const handleEditCategoryClick = () => {
        setEditorMode("edit");
        setShowCategoryEditor(true);
        setShowPopup(false);
    };

    const handleAddCategoryClick = () => {
        setEditorMode("add");
        setShowCategoryEditor(true);
        setShowPopup(false);
    };

    const handleMenuClick = () => {
        setIsMenuActive(!isMenuActive);
        setShowPopup(!showPopup);
    };

    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const boxWidth = 135;
            let left = rect.left + 40;
            const screenWidth = window.innerWidth;
            if (left + boxWidth > screenWidth) left = screenWidth - boxWidth - 8;
            setBoxPosition({ top: rect.bottom + 4, left });
        }
    }, [showPopup]);

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <img src={LogoIcon} alt="Logo" style={{ width: "40px", height: "40px" }} />
            </div>

            {showMenu && (
                <button
                    ref={menuRef}
                    style={{
                        ...styles.menuButton,
                        filter: isMenuActive ? "invert(46%) sepia(67%) saturate(447%) hue-rotate(92deg) brightness(90%) contrast(87%)" : "invert(0%)",
                    }}
                    onClick={handleMenuClick}
                >
                    <img src={ThreeIcon} alt="three dots" style={{ width: "40px", height: "40px" }} />
                </button>
            )}

            {showPopup && (
                <div
                    style={{
                        position: "fixed",
                        top: boxPosition.top,
                        left: boxPosition.left,
                        width: "107px",
                        padding: "8px 0",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "16px",
                        border: "1px solid var(--green-light-active, #C1E4CE)",
                        background: "#FFF",
                        zIndex: 1000,
                    }}
                >
                    <PopupButton text="카테고리 추가하기" onClick={handleAddCategoryClick} />
                    <PopupButton text="카테고리 수정하기" onClick={handleEditCategoryClick} />
                </div>
            )}

            {showCategoryEditor && (
                <CategoryEditor
                    mode={editorMode} // "add" 또는 "edit"
                    onClose={() => setShowCategoryEditor(false)}
                    onCategoryAdded={(newCategory) => {
                        if (onCategoryAdded) onCategoryAdded(newCategory);
                        setShowCategoryEditor(false);
                    }}
                />
            )}
        </header>
    );
}

const PopupButton = ({ text, onClick }) => (
    <div
        onClick={onClick}
        style={{
            width: "100%",
            height: "35px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Pretendard, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "#36A862",
            cursor: "pointer",
            background: "transparent",
            border: "none",
        }}
    >
        {text}
    </div>
);

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: "10px 20px",
        width: "390px",
        height: "80px",
        background: "#FBFBFB",
        boxSizing: "border-box",
        position: "relative",
    },
    logo: { display: "flex", alignItems: "center" },
    menuButton: {
        width: "38.658px",
        height: "24px",
        aspectRatio: "1 / 1",
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
};

export default Header;
