// src/pages/Notifications.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CheckIcon from "../assets/Vector.svg";
import api from "../api";
import "./Notifications.css";
import DOMPurify from "dompurify"; // 🔹 보안용 (XSS 방지)

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const userId = localStorage.getItem("user_id");

    // 🔹 알림 전체 조회
    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                const res = await api.get(`/notifications/${userId}`);
                const mapped = res.data.map((n) => {
                    const mark = n.status === "읽음" ? "" : "＊"; // 읽지 않은 알림에만 별표
                    const safeTask = DOMPurify.sanitize(n.task_name); // 보안 처리
                    return {
                        id: n.notification_id,
                        date: n.task_date,
                        text: `오늘의 To Do ${mark ? "<b>*</b>" : ""}<br><li>${safeTask}</li>`,
                        read: n.status === "읽음",
                        selected: false,
                    };
                });
                setNotifications(mapped);
            } catch (err) {
                console.error("알림 불러오기 실패:", err);
            }
        };

        fetchNotifications();
    }, [userId]);

    // 🔹 클릭 시 개별 알림 읽음 처리
    const handleNotificationClick = async (notificationId) => {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
        } catch (err) {
            console.error("알림 읽음 처리 실패:", err);
        }
    };

    // 🔹 선택 토글
    const toggleSelect = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, selected: !n.selected } : n)));
    };

    // 🔹 선택 삭제 (서버 반영)
    const deleteSelected = async () => {
        const selectedIds = notifications.filter((n) => n.selected).map((n) => n.id);
        if (selectedIds.length === 0) return;

        try {
            await Promise.all(selectedIds.map((id) => api.delete(`/notifications/${id}`)));
            setNotifications((prev) => prev.filter((n) => !n.selected));
        } catch (err) {
            console.error("선택 알림 삭제 실패:", err);
        }
    };

    // 🔹 날짜별 그룹화
    const grouped = notifications.reduce((acc, n) => {
        if (!acc[n.date]) acc[n.date] = [];
        acc[n.date].push(n);
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="notifications-page">
            <Header title="알림" />

            <div className="notifications-list">
                {sortedDates.map((date) => {
                    const isToday = new Date(date).toDateString() === new Date().toDateString();

                    return (
                        <div key={date} className="notification-group">
                            <div className="notification-group-header">
                                <div className="notification-date">
                                    {new Date(date).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>

                                {/* ✅ 오늘 날짜일 때만 버튼 표시 */}
                                {isToday && (
                                    <div className="notifications-actions">
                                        <div className="action-button" onClick={() => setNotifications((prev) => prev.map((n) => (n.date === date ? { ...n, selected: true } : n)))}>
                                            전체선택
                                        </div>
                                        <div className="action-button">읽음</div>
                                        <div
                                            className="action-button"
                                            onClick={() => {
                                                const selectedIds = notifications.filter((n) => n.date === date && n.selected).map((n) => n.id);
                                                if (selectedIds.length === 0) return;
                                                Promise.all(selectedIds.map((id) => api.delete(`/notifications/${id}`)))
                                                    .then(() => {
                                                        setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
                                                    })
                                                    .catch((err) => console.error("선택 알림 삭제 실패:", err));
                                            }}
                                        >
                                            삭제
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 알림 리스트 */}
                            {grouped[date].map((n) => (
                                <div key={n.id} className={`notification-item ${n.read ? "read" : ""}`} onClick={() => handleNotificationClick(n.id)}>
                                    <div
                                        className={`notification-select ${n.selected ? "selected" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelect(n.id);
                                        }}
                                    >
                                        {n.selected && <img src={CheckIcon} alt="check" className="checkmark" />}
                                    </div>

                                    {/* ✅ HTML 태그 렌더링 */}
                                    <span
                                        className="notification-text"
                                        dangerouslySetInnerHTML={{
                                            __html: n.text,
                                        }}
                                    ></span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Notifications;
