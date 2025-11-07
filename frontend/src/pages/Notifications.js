import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 이거 빠져있었음!
import Header from "../components/Header";
import CheckIcon from "../assets/Vector.svg";
import api from "../api";
import "./Notifications.css";
import DOMPurify from "dompurify"; // 🔹 보안용 (XSS 방지)
import ArrowIcon from "../assets/icon-arrow-right.svg"; // 🔹 화살표 아이콘
function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const userId = localStorage.getItem("user_id");
    const navigate = useNavigate();
    // 🔹 알림 전체 조회
    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                const res = await api.get(`/notifications/${userId}`);
                const mapped = res.data.map((n) => {
                    let dateStr = n.task_date;
                    if (dateStr?.includes("T")) {
                        const [datePart, timePart] = dateStr.split("T");
                        if (timePart) {
                            const [hour, minute] = timePart.split(":");
                            dateStr = `${datePart}T${hour}:${minute}:00`;
                        }
                    }

                    const mark = n.status === "읽음" ? "" : "＊";
                    const safeTask = DOMPurify.sanitize(n.task_name);

                    return {
                        id: n.notification_id,
                        date: dateStr,
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
    const deleteSelected = async (date) => {
        const selectedIds = notifications.filter((n) => n.date === date && n.selected).map((n) => n.id);
        if (selectedIds.length === 0) return;

        try {
            await Promise.all(selectedIds.map((id) => api.delete(`/notifications/${id}`)));
            setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
        } catch (err) {
            console.error("선택 알림 삭제 실패:", err);
        }
    };

    // 🔹 선택 읽음 처리 (서버 반영) + 체크 해제
    const markSelectedAsRead = async (date) => {
        const selectedIds = notifications.filter((n) => n.date === date && n.selected && !n.read).map((n) => n.id);
        if (selectedIds.length === 0) return;

        try {
            await Promise.all(selectedIds.map((id) => api.patch(`/notifications/${id}/read`)));
            setNotifications((prev) =>
                prev.map((n) =>
                    selectedIds.includes(n.id)
                        ? { ...n, read: true, selected: false } // ✅ 체크 해제 추가
                        : n
                )
            );
        } catch (err) {
            console.error("선택 알림 읽음 처리 실패:", err);
        }
    };

    // 🔹 날짜별 그룹화
    const grouped = notifications.reduce((acc, n) => {
        if (!acc[n.date]) acc[n.date] = [];
        acc[n.date].push(n);
        return acc;
    }, {});

    const today = new Date().toISOString().split("T")[0];
    if (!grouped[today]) grouped[today] = [];

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    // ...생략 (import 등 동일)

    return (
        <div className="notifications-page">
            <div className="notifications-list">
                {sortedDates.map((date) => {
                    const isToday = new Date(date).toDateString() === new Date().toDateString();

                    return (
                        <div key={date} className="notification-group">
                            {/* ✅ 첫 줄: 화살표 + 알람 + 전체선택/읽음/삭제 */}
                            {isToday && (
                                <div className="notifications-actions-row">
                                    <div className="notification-title-group">
                                        {/* 🔹 화살표 아이콘 (이전 페이지 이동) */}
                                        <img
                                            src={ArrowIcon}
                                            alt="arrow"
                                            className="arrow-icon"
                                            onClick={() => navigate(-1)}
                                            style={{
                                                cursor: "pointer",
                                                transform: "rotate(180deg)",
                                                marginRight: "8px",
                                            }}
                                        />
                                        <span className="notification-title">알람</span>
                                    </div>

                                    <div className="notifications-actions">
                                        <div
                                            className="action-button"
                                            onClick={() => {
                                                const allSelected = grouped[date].every((n) => n.selected);
                                                setNotifications((prev) =>
                                                    prev.map((n) =>
                                                        n.date === date
                                                            ? {
                                                                  ...n,
                                                                  selected: !allSelected,
                                                              }
                                                            : n
                                                    )
                                                );
                                            }}
                                        >
                                            전체선택
                                        </div>
                                        <div className="action-button" onClick={() => markSelectedAsRead(date)}>
                                            읽음
                                        </div>
                                        <div className="action-button" onClick={() => deleteSelected(date)}>
                                            삭제
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ✅ 두 번째 줄: 날짜 */}
                            <div className="notification-group-header">
                                <div className="notification-date">
                                    {new Date(date).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>

                            {/* ✅ 알림 리스트 */}
                            {grouped[date].length === 0 ? (
                                <div className="no-notifications">현재 알림이 없습니다.</div>
                            ) : (
                                grouped[date].map((n) => (
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
                                        <span
                                            className="notification-text"
                                            dangerouslySetInnerHTML={{
                                                __html: n.text,
                                            }}
                                        ></span>
                                    </div>
                                ))
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Notifications;
