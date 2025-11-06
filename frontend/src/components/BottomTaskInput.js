// src/components/BottomTaskInput.js
import React, { useState, useRef } from "react";
import TaskIcon from "../assets/task.svg";
import "./bottomTaskInput.css";
import CategoryPopup from "./CategoryPopup";

export default function BottomTaskInput({ categories = [], onAddTask }) {
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
            ); // ✅ 선택한 카테고리 ID 전달
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
                            ? selectedCategory.category_name // ✅ 선택된 카테고리 이름 표시
                            : "작업"}
                    </span>
                </button>
            </div>

            {popupOpen && (
                <CategoryPopup
                    categories={categories}
                    onSelect={(cat) => {
                        console.log("선택한 카테고리:", cat.category_name);
                        setSelectedCategory(cat); // ✅ state에 저장
                        setPopupOpen(false);
                    }}
                    onClose={() => setPopupOpen(false)}
                />
            )}
        </div>
    );
}
