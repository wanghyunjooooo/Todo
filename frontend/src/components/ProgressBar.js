// src/components/ProgressBar.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ArrowIcon from "../assets/icon-arrow-right.svg";

function ProgressBar({ userId }) {
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState("weekly");

    // ✅ 날짜 포맷 함수
    const formatLocalDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("토큰이 없습니다.");

                const url = `http://localhost:8080/tasks/stats/${period}/${userId}`;
                const today = new Date();
                let body;

                // ✅ 주간 통계: 이번 주 일요일~토요일 기준
                if (period === "weekly") {
                    const dayOfWeek = today.getDay(); // 일요일=0
                    const start = new Date(today);
                    start.setDate(today.getDate() - dayOfWeek); // 이번 주 일요일
                    const end = new Date(start);
                    end.setDate(start.getDate() + 6); // 이번 주 토요일

                    body = {
                        start_date: formatLocalDate(start),
                        end_date: formatLocalDate(end),
                    };
                }
                // ✅ 월간 통계: 현재 달 1일 ~ 말일
                else {
                    const start = new Date(today.getFullYear(), today.getMonth(), 1);
                    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    body = {
                        start_date: formatLocalDate(start),
                        end_date: formatLocalDate(end),
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

    const graphData =
        period === "weekly"
            ? (() => {
                  const days = ["일", "월", "화", "수", "목", "금", "토"];
                  const dataMap = new Map((stats.weekly_data || []).map((d) => [d.day, d.rate]));
                  return days.map((day) => ({
                      label: day,
                      rate: dataMap.get(day) || 0,
                  }));
              })()
            : (() => {
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = today.getMonth();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const dataMap = new Map((stats.daily_data || []).map((d) => [new Date(d.date).getDate(), d.rate]));
                  return Array.from({ length: daysInMonth }, (_, i) => ({
                      label: i + 1,
                      rate: dataMap.get(i + 1) || 0,
                  }));
              })();

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
                borderRadius: "16px",
            }}
        >
            <span
                style={{
                    fontFamily: "Pretendard",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#2A2A2A",
                }}
            >
                달성률 통계
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
                            fontSize: "12px",
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
                            style={{
                                width: "20px",
                                height: "20px",
                                transform: "rotate(180deg)",
                                cursor: "pointer",
                                opacity: period === "weekly" ? 0.4 : 1,
                            }}
                            onClick={() => setPeriod("weekly")}
                        />
                        <img
                            src={ArrowIcon}
                            alt="monthly"
                            style={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                opacity: period === "monthly" ? 0.4 : 1,
                            }}
                            onClick={() => setPeriod("monthly")}
                        />
                    </div>
                </div>

                {/* ✅ Recharts 막대 그래프 */}
                <style>
                    {`
                        svg.recharts-surface:focus {
                            outline: none !important;
                            border: none !important;
                        }
                    `}
                </style>
                <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={graphData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#2A2A2A", fontWeight: 400 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} allowDecimals={false} interval={0} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 12, fill: "#2A2A2A", fontWeight: 400 }} tickFormatter={(v) => `${v}`} />
                        <Tooltip cursor={{ fill: "rgba(54,168,98,0.1)" }} contentStyle={{ backgroundColor: "#fff", borderRadius: "6px", border: "1px solid #ddd", fontSize: "10px", fontFamily: "Pretendard" }} formatter={(value) => [`${value.toFixed(1)}%`, "달성률"]} />
                        <Bar dataKey="rate" fill="#36A862" barSize={28} animationDuration={500} />{" "}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ProgressBar;
