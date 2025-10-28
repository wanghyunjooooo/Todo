// src/pages/Notifications.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CheckIcon from "../assets/Vector.svg";
import api from "../api";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("user_id");

  // 🔹 알림 전체 조회
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/notifications/${userId}`);
        const mapped = res.data.map((n) => ({
          id: n.notification_id,
          date: n.task_date,
          text: `${n.task_name} (${n.category_name})`,
          read: n.status === "읽음",
          selected: false,
        }));
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
  const deleteSelected = async () => {
    const selectedIds = notifications.filter((n) => n.selected).map((n) => n.id);
    if (selectedIds.length === 0) return;

    try {
      await Promise.all(
        selectedIds.map((id) => api.delete(`/notifications/${id}`))
      );

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

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="notifications-page">
      <Header title="알림" />

      <div className="notifications-header">
        <span className="notifications-date">{sortedDates[0] || ""}</span>
        <div className="notifications-actions">
          <div
            className="action-button"
            onClick={() =>
              setNotifications((prev) => prev.map((n) => ({ ...n, selected: true })))
            }
          >
            전체선택
          </div>
          <div className="action-button" onClick={deleteSelected}>
            삭제
          </div>
        </div>
      </div>

      <div className="notifications-list">
        {sortedDates.map((date) => (
          <div key={date} className="notification-group">
            <div className="notification-date">{date}</div>
            {grouped[date].map((n) => (
              <div
                key={n.id}
                className={`notification-item ${n.read ? "read" : ""}`}
                onClick={() => handleNotificationClick(n.id)}
              >
                <div
                  className={`notification-select ${n.selected ? "selected" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(n.id);
                  }}
                >
                  {n.selected && (
                    <img src={CheckIcon} alt="check" className="checkmark" />
                  )}
                </div>
                <span className="notification-text">{n.text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
