// src/components/CategoryPopup.js
import React, { useState, useEffect } from "react";
import { getCategories } from "../api"; // ✅ api.js에서 불러옴
import "./CategoryPopup.css";

export default function CategoryPopup({ onSelect, onClose }) {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const userId = 1; // ✅ 실제로는 로그인 시 저장된 user_id 사용
                const data = await getCategories(userId);
                setCategories(data);
            } catch (error) {
                console.error("❌ 카테고리 불러오기 실패:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSelect = (cat) => {
        setSelectedId(cat.category_id);
        if (onSelect) onSelect(cat); // ✅ 부모 컴포넌트로 전달
    };

    return (
        <div className="category-popup" onMouseLeave={onClose}>
            {categories.length === 0 ? (
                <div className="category-popup-empty">카테고리가 없습니다.</div>
            ) : (
                categories.map((cat) => {
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
                            <svg
                                className="category-popup-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <path
                                    d="M13.3333 3H6.66667C6.22464 3 5.80072 3.15218 5.48816 3.42307C5.17559 3.69395 5 4.06135 5 4.44444V16L10 13.8333L15 16V4.44444C15 4.06135 14.8244 3.69395 14.5118 3.42307C14.1993 3.15218 13.7754 3 13.3333 3Z"
                                    stroke="#777777"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="category-popup-text">
                                {cat.category_name}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
}
