import React, { useState } from "react";
import axios from "axios";
import "./CategoryEditor.css";
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg";
import { ReactComponent as MemoIcon } from "../assets/memo.svg";

function CategoryEditor({ onClose, mode = "edit", onCategoryAdded }) {
  const [isEditingName, setIsEditingName] = useState(mode === "add");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAddMode = mode === "add";
  const API_URL = "http://localhost:8080";
  const LOCAL_PREFIX = "myapp_"; // token, user_id 저장 시 prefix

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      setError("카테고리 이름을 입력하세요.");
      return;
    }

const token = localStorage.getItem("token");
const userId = localStorage.getItem("user_id");

if (!token || !userId) {
  setError("로그인이 필요합니다.");
  return;
}

    setLoading(true);
    setError("");

    try {
      const payload = {
        category_name: newName,
        user_id: Number(userId),
      };

      const res = await axios.post(`${API_URL}/categories`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-box" onClick={(e) => e.stopPropagation()}>
        {!isEditingName && !isAddMode && (
          <div className="category-list">
            <div className="category-item">
              <div className="text-with-icon">
                <MemoIcon className="memo-icon" />
                <span>카테고리 수정하기</span>
              </div>
              <ArrowIcon className="arrow-icon" />
            </div>
            <div
              className="category-item"
              onClick={() => setIsEditingName(true)}
              style={{ cursor: "pointer" }}
            >
              <span>이름 변경</span>
              <ArrowIcon className="arrow-icon" />
            </div>
            <div className="category-item delete">
              <span>카테고리 삭제</span>
              <ArrowIcon className="arrow-icon" />
            </div>
          </div>
        )}

        {(isAddMode || isEditingName) && (
          <div className="rename-box">
            <div className="rename-title-with-icon">
              <MemoIcon className="memo-icon" />
              <span className="rename-title-text">
                {isAddMode ? "카테고리 추가하기" : "이름 변경"}
              </span>
            </div>
            <div className="rename-input-container">
              <input
                type="text"
                className="rename-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={isAddMode ? "카테고리 이름 입력" : "새 이름을 입력하세요"}
                disabled={loading}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <div className="button-group">
              <button
                className="cancel-button"
                onClick={() => {
                  setNewName("");
                  if (isAddMode) onClose();
                  else setIsEditingName(false);
                }}
                disabled={loading}
              >
                취소
              </button>
              <button
                className="confirm-button"
                onClick={() => {
                  if (isAddMode) handleAddCategory();
                  else setIsEditingName(false);
                }}
                disabled={loading}
              >
                {loading ? "처리 중..." : "확인"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryEditor;
