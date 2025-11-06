// src/components/CategoryPopup.js
import React, { useState, useEffect } from "react";
import { getCategories } from "../api";
import "./CategoryPopup.css";

export default function CategoryPopup({
    categories: propCategories = [],
    onSelect,
    onClose,
    selectedCategory,
}) {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(
        selectedCategory?.category_id ?? "none"
    );

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (propCategories.length > 0) {
                    setCategories([
                        { category_id: null, category_name: "작업" },
                        ...propCategories,
                    ]);
                    return;
                }

                const userId = localStorage.getItem("user_id") || 1;
                const data = await getCategories(userId);

                const updated = [
                    { category_id: null, category_name: "작업" },
                    ...(Array.isArray(data) ? data : []),
                ];

                setCategories(updated);
            } catch (error) {
                console.error("카테고리 불러오기 실패:", error);
            }
        };

        fetchCategories();
    }, [propCategories]);

    const handleSelect = (cat) => {
        const id = cat.category_id ?? "none";
        setSelectedId(id);

        if (onSelect)
            onSelect({ ...cat, category_id: cat.category_id ?? null });
        if (onClose) onClose();
    };

    return (
        <div className="category-popup" onMouseLeave={onClose}>
            {categories.length === 0 ? (
                <div className="category-popup-empty"></div>
            ) : (
                categories.map((cat) => {
                    const id = cat.category_id ?? "none";
                    const isSelected = id === selectedId;

                    return (
                        <div
                            key={id}
                            className={`category-popup-item ${
                                isSelected ? "selected" : ""
                            }`}
                            onClick={() => handleSelect(cat)}
                        >
                            <svg
                                className="category-popup-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                            >
                                <path d="M13.3333 3H6.66667C6.22464 3 5.80072 3.15218 5.48816 3.42307C5.17559 3.69395 5 4.06135 5 4.44444V16L10 13.8333L15 16V4.44444C15 4.06135 14.8244 3.69395 14.5118 3.42307C14.1993 3.15218 13.7754 3 13.3333 3Z" />
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
