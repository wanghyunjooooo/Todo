// src/pages/Notifications.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CheckIcon from "../assets/Vector.svg";
import api from "../api";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId"); // ✅ 로그인 시 저장된 userId 사용

  // 🔹 알림 전체 조회
  useEffect(() => {
    console.log("📌 useEffect 실행됨. userId =", userId);
    if (!userId) {
      console.warn("⚠️ 로그인 정보가 없습니다. userId 없음");
      return;
    }

    const fetchNotifications = async () => {
      try {
        // ✅ 요청 전 토큰 확인
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ 토큰이 존재하지 않습니다.");
          return;
        }
        console.log("🔑 현재 저장된 토큰:", token);

        // 🔹 토큰을 명시적으로 헤더에 붙여 요청
        const res = await api.get(`/notifications/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ 서버 응답 전체:", res);
        console.log("📦 응답 데이터:", res.data);

        // 🔸 클라이언트 표시용 변환
        const mapped = res.data.map((n) => ({
          id: n.notification_id,
          date: n.task_date,
          text: `${n.task_name} (${n.category_name})`,
          read: n.status === "읽음",
          selected: false,
        }));

        console.log("🧩 매핑된 알림 데이터:", mapped);
        setNotifications(mapped);
      } catch (err) {
        console.error("❌ 알림 불러오기 실패:", err);
        console.error("🔍 Axios Error Response:", err.response);
        console.error("🔍 Error Headers:", err.response?.headers);
        console.error("🔍 Error Status:", err.response?.status);
        console.error("🔍 Error Data:", err.response?.data);
      }
    };

    fetchNotifications();
  }, [userId]);

  // 🔹 선택 토글
  const toggleSelect = (id) => {
    console.log(`🟢 알림 선택 토글: id=${id}`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, selected: !n.selected } : n))
    );
  };

  // 🔹 선택 읽음 처리
  const markSelectedRead = () => {
    console.log("🟡 선택된 항목 읽음 처리");
    setNotifications((prev) =>
      prev.map((n) => (n.selected ? { ...n, read: true } : n))
    );
  };

  // 🔹 선택 삭제
  const deleteSelected = () => {
    console.log("🔴 선택된 항목 삭제");
    setNotifications((prev) => prev.filter((n) => !n.selected));
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

      {/* 상단 버튼 */}
      <div className="notifications-header">
        <span className="notifications-date">{sortedDates[0] || ""}</span>
        <div className="notifications-actions">
          <div
            className="action-button"
            onClick={() =>
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, selected: true }))
              )
            }
          >
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

      {/* 알림 목록 */}
      <div className="notifications-list">
        {sortedDates.map((date) => (
          <div key={date} className="notification-group">
            <div className="notification-date">{date}</div>
            {grouped[date].map((n) => (
              <div
                key={n.id}
                className={`notification-item ${n.read ? "read" : ""}`}
              >
                <div
                  className={`notification-select ${
                    n.selected ? "selected" : ""
                  }`}
                  onClick={() => toggleSelect(n.id)}
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
