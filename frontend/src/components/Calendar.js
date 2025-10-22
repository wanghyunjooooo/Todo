import React, { useState } from "react";
import "./calendar.css";

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [isMonthly, setIsMonthly] = useState(true);

  const prevMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  const nextMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const year = date.getFullYear();
  const month = date.getMonth();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 달력 배열 (빈칸 포함)
  const calendarArray = [];
  for (let i = 0; i < firstDay; i++) {
    calendarArray.push({ date: null, isToday: false, isSunday: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dayOfWeek = new Date(year, month, i).getDay();
    calendarArray.push({
      date: i,
      isToday: i === todayDate && month === todayMonth && year === todayYear,
      isSunday: dayOfWeek === 0,
    });
  }

  // 주간 모드: 이번 주만 표시
  let displayedDays = calendarArray;
  if (!isMonthly) {
    if (todayMonth === month && todayYear === year) {
      const startOfWeek = todayDate - today.getDay();
      displayedDays = calendarArray.slice(startOfWeek, startOfWeek + 7);
    }
  }

  return (
    <div className="my-calendar-container">
      {/* 상단 네비게이션 */}
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
          <button
            className="view-toggle-btn"
            onClick={() => setIsMonthly(!isMonthly)}
          >
            {isMonthly ? "월간" : "주간"}
          </button>
        </div>
      </div>

      {/* 요일 고정 */}
      <div className="calendar-weekdays">
        {weekdays.map((wd) => (
          <div key={wd} className="weekday">
            {wd}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="calendar-days">
        {displayedDays.map((day, idx) => (
          <div
            key={idx}
            className={`day-tile ${day?.isToday ? "today" : ""} ${
              day?.isSunday ? "sunday" : ""
            }`}
          >
            {day.date && <div className="day-number">{day.date}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCalendar;
