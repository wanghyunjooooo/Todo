// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutBox from "./LogoutBox";
import api, { getCategories, addCategory } from "../api";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [addingCategory, setAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    // 서버 카테고리 불러오기
    useEffect(() => {
        const fetchCategories = async () => {
            if (!userId) return;
            try {
                const data = await getCategories(userId);
                const serverCategories = data.map((cat) => ({
                    id: cat.category_id,
                    name: cat.category_name,
                }));
                setCategories(serverCategories);
            } catch (err) {
                console.error("카테고리 불러오기 실패:", err);
            }
        };
        fetchCategories();
    }, [userId]);

    // 새 카테고리 추가
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await addCategory(userId, newCategoryName.trim());
            const newCat = {
                id: res.category.category_id,
                name: res.category.category_name,
            };
            setCategories([...categories, newCat]);
            setNewCategoryName("");
            setAddingCategory(false);
        } catch (err) {
            console.error("카테고리 추가 실패:", err);
            alert("카테고리 추가에 실패했습니다.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleAddCategory();
        else if (e.key === "Escape") setAddingCategory(false);
    };

    // 카테고리 클릭 시 이동
    const handleCategoryClick = (catId) => {
        if (catId === "none") {
            navigate(`/tasks/none`); // category_id null 작업
        } else {
            navigate(`/tasks/${catId}`);
        }
        onClose();
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-content">
                    {/* 회원 정보 */}
                    <button className="sidebar-menu-item" onClick={() => navigate("/edit-profile")}>
                        <span>회원 정보</span>
                        <svg className="sidebar-menu-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M8 14L12 10L8 6" stroke="#2A2A2A" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* TODAY */}
                    <button
                        className="sidebar-menu-item"
                        onClick={() => {
                            navigate("/"); // 홈 페이지
                            onClose();
                        }}
                    >
                        TODAY
                    </button>

                    <div className="category-list-container">
                        <button className="sidebar-menu-item" style={{ border: "0px" }}>
                            카테고리
                        </button>

                        {/* 카테고리 리스트 */}
                        <div className="sidebar-category-list">
                            {/* 항상 표시되는 작업 카테고리 */}
                            <div className="sidebar-item" onClick={() => handleCategoryClick("none")}>
                                작업
                            </div>

                            {/* 서버에서 받아온 카테고리 */}
                            {categories.map((cat) => (
                                <div key={cat.id} className="sidebar-item" onClick={() => handleCategoryClick(cat.id)} style={{ cursor: "pointer" }}>
                                    {cat.name}
                                </div>
                            ))}

                            {/* 새 카테고리 추가 input */}
                            {addingCategory && (
                                <input
                                    className="sidebar-input"
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    onBlur={(e) => {
                                        if (e.target.value !== "") handleAddCategory();
                                        else setAddingCategory(false);
                                    }}
                                    placeholder="이름을 입력해주세요."
                                    autoFocus
                                />
                            )}
                        </div>

                        {/* 새 카테고리 추가 버튼 */}
                        <button className="category-add" onClick={() => setAddingCategory(true)}>
                            <span>새 카테고리 추가하기</span>
                            <svg className="category-plus-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5 10H15" stroke="#297E4A" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 5V15" stroke="#297E4A" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <button className="sidebar-logout" onClick={() => setShowLogoutModal(true)}>
                    로그아웃
                </button>
            </div>

            {/* overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            {/* 로그아웃 모달 */}
            {showLogoutModal && <LogoutBox onClose={() => setShowLogoutModal(false)} />}
        </>
    );
}

export default Sidebar;
