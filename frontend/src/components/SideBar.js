import React, { useState } from "react";
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg";
import { ReactComponent as PlusIcon } from "../assets/plus.svg";
import LogoutBox from "./LogoutBox"; // 임포트
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const categories = [
        { id: 1, name: "업무" },
        { id: 2, name: "공부" },
        { id: 3, name: "운동" },
        { id: 4, name: "취미" },
    ];

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-content">
                    <button className="sidebar-menu-item">
                        <span>회원 정보</span>
                        <ArrowIcon className="sidebar-menu-arrow" />
                    </button>
                    <button className="sidebar-menu-item">TODAY</button>
                    <button className="sidebar-menu-item">카테고리</button>

                    <div className="category-list">
                        {categories.map((cat) => (
                            <div key={cat.id} className="category-item">
                                {cat.name}
                            </div>
                        ))}

                        <button className="category-add">
                            <span>새 카테고리 추가하기</span>
                            <PlusIcon className="category-plus-icon" />
                        </button>
                    </div>
                </div>

                <button
                    className="sidebar-logout"
                    onClick={() => setShowLogoutModal(true)}
                >
                    로그아웃
                </button>
            </div>

            {isOpen && (
                <div className="sidebar-overlay" onClick={onClose}></div>
            )}

            {/* 로그아웃 모달 import로 불러오기 */}
            {showLogoutModal && (
                <LogoutBox onClose={() => setShowLogoutModal(false)} />
            )}
        </>
    );
}

export default Sidebar;
