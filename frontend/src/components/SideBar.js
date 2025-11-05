import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 필수
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg";
import { ReactComponent as PlusIcon } from "../assets/plus.svg";
import LogoutBox from "./LogoutBox"; // 로그아웃 모달 컴포넌트
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate(); // navigate 정의

    const categories = [
        { id: 1, name: "업무" },
        { id: 2, name: "공부" },
        { id: 3, name: "운동" },
        { id: 4, name: "취미" },
    ];

    return (
        <>
            {/* 사이드바 */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-content">
                    {/* 회원 정보 클릭 시 /profile 이동 */}
                    <button className="sidebar-menu-item" onClick={() => navigate("/edit-profile")}>
                        <span>회원 정보</span>
                        <svg className="sidebar-menu-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M8 14L12 10L8 6" stroke="#2A2A2A" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>

                    <button className="sidebar-menu-item">TODAY</button>
                    <button className="sidebar-menu-item">카테고리</button>

                    {/* 카테고리 목록 */}
                    <div className="category-list">
                        {categories.map((cat) => (
                            <div key={cat.id} className="category-item">
                                {cat.name}
                            </div>
                        ))}

                        <button className="category-add">
                            <span>새 카테고리 추가하기</span>
                            <svg className="category-plus-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5 10H15" stroke="#297E4A" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M10 5V15" stroke="#297E4A" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 로그아웃 버튼 */}
                <button className="sidebar-logout" onClick={() => setShowLogoutModal(true)}>
                    로그아웃
                </button>
            </div>

            {/* 오버레이 */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            {/* 로그아웃 모달 */}
            {showLogoutModal && <LogoutBox onClose={() => setShowLogoutModal(false)} />}
        </>
    );
}

export default Sidebar;
