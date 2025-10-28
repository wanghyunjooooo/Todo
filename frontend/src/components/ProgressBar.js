// src/components/ProgressBar.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import ArrowIcon from "../assets/icon-arrow-right.svg";

function ProgressBar({ userId }) {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("weekly"); // "weekly" 또는 "monthly"

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("토큰이 없습니다.");

        const url = `http://localhost:8080/tasks/stats/${period}/${userId}`;

        // 기간에 따른 body
        let body;
        const today = new Date();
        if (period === "weekly") {
          const start = new Date(today);
          start.setDate(today.getDate() - 6); // 지난 7일
          body = {
            start_date: start.toISOString().split("T")[0],
            end_date: today.toISOString().split("T")[0],
          };
        } else {
          const start = new Date(today.getFullYear(), today.getMonth(), 1); // 이번 달 1일
          const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 이번 달 마지막 날
          body = {
            start_date: start.toISOString().split("T")[0],
            end_date: end.toISOString().split("T")[0],
          };
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.post(url, body, { headers });
        setStats(response.data);
      } catch (err) {
        console.error("Axios 에러:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, [userId, period]);

  if (!stats) return <div>로딩중...</div>;

  const completed = stats?.summary?.completed ?? 0;
  const total = stats?.summary?.total_tasks ?? 0;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  const categories = stats?.categories || [];

  // 라벨 생성 (주간: 월~일, 월간: 1~말일)
  const labels =
    period === "weekly"
      ? ["월", "화", "수", "목", "금", "토", "일"]
      : (() => {
          const today = new Date();
          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
          return Array.from({ length: daysInMonth }, (_, i) => i + 1);
        })();

  // 막대 너비와 간격 계산
  const totalBars = labels.length;
  const svgWidth = 233;
  const barGap = 5; // 막대 간격
  const barWidth = (svgWidth - barGap * (totalBars - 1)) / totalBars;

  return (
    <div
      style={{
        display: "flex",
        width: "350px",
        padding: "21px 20px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <span
        style={{
          fontFamily: "Pretendard",
          fontSize: "14px",
          fontWeight: 600,
          color: "#2A2A2A",
        }}
      >
        달성률 통계 ({Math.round(completionRate)}%)
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "310px",
          padding: "20px",
          gap: "20px",
          background: "#F3F3F3",
          borderRadius: "8px",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span
            style={{
              fontFamily: "Pretendard",
              fontSize: "14px",
              fontWeight: 600,
              color: "#2A2A2A",
            }}
          >
            {period === "weekly" ? "주간 통계" : "월간 통계"}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img
              src={ArrowIcon}
              alt="weekly"
              style={{ width: "20px", height: "20px", transform: "rotate(180deg)", cursor: "pointer" }}
              onClick={() => setPeriod("weekly")}
            />
            <img
              src={ArrowIcon}
              alt="monthly"
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
              onClick={() => setPeriod("monthly")}
            />
          </div>
        </div>

        <svg width="100%" height="140" viewBox={`0 0 ${svgWidth} 140`} fill="none">
          <line x1="0.5" y1="0" x2="0.5" y2="123" stroke="black" />
          <line x1="0" y1="123.5" x2={svgWidth} y2="123.5" stroke="black" />

          {categories.map((cat, idx) => {
            const x = idx * (barWidth + barGap);
            const height = total > 0 ? (cat.count / total) * 123 : 0;
            const y = 123 - height;
            return <rect key={idx} x={x} y={y} width={barWidth} height={height} fill="#36A862" />;
          })}
        </svg>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: "10px",
            color: "#2A2A2A",
            fontFamily: "Pretendard",
            fontWeight: 600,
            flexWrap: "wrap",
          }}
        >
          {labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
