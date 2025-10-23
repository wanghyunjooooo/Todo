import React from "react";
import "./CategoryEditor.css";
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg"; // 아이콘 사용

function CategoryEditor({ onClose }) {
  return (
    <div className="editor-overlay">
      <div className="editor-box">
        {/* 리스트 3개 */}
        <div className="category-list">
          {["카테고리 1", "카테고리 2", "카테고리 3"].map((item, index) => (
            <div className="category-item" key={index}>
              <span>{item}</span>
              <ArrowIcon className="arrow-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryEditor;
