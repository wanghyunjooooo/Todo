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
                    // 🔹 초(:ss) 제거 — "2025-10-31T18:02:45" → "2025-10-31T18:02:00"
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
                        text: `오늘의 To Do ${
                            mark ? "<b>*</b>" : ""
                        }<br><li>${safeTask}</li>`,
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
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
        } catch (err) {
            console.error("알림 읽음 처리 실패:", err);
        }
    };

    // 🔹 선택 토글
    const toggleSelect = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, selected: !n.selected } : n))
        );
    };

    // 🔹 선택 삭제 (서버 반영)
    const deleteSelected = async (date) => {
        const selectedIds = notifications
            .filter((n) => n.date === date && n.selected)
            .map((n) => n.id);
        if (selectedIds.length === 0) return;

        try {
            await Promise.all(
                selectedIds.map((id) => api.delete(`/notifications/${id}`))
            );
            setNotifications((prev) =>
                prev.filter((n) => !selectedIds.includes(n.id))
            );
        } catch (err) {
            console.error("선택 알림 삭제 실패:", err);
        }
    };

    // 🔹 선택 읽음 처리 (서버 반영)
    const markSelectedAsRead = async (date) => {
        const selectedIds = notifications
            .filter((n) => n.date === date && n.selected && !n.read)
            .map((n) => n.id);
        if (selectedIds.length === 0) return;

        try {
            await Promise.all(
                selectedIds.map((id) => api.patch(`/notifications/${id}/read`))
            );
            setNotifications((prev) =>
                prev.map((n) =>
                    selectedIds.includes(n.id) ? { ...n, read: true } : n
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
    if (!grouped[today]) grouped[today] = []; // 오늘 날짜 그룹 항상 생성

    const sortedDates = Object.keys(grouped).sort(
        (a, b) => new Date(b) - new Date(a)
    );

    return (
        <div className="notifications-page">
            <Header showMenu={false} />

            <div className="notifications-list">
                {sortedDates.map((date) => {
                    const isToday =
                        new Date(date).toDateString() ===
                        new Date().toDateString();

                    return (
                        <div key={date} className="notification-group">
                            <div className="notification-group-header">
                                <div className="notification-date">
                                    {new Date(date).toLocaleDateString(
                                        "ko-KR",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </div>

                                {/* ✅ 오늘 날짜일 때 버튼 항상 표시 */}
                                {isToday && (
                                    <div className="notifications-actions">
                                        <div
                                            className="action-button"
                                            onClick={() => {
                                                // 현재 해당 날짜 알림이 모두 선택되어 있는지 확인
                                                const allSelected = grouped[
                                                    date
                                                ].every((n) => n.selected);
                                                setNotifications((prev) =>
                                                    prev.map((n) =>
                                                        n.date === date
                                                            ? {
                                                                  ...n,
                                                                  selected:
                                                                      !allSelected,
                                                              } // 모두 선택되어 있으면 해제, 아니면 선택
                                                            : n
                                                    )
                                                );
                                            }}
                                        >
                                            전체선택
                                        </div>
                                        <div
                                            className="action-button"
                                            onClick={() =>
                                                markSelectedAsRead(date)
                                            }
                                        >
                                            읽음
                                        </div>
                                        <div
                                            className="action-button"
                                            onClick={() => deleteSelected(date)}
                                        >
                                            삭제
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 알림 리스트 */}
                            {grouped[date].length === 0 ? (
                                <div className="no-notifications">
                                    현재 알림이 없습니다.
                                </div>
                            ) : (
                                grouped[date].map((n) => (
                                    <div
                                        key={n.id}
                                        className={`notification-item ${
                                            n.read ? "read" : ""
                                        }`}
                                        onClick={() =>
                                            handleNotificationClick(n.id)
                                        }
                                    >
                                        <div
                                            className={`notification-select ${
                                                n.selected ? "selected" : ""
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelect(n.id);
                                            }}
                                        >
                                            {n.selected && (
                                                <img
                                                    src={CheckIcon}
                                                    alt="check"
                                                    className="checkmark"
                                                />
                                            )}
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
