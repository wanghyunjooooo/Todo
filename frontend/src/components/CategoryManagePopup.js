// src/components/CategoryManagePopup.js
import React, { useRef, useEffect } from "react";
import "./CategoryManagePopup.css";

export default function CategoryManagePopup({ onClose, onEdit, onDelete }) {
    const popupRef = useRef();

    // 팝업 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="category-options-popup" ref={popupRef}>
            <button
                onClick={() => {
                    onEdit(); // 페이지 상단 카테고리 이름 수정 시작
                    onClose(); // 팝업 닫기
                }}
            >
                카테고리 수정
            </button>
            <div
                style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#E0E0E0",
                    margin: "4px 0",
                }}
            />
            <button onClick={onDelete}>카테고리 삭제</button>
        </div>
    );
}
