// CategoryEditor.js
import React, { useState } from "react";
import "./CategoryEditor.css";
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg";
import { ReactComponent as MemoIcon } from "../assets/memo.svg";

function CategoryEditor({ onClose, mode = "edit" }) {
  const [isEditingName, setIsEditingName] = useState(mode === "add");
  const [newName, setNewName] = useState("");

  const isAddMode = mode === "add";

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-box" onClick={(e) => e.stopPropagation()}>
        {/* 리스트 화면 */}
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

        {/* 이름 변경 / 카테고리 추가 화면 */}
        {(isAddMode || isEditingName) && (
          <div className="rename-box">
            {/* 제목 + Memo 아이콘 */}
            <div className="rename-title-with-icon">
              <MemoIcon className="memo-icon" />
              <span className="rename-title-text">
                {isAddMode ? "카테고리 추가하기" : "이름 변경"}
              </span>
            </div>

            {/* 입력창 */}
            <div className="rename-input-container">
              <input
                type="text"
                className="rename-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={
                  isAddMode ? "카테고리 이름 입력" : "새 이름을 입력하세요"
                }
              />
            </div>

            {/* 버튼 */}
            <div className="button-group">
              <button
                className="cancel-button"
                onClick={() => {
                  setNewName("");
                  if (isAddMode) onClose();
                  else setIsEditingName(false);
                }}
              >
                취소
              </button>
              <button
                className="confirm-button"
                onClick={() => {
                  setNewName("");
                  if (isAddMode) onClose();
                  else setIsEditingName(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryEditor;
