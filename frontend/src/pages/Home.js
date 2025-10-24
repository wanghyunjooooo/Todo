import React from "react";
import Header from "../components/Header";
import MyCalendar from "../components/Calendar";
import Todo from "../components/Todo";
import BottomNav from "../components/Nav";

function Home() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 상단 헤더 */}
      <Header showMenu={true} />

      {/* 스크롤 가능 컨텐츠 영역 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "100px", // 하단 네비 공간 확보
          marginTop: "24px",      // Header와 캘린더 사이 간격
        }}
      >
        {/* 달력 */}
        <MyCalendar />

        {/* Todo 최소 간격 */}
        <div style={{ marginTop: "8px" }}>
          <Todo />
        </div>
      </div>

      {/* 화면 하단 네비 */}
      <BottomNav />
    </div>
  );
}

export default Home;
