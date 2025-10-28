import React, { useState, useEffect } from "react";
import "./calendar.css";

function MyCalendar({ selectedDate, onDateChange, tasksByDate = [] }) {
    const [isMonthly, setIsMonthly] = useState(true);

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const completedDates = new Set((Array.isArray(tasksByDate) ? tasksByDate : []).filter((t) => t.status === "완료" && (t.task_date || t.taskDate)).map((t) => new Date(t.task_date || t.taskDate).getDate()));

    const calendarArray = [];
    for (let i = 0; i < firstDay; i++) {
        calendarArray.push({ date: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = new Date(year, month, i).getDay();
        const isCompleted = completedDates.has(i);
        const isSunday = dayOfWeek === 0;
        calendarArray.push({
            date: i,
            isCompleted,
            isSunday,
        });
    }

    // 주간 모드
    let displayedDays = calendarArray;
    if (!isMonthly) {
        const selectedDay = selectedDate.getDate();
        const startOfWeekIndex = calendarArray.findIndex((day) => day.date === selectedDay) - selectedDate.getDay();
        const start = Math.max(0, startOfWeekIndex);
        displayedDays = calendarArray.slice(start, start + 7);
    }

    const prevMonth = () => {
        const d = new Date(year, month - 1, 1);
        d.setHours(0, 0, 0, 0);
        onDateChange(d);
    };

    const nextMonth = () => {
        const d = new Date(year, month + 1, 1);
        d.setHours(0, 0, 0, 0);
        onDateChange(d);
    };

    return (
        <div className="my-calendar-container">
            <div className="my-calendar-nav">
                <div className="month-label">
                    {year}년 {month + 1}월
                </div>
                <div className="nav-buttons">
                    <button className="arrow-btn" onClick={prevMonth}>
                        &lt;
                    </button>
                    <button className="arrow-btn" onClick={nextMonth}>
                        &gt;
                    </button>
                    <button className="view-toggle-btn" onClick={() => setIsMonthly(!isMonthly)}>
                        {isMonthly ? "월간" : "주간"}
                    </button>
                </div>
            </div>

            <div className="calendar-weekdays">
                {weekdays.map((wd) => (
                    <div key={wd} className="weekday">
                        {wd}
                    </div>
                ))}
            </div>

            <div className="calendar-days">
                {displayedDays.map((day, idx) => {
                    const isSelected = day.date && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day.date;

                    return (
                        <div
                            key={idx}
                            className={`day-tile ${isSelected ? "selected" : ""} ${day.isSunday ? "sunday" : ""}`}
                            onClick={() => {
                                if (!day.date) return;
                                const d = new Date(year, month, day.date);
                                d.setHours(0, 0, 0, 0);
                                onDateChange(d);
                            }}
                        >
                            {day.date && <div className={`day-number ${day.isCompleted ? "completed" : ""}`}>{day.date}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyCalendar;
