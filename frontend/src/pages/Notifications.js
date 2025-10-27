// pages/Notifications.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header"; // 기존 Header 가져오기

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const mockData = [
      { id: 1, date: "2025-10-27", text: "할 일 마감 알림", read: false },
      { id: 2, date: "2025-10-27", text: "회의 알림", read: false },
      { id: 3, date: "2025-10-26", text: "새로운 공지 알림", read: true },
      { id: 4, date: "2025-10-25", text: "업데이트 알림", read: false },
    ];
    setNotifications(mockData);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // 날짜별 그룹화
  const grouped = notifications.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div style={{ paddingBottom: "100px" }}>
      <Header title="알림" /> {/* 기존 Header 사용 */}

      <div style={{ padding: "16px", display: "flex", gap: "8px", marginTop: "8px" }}>
        <button onClick={markAllRead} style={{ flex: 1 }}>전체 읽음</button>
        <button onClick={deleteAll} style={{ flex: 1 }}>삭제</button>
      </div>

      <div style={{ marginTop: "16px" }}>
        {sortedDates.map((date) => (
          <div key={date} style={{ marginBottom: "24px" }}>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>{date}</div>
            {grouped[date].map((n) => (
              <div
                key={n.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                  marginBottom: "6px",
                  opacity: n.read ? 0.5 : 1,
                }}
              >
                <span>{n.text}</span>
                <button onClick={() => deleteNotification(n.id)}>삭제</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
