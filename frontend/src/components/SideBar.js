import React from "react";
import { ReactComponent as ArrowIcon } from "../assets/icon-arrow-right.svg"; // 회원 정보 화살표
import { ReactComponent as PlusIcon } from "../assets/plus.svg"; // 새 카테고리 플러스 아이콘
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
    // 임시 카테고리 목록
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
                {/* 메뉴 */}
                <div className="sidebar-content">
                    <button className="sidebar-menu-item">
                        <span>회원 정보</span>
                        <ArrowIcon className="sidebar-menu-arrow" />
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
                            <PlusIcon className="category-plus-icon" />
                        </button>
                    </div>
                </div>

                {/* 하단 로그아웃 */}
                <button className="sidebar-logout">로그아웃</button>
            </div>

            {/* 오버레이 */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={onClose}></div>
            )}
        </>
    );
}

export default Sidebar;
