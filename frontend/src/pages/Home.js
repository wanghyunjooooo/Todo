import React from "react";
import Header from "../components/Header";
import MyCalendar from "../components/Calendar";
import CategoryManager from "../components/Category"; // 이름 변경

function Home() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Header />

      {/* 내용 영역 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        {/* 달력 */}
        <MyCalendar />

        {/* 카테고리 */}
        <div style={{ marginTop: "20px" }}>
          <CategoryManager /> {/* JSX도 변경 */}
        </div>
      </div>
    </div>
  );
}

export default Home;
