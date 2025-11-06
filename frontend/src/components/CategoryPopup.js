import React, { useState } from "react";
import TaskIcon from "../assets/task.svg";
import "./CategoryPopup.css";

export default function CategoryPopup({ categories = [], onSelect, onClose }) {
    const [selectedId, setSelectedId] = useState(null);

    // 임시 더미 데이터
    const dummyCategories = [
        { category_id: 1, category_name: "업무" },
        { category_id: 2, category_name: "공부" },
        { category_id: 3, category_name: "운동" },
        { category_id: 4, category_name: "취미" },
    ];

    const listToRender = categories.length ? categories : dummyCategories;

    const handleSelect = (cat) => {
        setSelectedId(cat.category_id); // 선택 상태 업데이트
        if (onSelect) onSelect(cat); // 부모로 전달
    };

    return (
        <div className="category-popup" onMouseLeave={onClose}>
            {listToRender.map((cat) => {
                const isSelected = cat.category_id === selectedId;
                return (
                    <div
                        key={cat.category_id}
                        className="category-popup-item"
                        onClick={() => handleSelect(cat)}
                        style={{
                            fontFamily: "Pretendard",
                            fontSize: "12px",
                            fontWeight: isSelected ? 700 : 400,
                            lineHeight: "14px",
                            color: isSelected ? "var(--Grey-Dark, #595959)" : "#2a2a2a",
                        }}
                    >
                        <svg className="category-popup-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M13.3333 3H6.66667C6.22464 3 5.80072 3.15218 5.48816 3.42307C5.17559 3.69395 5 4.06135 5 4.44444V16L10 13.8333L15 16V4.44444C15 4.06135 14.8244 3.69395 14.5118 3.42307C14.1993 3.15218 13.7754 3 13.3333 3Z" stroke="#777777" stroke-linecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="category-popup-text">{cat.category_name}</span>
                    </div>
                );
            })}
        </div>
    );
}
