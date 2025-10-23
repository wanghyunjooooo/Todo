import React from "react";
import Header from "../components/Header";
import MyCalendar from "../components/Calendar";
import Todo from "../components/Todo";
import BottomNav from "../components/Nav"; // 네비 추가

function Home() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px", marginBottom: "140px" }}>
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
