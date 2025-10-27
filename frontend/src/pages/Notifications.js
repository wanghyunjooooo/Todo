import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CheckIcon from "../assets/Vector.svg"; // ✅ check.svg import
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const mockData = [
      { id: 1, date: "2025-10-27", text: "할 일 마감 알림", read: false, selected: false },
      { id: 2, date: "2025-10-27", text: "회의 알림", read: false, selected: false },
      { id: 3, date: "2025-10-26", text: "새로운 공지 알림", read: true, selected: false },
      { id: 4, date: "2025-10-25", text: "업데이트 알림", read: false, selected: false },
    ];
    setNotifications(mockData);
  }, []);

  const toggleSelect = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, selected: !n.selected } : n))
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const markSelectedRead = () => {
    setNotifications(prev => prev.map(n => (n.selected ? { ...n, read: true } : n)));
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !n.selected));
  };

  const grouped = notifications.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="notifications-page">
      <Header title="알림" />

      {/* 상단 영역 */}
      <div className="notifications-header">
        <span className="notifications-date">{sortedDates[0] || ""}</span>

        <div className="notifications-actions">
          <div className="action-button" onClick={() => setNotifications(prev => prev.map(n => ({ ...n, selected: true })))}>
            전체선택
          </div>
          <div className="action-button" onClick={markSelectedRead}>
            읽음
          </div>
          <div className="action-button" onClick={deleteSelected}>
            삭제
          </div>
        </div>
      </div>

      {/* 알림 리스트 */}
      <div className="notifications-list">
        {sortedDates.map(date => (
          <div key={date} className="notification-group">
            <div className="notification-date">{date}</div>
            {grouped[date].map(n => (
              <div
                key={n.id}
                className={`notification-item ${n.read ? "read" : ""}`}
              >
                <div
                  className={`notification-select ${n.selected ? "selected" : ""}`}
                  onClick={() => toggleSelect(n.id)}
                >
                  {/* check.svg 아이콘 사용 */}
                  {n.selected && <img src={CheckIcon} alt="check" className="checkmark" />}
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
