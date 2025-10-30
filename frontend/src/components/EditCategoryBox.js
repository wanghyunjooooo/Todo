// src/components/CategoryEditor.js
import React, { useState, useEffect } from "react";
import "./CategoryEditor.css";
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg";
import { ReactComponent as MemoIcon } from "../assets/memo.svg";
import { updateCategory } from "../api"; // api.js에서 함수 가져오기
import api from "../api"; // GET, POST, DELETE 등

function CategoryEditor({ onClose, mode = "edit", onCategoryAdded }) {
    const [isEditingName, setIsEditingName] = useState(mode === "add");
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showActionButtons, setShowActionButtons] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인 상태

    const isAddMode = mode === "add";
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    const fetchCategories = async () => {
        if (!token || !userId) {
            setError("로그인이 필요합니다.");
            return;
        }
        try {
            const res = await api.get(`/categories/${userId}`);
            const data = res.data;
            if (Array.isArray(data)) setCategories(data);
            else if (data.category_id) setCategories([data]);
            else setCategories([]);
        } catch (err) {
            console.error("카테고리 조회 실패:", err.response || err.message);
            setError(
                err.response?.data?.message || "카테고리 조회 중 오류 발생"
            );
        }
    };

    const handleAddCategory = async () => {
        if (!newName.trim()) {
            setError("카테고리 이름을 입력하세요.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const payload = { category_name: newName, user_id: Number(userId) };
            if (onCategoryAdded) onCategoryAdded(newName);
            setNewName("");
            onClose();
        } catch (err) {
            console.error("카테고리 추가 실패:", err.response || err.message);
            setError(
                err.response?.data?.message ||
                    "동일한 이름의 카테고리가 이미 존재합니다"
            );
        } finally {
            setLoading(false);
        }
    };
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setShowActionButtons(true);
        setIsEditingName(false);
        setShowDeleteConfirm(false); // 삭제 모달 초기화
        setNewName(category.category_name); // ✅ 기존 이름 미리 넣기
    };

    const handleUpdateCategoryName = async () => {
        if (!newName.trim()) {
            setError("새 이름을 입력하세요.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await updateCategory(userId, selectedCategory.category_id, newName);
            setSelectedCategory(null);
            setShowActionButtons(false);
            setNewName("");
            fetchCategories();
        } catch (err) {
            console.error("카테고리 수정 실패:", err.response || err.message);
            setError(
                err.response?.data?.message || "카테고리 수정 중 오류 발생"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        setLoading(true);
        setError("");
        try {
            await api.delete(
                `/categories/${userId}/${selectedCategory.category_id}`
            );
            setSelectedCategory(null);
            setShowActionButtons(false);
            setShowDeleteConfirm(false);
            fetchCategories();
        } catch (err) {
            console.error("카테고리 삭제 실패:", err.response || err.message);
            setError(
                err.response?.data?.message || "카테고리 삭제 중 오류 발생"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAddMode) fetchCategories();
    }, []);

    return (
        <div className="editor-overlay" onClick={onClose}>
            <div className="editor-box" onClick={(e) => e.stopPropagation()}>
                {/* 추가 모드 */}
                {isAddMode && (
                    <div className="rename-box">
                        <div className="rename-title-with-icon">
                            <MemoIcon className="memo-icon" />
                            <span className="rename-title-text">
                                카테고리 추가하기
                            </span>
                        </div>
                        <div className="rename-input-container">
                            <input
                                type="text"
                                className="rename-input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="카테고리 이름 입력"
                                disabled={loading}
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <div className="button-group">
                            <button
                                className="cancel-button"
                                onClick={onClose}
                                disabled={loading}
                            >
                                취소
                            </button>
                            <button
                                className="confirm-button"
                                onClick={handleAddCategory}
                                disabled={loading}
                            >
                                {loading ? "처리 중..." : "확인"}
                            </button>
                        </div>
                    </div>
                )}

                {/* 카테고리 선택 */}
                {!isAddMode && !selectedCategory && (
                    <div className="category-list">
                        {categories.length === 0 ? (
                            <p>카테고리가 없습니다.</p>
                        ) : (
                            categories.map((cat) => (
                                <div
                                    key={cat.category_id}
                                    className="category-item"
                                    onClick={() => handleSelectCategory(cat)}
                                >
                                    <div className="text-with-icon">
                                        <MemoIcon className="memo-icon" />
                                        <span>{cat.category_name}</span>
                                    </div>
                                    <ArrowIcon className="arrow-icon" />
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* 선택한 카테고리: 이름변경/삭제 버튼 */}
                {selectedCategory &&
                    showActionButtons &&
                    !isEditingName &&
                    !showDeleteConfirm && (
                        <div className="rename-box">
                            <div className="rename-title-with-icon">
                                <MemoIcon className="memo-icon" />
                                <span className="rename-title-text">
                                    {selectedCategory.category_name}
                                </span>
                            </div>
                            <div
                                className="category-item"
                                onClick={() => setIsEditingName(true)}
                            >
                                <span>이름 변경</span>
                                <ArrowIcon className="arrow-icon" />
                            </div>
                            <div
                                className="category-item delete"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <span>카테고리 삭제</span>
                                <ArrowIcon className="arrow-icon" />
                            </div>
                        </div>
                    )}

                {/* 이름 변경 폼 */}
                {selectedCategory && isEditingName && (
                    <div className="rename-box">
                        <div className="rename-title-with-icon">
                            <MemoIcon className="memo-icon" />
                            <span className="rename-title-text">
                                {selectedCategory.category_name} 이름 변경
                            </span>
                        </div>
                        <div className="rename-input-container">
                            <input
                                type="text"
                                className="rename-input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="새 이름을 입력하세요"
                                disabled={loading}
                            />
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        <div className="button-group">
                            <button
                                className="cancel-button"
                                onClick={() => setIsEditingName(false)}
                                disabled={loading}
                            >
                                취소
                            </button>
                            <button
                                className="confirm-button"
                                onClick={handleUpdateCategoryName}
                                disabled={loading}
                            >
                                {loading ? "처리 중..." : "확인"}
                            </button>
                        </div>
                    </div>
                )}

                {/* 삭제 확인 모달 */}
                {selectedCategory && showDeleteConfirm && (
                    <div className="rename-box">
                        <div className="rename-title-with-icon">
                            <MemoIcon className="memo-icon" />
                            <span className="rename-title-text">
                                카테고리 삭제 확인
                            </span>
                        </div>
                        <p>선택한 카테고리를 영구적으로 삭제하시겠습니까?</p>
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
                )}
            </div>
        </div>
    );
}

export default CategoryEditor;
