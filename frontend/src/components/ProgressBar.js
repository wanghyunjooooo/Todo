import React from "react";
import ArrowIcon from "../assets/icon-arrow-right.svg"; // 기존 오른쪽 화살표

function ProgressChart() {
  return (
    <div style={{
      display: "flex",
      width: "350px",
      padding: "21px 20px",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "20px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
    }}>
      
      {/* 상단 제목 */}
      <span style={{
        fontFamily: "Pretendard",
        fontSize: "14px",
        fontWeight: 600,
        color: "var(--Grey-Darker, #2A2A2A)"
      }}>
        달성률 통계
      </span>

      {/* 내부 박스 */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "310px",
        padding: "20px",
        gap: "20px",
        background: "#F3F3F3",
        borderRadius: "8px",
        alignItems: "flex-start",
        position: "relative"
      }}>

        {/* 상단 헤더: 왼쪽 글씨, 오른쪽 화살표 두 개 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}>
          <span style={{
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--Grey-Darker, #2A2A2A)"
          }}>주간 통계</span>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* 왼쪽 화살표 */}
            <img
              src={ArrowIcon}
              alt="left"
              style={{
                width: "20px",
                height: "20px",
                transform: "rotate(180deg)",
                cursor: "pointer"
              }}
            />
            {/* 오른쪽 화살표 */}
            <img
              src={ArrowIcon}
              alt="right"
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer"
              }}
            />
          </div>
        </div>

        {/* 그래프 */}
        <svg width="100%" height="140" viewBox="0 0 233 140" fill="none">
          {/* y축 */}
          <line x1="0.5" y1="0" x2="0.5" y2="123" stroke="black"/>
          {/* x축 */}
          <line x1="0" y1="123.5" x2="233" y2="123.5" stroke="black"/>
          {/* 막대그래프 */}
          <rect x="0" y="27.0298" width="27.291" height="95.8322" fill="#36A862"/>
          <rect x="34.2855" y="57.7456" width="27.291" height="65.1164" fill="#36A862"/>
          <rect x="68.5714" y="2.45801" width="27.291" height="121.404" fill="#36A862"/>
          <rect x="102.857" y="73.7173" width="27.291" height="49.144" fill="#36A862"/>
          <rect x="137.143" y="73.7173" width="27.291" height="49.144" fill="#36A862"/>
          <rect x="171.429" y="0" width="27.291" height="123" fill="#36A862"/>
          <rect x="205.714" y="25.8013" width="27.291" height="98.2007" fill="#36A862"/>
        </svg>

        {/* x축 숫자 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          width: "233px",
          fontSize: "10px",
          color: "var(--Grey-Darker, #2A2A2A)",
          fontFamily: "Pretendard",
          fontWeight: 600
        }}>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span> 
          <span>7</span>
        </div>

      </div>
    </div>
  );
}

export default ProgressChart;
