// src/pages/SearchPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTasksByDate, searchTasksByKeyword } from "../api";
import SearchIcon from "../assets/search.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import "./SearchPage.css";

function SearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const userId = localStorage.getItem("user_id");

    const handleGoBack = () => navigate(-1);
    const handleInputChange = (e) => setQuery(e.target.value);

    const handleSearch = async () => {
        if (!userId) return alert("로그인이 필요합니다.");
        setLoading(true);

        try {
            let response;

            if (query.trim() === "") {
                // 검색어 없으면 날짜 검색
                response = await searchTasksByDate(userId, date);
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(query.trim())) {
                // 입력값이 YYYY-MM-DD 형식이면 날짜 검색
                response = await searchTasksByDate(userId, query.trim());
            } else {
                // 단어 검색
                response = await searchTasksByKeyword(userId, query.trim());
            }

            console.log("검색 결과:", response);
            setTasks(response);
        } catch (error) {
            console.error("검색 실패:", error);
            alert("검색 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const dateObj = new Date(dateStr);
        return `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${dateObj
            .getDate()
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="search-page">
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
                        onClick={handleSearch}
                        style={{ cursor: "pointer" }}
                    />
                </div>
            </div>
            <div className="search-results todo-container">
                {loading ? (
                    <p>로딩 중...</p>
                ) : tasks.length === 0 ? (
                    <p className="no-task-text">검색 결과가 없습니다.</p>
                ) : (
                    tasks.map((task) => {
                        const taskDate = new Date(task.task_date);
                        const formattedDate = `${taskDate.getFullYear()}년 ${
                            taskDate.getMonth() + 1
                        }월 ${taskDate.getDate()}일 ${taskDate.toLocaleDateString(
                            "ko-KR",
                            { weekday: "long" }
                        )}`;

                        return (
                            <div key={task.task_id}>
                                {/* 날짜 표시 */}
                                <div
                                    style={{
                                        fontFamily: "Pretendard",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        fontStyle: "normal",
                                        lineHeight: "normal",
                                        color: "#2A2A2A",
                                        marginBottom: "6px",
                                    }}
                                >
                                    {formattedDate}
                                </div>

                                {/* 기존 Todo task 디자인 유지 */}
                                <div
                                    className={`task-item ${
                                        task.status === "완료" ? "checked" : ""
                                    }`}
                                >
                                    <div className="task-content">
                                        <div className="task-left">
                                            <button
                                                className={`task-check-btn ${
                                                    task.status === "완료"
                                                        ? "checked"
                                                        : ""
                                                }`}
                                            >
                                                {task.status === "완료" && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <rect
                                                            width="20"
                                                            height="20"
                                                            rx="10"
                                                            fill="#36A862"
                                                        />
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M15.8 7.18c.13.12.2.28.2.44 0 .17-.07.33-.2.45l-6.15 5.76a.66.66 0 0 1-.47.17.66.66 0 0 1-.47-.17L5.2 10.52a.66.66 0 0 1-.14-.36c0-.13.03-.25.09-.36a.6.6 0 0 1 .26-.24.7.7 0 0 1 .46-.05.7.7 0 0 1 .39.2l3.05 2.86 5.7-5.39a.66.66 0 0 1 .94.04z"
                                                            fill="#fff"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                            <span
                                                className={`task-text-btn ${
                                                    task.status === "완료"
                                                        ? "checked"
                                                        : ""
                                                }`}
                                                style={{
                                                    fontFamily: "Pretendard",
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    fontStyle: "normal",
                                                    lineHeight: "normal",
                                                    color:
                                                        task.status === "완료"
                                                            ? "#888"
                                                            : "#2A2A2A",
                                                    textDecoration:
                                                        task.status === "완료"
                                                            ? "line-through"
                                                            : "none",
                                                }}
                                            >
                                                {task.task_name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default SearchPage;
