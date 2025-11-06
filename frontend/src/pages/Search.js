import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchTasksByDate, searchTasksByKeyword, updateTaskStatus, getCategories } from "../api"; // ✅ getCategories 추가
import SearchIcon from "../assets/search.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import "./SearchPage.css";

function SearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date] = useState(new Date().toISOString().split("T")[0]);
    const userId = localStorage.getItem("user_id");
    const [categories] = useState([]);

    const handleGoBack = () => navigate(-1);
    const handleInputChange = (e) => setQuery(e.target.value);

    useEffect(() => {
        if (!tasks.length || !categories.length) return;
        setTasks((prev) =>
            prev.map((t) => ({
                ...t,
                category_name: t.category_name ?? getCategoryName(t),
            }))
        );
    }, [categories]);

    const getCategoryName = (t) => {
        if (t.category?.category_name) return t.category.category_name;

        if (t.category_id) {
            const found = categories.find((c) => c.category_id === t.category_id);
            if (found) return found.category_name;
        }

        return "작업";
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr.padStart(2, "0");
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${ampm} ${hour}:${minute}`;
    };

    const handleSearch = async () => {
        if (!userId) return alert("로그인이 필요합니다.");
        setLoading(true);

        try {
            let response;
            if (query.trim() === "") {
                response = await searchTasksByDate(userId, date);
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(query.trim())) {
                response = await searchTasksByDate(userId, query.trim());
            } else {
                response = await searchTasksByKeyword(userId, query.trim());
            }

            const mapped = response.map((t) => {
                return {
                    ...t,
                    checked: t.status === "완료",
                    category_name: getCategoryName(t),
                };
            });
            console.log("검색 응답:", response);
            console.log("첫 번째 task:", response[0]);

            setTasks(mapped);
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

    // ✅ 날짜별 그룹화
    const groupByDate = (tasks) => {
        const grouped = {};
        tasks.forEach((task) => {
            const dateKey = task.task_date;
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(task);
        });
        return grouped;
    };

    // ✅ 키워드 볼드처리
    const highlightText = (text, keyword) => {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, "gi");
        return text.replace(regex, "<b>$1</b>");
    };

    const toggleChecked = async (taskId) => {
        const targetTask = tasks.find((t) => t.task_id === taskId);
        if (!targetTask) return;
        const newChecked = !targetTask.checked;

        try {
            await updateTaskStatus(taskId, {
                status: newChecked ? "완료" : "미완료",
            });
            setTasks((prev) => prev.map((t) => (t.task_id === taskId ? { ...t, checked: newChecked, status: newChecked ? "완료" : "미완료" } : t)));
        } catch (err) {
            console.error("체크 상태 업데이트 실패:", err);
        }
    };

    // ✅ 날짜 포맷 함수
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const dateObj = new Date(dateStr);
        return `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 ${dateObj.toLocaleDateString("ko-KR", {
            weekday: "long",
        })}`;
    };

    // ✅ 그룹화된 데이터 준비
    const groupedTasks = groupByDate(tasks);

    return (
        <div className="search-page">
            {/* 상단 검색 영역 */}
            <div className="search-header">
                <img src={ArrowIcon} alt="뒤로가기" className="back-icon" onClick={handleGoBack} />

                <div className="search-input-wrapper">
                    <input type="text" placeholder="검색어를 입력하세요" value={query} onChange={handleInputChange} onKeyPress={handleKeyPress} className="search-input" />
                    <img src={SearchIcon} alt="검색" className="search-icon" onClick={handleSearch} style={{ cursor: "pointer" }} />
                </div>
            </div>

            {/* 검색 결과 */}
            <div className="search-results todo-container">
                {loading ? (
                    <p>로딩 중...</p>
                ) : tasks.length === 0 ? (
                    <p className="no-task-text">검색 결과가 없습니다.</p>
                ) : (
                    Object.entries(groupedTasks).map(([dateKey, dateTasks]) => (
                        <div key={dateKey} style={{ display: "flex", width: "350px", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                            <div
                                style={{
                                    alignSelf: "stretch",
                                    color: "var(--Grey-Darker, #2A2A2A)",
                                    fontFamily: "Pretendard",
                                    fontSize: "14px",
                                    fontStyle: "normal",
                                    fontWeight: "600",
                                    lineHeight: "normal",
                                }}
                            >
                                {formatDate(dateKey)}
                            </div>

                            {dateTasks.map((task) => (
                                <div key={task.task_id} className={`task-item ${task.checked ? "checked" : ""}`}>
                                    <div className="task-content">
                                        <div className="task-left">
                                            <button className={`task-check-btn ${task.checked ? "checked" : ""}`} onClick={() => toggleChecked(task.task_id)}>
                                                {task.checked && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                                        <rect width="20" height="20" rx="10" fill="#36A862" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M15.8 7.18c.13.12.2.28.2.44 0 .17-.07.33-.2.45l-6.15 5.76a.66.66 0 0 1-.47.17.66.66 0 0 1-.47-.17L5.2 10.52a.66.66 0 0 1-.14-.36c0-.13.03-.25.09-.36a.6.6 0 0 1 .26-.24.7.7 0 0 1 .46-.05.7.7 0 0 1 .39.2l3.05 2.86 5.7-5.39a.66.66 0 0 1 .94.04z" fill="#fff" />
                                                    </svg>
                                                )}
                                            </button>
                                            <span
                                                className={`task-text-btn ${task.status === "완료" ? "checked" : ""}`}
                                                style={{
                                                    color: "var(--Grey-Darker, #2A2A2A)",
                                                    textAlign: "center",
                                                    fontFamily: "Pretendard",
                                                    fontSize: "14px",
                                                    fontStyle: "normal",
                                                    fontWeight: "400",
                                                    lineHeight: "20px",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: highlightText(task.task_name, query.trim()),
                                                }}
                                            />
                                        </div>

                                        {task.category_name && (
                                            <div className="task-category-content">
                                                <svg className="task-time-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M13.3333 3H6.66667C6.22464 3 5.80072 3.15218 5.48816 3.42307C5.17559 3.69395 5 4.06135 5 4.44444V16L10 13.8333L15 16V4.44444C15 4.06135 14.8244 3.69395 14.5118 3.42307C14.1993 3.15218 13.7754 3 13.3333 3Z" stroke="#777777" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span className="task-memo">{task.category_name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {task.memo && (
                                        <div className="task-memo-content">
                                            <svg className="task-time-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path
                                                    d="M5.13889 7.35294H14.8611M5 8.55529C5 7.31118 5 6.68882 5.24222 6.21353C5.46125 5.78959 5.80111 5.44971 6.21333 5.24235C6.68889 5 7.31111 5 8.55556 5H11.4444C12.6889 5 13.3111 5 13.7867 5.24235C14.205 5.45529 14.5444 5.79529 14.7578 6.21294C15 6.68941 15 7.31176 15 8.55588V11.4453C15 12.6894 15 13.3118 14.7578 13.7871C14.5388 14.211 14.1989 14.5509 13.7867 14.7582C13.3111 15 12.6889 15 11.4444 15H8.55556C7.31111 15 6.68889 15 6.21333 14.7576C5.80119 14.5504 5.46134 14.2108 5.24222 13.7871C5 13.3106 5 12.6882 5 11.4441V8.55529Z"
                                                    stroke="#595959"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M8 10H12" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8 12H12" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="task-memo">{task.memo}</p>
                                        </div>
                                    )}

                                    {task.notification_type === "알림" && task.notification_time && (
                                        <div className="task-time-content">
                                            <svg className="task-time-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10 15.5C12.76 15.5 15 13.26 15 10.5C15 7.74 12.76 5.5 10 5.5C7.24 5.5 5 7.74 5 10.5C5 13.26 7.24 15.5 10 15.5Z" stroke="#595959" />
                                                <path d="M10 8.333V10.555L11.389 11.944" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="task-time">{formatTime(task.notification_time)}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SearchPage;
