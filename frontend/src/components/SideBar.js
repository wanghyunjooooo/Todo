import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutBox from "./LogoutBox";
import api from "../api"; // JWT 포함 Axios
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [addingCategory, setAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    // ✅ 서버에서 실제 카테고리 불러오기
    useEffect(() => {
        const fetchCategories = async () => {
            if (!userId) return;
            try {
                const res = await api.get(`/categories/${userId}`);
                // 예: res.data = [{category_id, category_name, ...}, ...]
                const serverCategories = res.data.map((cat) => ({
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

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const payload = {
                user_id: Number(userId),
                category_name: newCategoryName.trim(),
            };
            const res = await api.post("/categories", payload);
            console.log("카테고리 추가 결과:", res.data);

            const newCat = {
                id: res.data.category.category_id,
                name: res.data.category.category_name,
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
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-content">
                    <button className="sidebar-menu-item" onClick={() => navigate("/edit-profile")}>
                        <span>회원 정보</span>
                        <svg className="sidebar-menu-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M8 14L12 10L8 6" stroke="#2A2A2A" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button className="sidebar-menu-item">TODAY</button>
                    <button className="sidebar-menu-item">카테고리</button>

                    <div className="category-list">
                        {categories.map((cat) => (
                            <div key={cat.id} className="category-item">
                                {cat.name}
                            </div>
                        ))}

                        {addingCategory && (
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="이름을 입력해주세요."
                                autoFocus
                                style={{
                                    width: "60%",
                                    padding: "6px 10px",
                                    marginBottom: "8px",
                                    borderRadius: "16px",
                                    border: "none",
                                    backgroundColor: "#EBF6EF",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        )}

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

            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            {showLogoutModal && <LogoutBox onClose={() => setShowLogoutModal(false)} />}
        </>
    );
}

export default Sidebar;
