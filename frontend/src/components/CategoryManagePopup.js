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
                    onEdit();
                    onClose();
                }}
            >
                카테고리 수정하기
            </button>
            <button onClick={onDelete}>카테고리 삭제하기</button>
        </div>
    );
}
