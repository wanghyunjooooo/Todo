// src/components/ProgressBar.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import ArrowIcon from "../assets/icon-arrow-right.svg";

function ProgressBar({ userId }) {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("weekly");
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("토큰이 없습니다.");

        const url = `http://localhost:8080/tasks/stats/${period}/${userId}`;
        const today = new Date();
        let body;

        if (period === "weekly") {
          const start = new Date(today);
          start.setDate(today.getDate() - 6);
          body = {
            start_date: start.toISOString().split("T")[0],
            end_date: today.toISOString().split("T")[0],
          };
        } else {
          const start = new Date(today.getFullYear(), today.getMonth(), 1);
          const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
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

  const labels =
    period === "weekly"
      ? ["월", "화", "수", "목", "금", "토", "일"]
      : (() => {
          const today = new Date();
          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
          return Array.from({ length: daysInMonth }, (_, i) => i + 1);
        })();

  const totalBars = labels.length;
  const svgWidth = 233;
  const barGap = 2; // 막대 간격 좁힘
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
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  fill={hoverIndex === idx ? "#2D8659" : "#36A862"}
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
                {hoverIndex === idx && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#2A2A2A"
                    fontWeight="600"
                  >
                    {cat.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

{/* ✅ 월간은 1,5,10... + 마지막 날만 표시 (30,31 중복 방지) */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    fontSize: "10px",
    color: "#2A2A2A",
    fontFamily: "Pretendard",
    fontWeight: 600,
  }}
>
  {labels.map((label, i) => {
    const daysInMonth = labels.length;
    const isLast = label === daysInMonth;

    // 30일과 31일이 동시에 표시되는 문제 방지
    if (
      period === "monthly" &&
      label % 5 !== 0 &&
      label !== 1 &&
      !isLast
    ) {
      return <span key={i} style={{ flex: 1 }}></span>;
    }

    // 만약 31일 달인데 30이 이미 표시되면 31은 생략
    if (period === "monthly" && daysInMonth === 31 && label === 31) {
      return null;
    }

    return (
      <span key={i} style={{ flex: 1, textAlign: "center" }}>
        {label}
      </span>
    );
  })}
</div>

      </div>
    </div>
  );
}

export default ProgressBar;
