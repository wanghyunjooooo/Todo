import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CategoryEditor.css";
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg";
import { ReactComponent as MemoIcon } from "../assets/memo.svg";

function CategoryEditor({ onClose, mode = "edit", onCategoryAdded }) {
  const [isEditingName, setIsEditingName] = useState(mode === "add");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]); // 유저 카테고리 리스트
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택한 카테고리

  const isAddMode = mode === "add";
  const API_URL = "http://localhost:8080";

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

const fetchCategories = async () => {
  if (!token || !userId) {
    setError("로그인이 필요합니다.");
    return;
  }
  try {
    const res = await axios.get(`${API_URL}/categories/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 응답이 배열인지 객체인지 확인
    const data = res.data;
    if (Array.isArray(data)) {
      setCategories(data);
    } else if (data.category_id) {
      setCategories([data]); // 단일 객체일 때 배열로 감싸기
    } else {
      setCategories([]);
    }
  } catch (err) {
    console.error("카테고리 조회 실패:", err.response || err.message);
    setError(err.response?.data?.message || "카테고리 조회 중 오류 발생");
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
      const res = await axios.post(`${API_URL}/categories`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (onCategoryAdded) onCategoryAdded(res.data.category);
      setNewName("");
      onClose();
    } catch (err) {
      console.error("카테고리 추가 실패:", err.response || err.message);
      setError(err.response?.data?.message || "카테고리 추가 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleUpdateCategoryName = async () => {
    if (!newName.trim()) {
      setError("새 이름을 입력하세요.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const payload = { category_name: newName };
      await axios.put(`${API_URL}/categories/${selectedCategory.id}`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setSelectedCategory(null);
      setNewName("");
      fetchCategories(); // 갱신
    } catch (err) {
      console.error("카테고리 수정 실패:", err.response || err.message);
      setError(err.response?.data?.message || "카테고리 수정 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    setError("");

    try {
      await axios.delete(`${API_URL}/categories/${selectedCategory.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCategory(null);
      fetchCategories(); // 갱신
    } catch (err) {
      console.error("카테고리 삭제 실패:", err.response || err.message);
      setError(err.response?.data?.message || "카테고리 삭제 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 카테고리 불러오기
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
              <span className="rename-title-text">카테고리 추가하기</span>
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
              <button className="cancel-button" onClick={onClose} disabled={loading}>
                취소
              </button>
              <button className="confirm-button" onClick={handleAddCategory} disabled={loading}>
                {loading ? "처리 중..." : "확인"}
              </button>
            </div>
          </div>
        )}

        {/* 편집 모드: 카테고리 선택 */}
        {!isAddMode && !selectedCategory && (
          <div className="category-list">
            {categories.length === 0 ? (
              <p>카테고리가 없습니다.</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
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

        {/* 선택한 카테고리 수정/삭제 화면 */}
        {selectedCategory && (
          <div className="rename-box">
            <div className="rename-title-with-icon">
              <MemoIcon className="memo-icon" />
              <span className="rename-title-text">{selectedCategory.category_name}</span>
            </div>

            <div className="category-item" onClick={() => setIsEditingName(true)}>
              <span>이름 변경</span>
              <ArrowIcon className="arrow-icon" />
            </div>
            <div className="category-item delete" onClick={handleDeleteCategory}>
              <span>카테고리 삭제</span>
              <ArrowIcon className="arrow-icon" />
            </div>

            {/* 이름 변경 폼 */}
            {isEditingName && (
              <div className="rename-input-container">
                <input
                  type="text"
                  className="rename-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="새 이름을 입력하세요"
                  disabled={loading}
                />
                {error && <p className="error-text">{error}</p>}
                <div className="button-group">
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName("");
                    }}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryEditor;
