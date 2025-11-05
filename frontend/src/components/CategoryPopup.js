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
                            color: isSelected
                                ? "var(--Grey-Dark, #595959)"
                                : "#2a2a2a",
                        }}
                    >
                        <img
                            src={TaskIcon}
                            alt="task"
                            className="category-popup-icon"
                            style={{
                                width: "17px",
                                height: "17px",
                                flexShrink: 0,
                                aspectRatio: "1/1",
                                marginRight: "6px",
                                filter: isSelected
                                    ? "invert(38%) sepia(35%) saturate(1990%) hue-rotate(103deg) brightness(91%) contrast(92%)"
                                    : "none",
                                // 선택시 초록색 느낌, 필요하면 svg 직접 색 채우는 방법도 있음
                            }}
                        />
                        <span className="category-popup-text">
                            {cat.category_name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
