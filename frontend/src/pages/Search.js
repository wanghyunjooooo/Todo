// src/pages/SearchPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTasksByDate, searchTasksByKeyword } from "../api"; // api.js에서 불러오기
import SearchIcon from "../assets/search.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import "./SearchPage.css";

function SearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState(""); // 검색어
    const [tasks, setTasks] = useState([]); // API에서 받은 할 일 리스트
    const [loading, setLoading] = useState(false);

    const userId = 1; // 실제 유저 ID를 여기서 가져오거나 Context/State에서 받아오기
    const date = "2025-11-05"; // 기본 날짜 (필요하면 동적 선택 가능)

    const handleGoBack = () => navigate(-1);

    const handleInputChange = (e) => setQuery(e.target.value);

    const handleSearch = async () => {
        setLoading(true);
        try {
            let response = [];

            if (query.trim() === "") {
                // 검색어가 없으면 날짜 기준 검색
                response = await searchTasksByDate(userId, date);
            } else {
                // 검색어가 있으면 키워드 검색
                response = await searchTasksByKeyword(userId, query);
            }

            setTasks(response);
        } catch (error) {
            console.error("검색 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="search-page">
            {/* 상단 헤더 */}
            <div className="search-header">
                <button className="back-button" onClick={handleGoBack}>
                    <img src={ArrowIcon} alt="뒤로가기" className="back-icon" />
                </button>

                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={query}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="search-input"
                    />
                    <img
                        src={SearchIcon}
                        alt="검색"
                        className="search-icon"
                        onClick={handleSearch} // 클릭으로도 검색 가능
                        style={{ cursor: "pointer" }}
                    />
                </div>
            </div>

            {/* 검색 결과 영역 */}
            <div className="search-results">
                {loading ? (
                    <p>로딩 중...</p>
                ) : tasks.length > 0 ? (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.task_id}>
                                <strong>{task.task_name}</strong> -{" "}
                                {task.status}
                                {task.category && (
                                    <span>
                                        {" "}
                                        ({task.category.category_name})
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
