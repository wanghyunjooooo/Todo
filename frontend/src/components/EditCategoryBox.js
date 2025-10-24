// CategoryEditor.js
import React, { useState } from "react";
import "./CategoryEditor.css";
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg";
import { ReactComponent as MemoIcon } from "../assets/memo.svg";

function CategoryEditor({ onClose }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-box" onClick={(e) => e.stopPropagation()}>
        {!isEditingName ? (
          // 리스트 화면
          <div className="category-list">
            {/* 카테고리 수정하기 */}
            <div className="category-item">
              <div className="text-with-icon">
                <MemoIcon className="memo-icon" />
                <span>카테고리 수정하기</span>
              </div>
              <ArrowIcon className="arrow-icon" />
            </div>

            {/* 이름 변경 */}
            <div
              className="category-item"
              onClick={() => setIsEditingName(true)}
              style={{ cursor: "pointer" }}
            >
              <span>이름 변경</span>
              <ArrowIcon className="arrow-icon" />
            </div>

            {/* 카테고리 삭제 */}
            <div className="category-item delete">
              <span>카테고리 삭제</span>
              <ArrowIcon className="arrow-icon" />
            </div>
          </div>
        ) : (
          // 이름 변경 화면
          <div className="rename-box">
            {/* 제목 */}
            <span className="rename-title">이름 변경</span>

            {/* 입력창 */}
            <div className="rename-input-container">
              <input
                type="text"
                className="rename-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="새 이름을 입력하세요"
              />
            </div>

            {/* 버튼 */}
            <div className="button-group">
              <button
                className="cancel-button"
                onClick={() => setIsEditingName(false)}
              >
                취소
              </button>
              <button className="confirm-button">확인</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryEditor;
