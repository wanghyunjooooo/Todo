// src/components/CategoryManagePopup.js
import React, { useRef, useEffect, useState } from "react";
import DeleteIcon from "../assets/delete.svg";
import "./CategoryManagePopup.css";

export default function CategoryManagePopup({ onClose, onEdit, onDelete }) {
    const popupRef = useRef();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const handleDeleteCategory = async () => {
        try {
            setLoading(true);
            setError("");
            await onDelete();
            setShowDeleteConfirm(false);
            onClose();
        } catch (err) {
            setError("삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 옵션 메뉴 */}
            {!showDeleteConfirm && (
                <div className="category-options-popup" ref={popupRef}>
                    <button
                        onClick={() => {
                            onEdit();
                            onClose();
                        }}
                    >
                        카테고리 수정하기
                    </button>
                    <button
                        onClick={() => {
                            setShowDeleteConfirm(true); // 삭제 확인창 열기
                        }}
                    >
                        카테고리 삭제하기
                    </button>
                </div>
            )}

            {/* 삭제 확인창 + overlay */}
            {showDeleteConfirm && (
                <div className="overlay">
                    <div className="category-delete-popup">
                        <div className="rename-title-with-icon">
                            <img
                                src={DeleteIcon}
                                alt="삭제"
                                className="memo-icon"
                            />
                            <span className="delete-title-text">
                                카테고리 삭제
                            </span>
                        </div>
                        <p className="delete-text">
                            카테고리가 영구적으로 삭제됩니다.
                        </p>
                        {error && <p className="error-text">{error}</p>}
                        <div className="button-group">
                            <button
                                className="cancel-button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={loading}
                            >
                                취소
                            </button>
                            <button
                                className="confirm-button delete"
                                onClick={handleDeleteCategory}
                                disabled={loading}
                            >
                                {loading ? "처리 중..." : "삭제"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
