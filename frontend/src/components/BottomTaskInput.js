// src/components/BottomTaskInput.js
import React, { useState, useRef } from "react";
import TaskIcon from "../assets/task.svg";
import "./bottomTaskInput.css";
import CategoryPopup from "./CategoryPopup";

export default function BottomTaskInput({
    categories = [],
    onAddTask,
    hideCategorySelector = false, // 🔹 추가: 다른 페이지에서는 true
}) {
    const [bottomInput, setBottomInput] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null); // ✅ 선택한 카테고리 저장
    const bottomInputRef = useRef(null);

    const handleEnter = async (e) => {
        if (e.key !== "Enter") return;
        if (!bottomInput.trim()) return;

        if (onAddTask) {
            await onAddTask(
                selectedCategory?.category_id ?? null,
                bottomInput.trim()
            );
            setBottomInput("");
        }
    };

    return (
        <div className="bottom-input-wrapper">
            <div className="bottom-content">
                <div className="bottom-left">
                    <button className="bottom-check-btn" disabled></button>
                    <input
                        className="bottom-text-input"
                        ref={bottomInputRef}
                        type="text"
                        value={bottomInput}
                        onChange={(e) => setBottomInput(e.target.value)}
                        onKeyDown={handleEnter}
                        placeholder="할 일 적는 칸"
                    />
                </div>

                {/* 🔹 Home 화면에서만 카테고리 선택 버튼 표시 */}
                {!hideCategorySelector && (
                    <button
                        className="bottom-menu-btn"
                        onClick={() => setPopupOpen((prev) => !prev)}
                    >
                        <img
                            className="bottom-category-btn"
                            src={TaskIcon}
                            alt="task"
                        />
                        <span className="bottom-category-span">
                            {selectedCategory
                                ? selectedCategory.category_name
                                : "작업"}
                        </span>
                    </button>
                )}
            </div>

            {/* 🔹 Home 화면에서만 카테고리 팝업 표시 */}
            {!hideCategorySelector && popupOpen && (
                <CategoryPopup
                    categories={categories}
                    selectedCategory={selectedCategory} // ✅ 현재 선택된 카테고리 전달
                    onSelect={(cat) => {
                        setSelectedCategory(cat); // 선택된 카테고리 상태 갱신
                        setPopupOpen(false);
                    }}
                    onClose={() => setPopupOpen(false)}
                />
            )}
        </div>
    );
}
