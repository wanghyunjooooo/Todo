import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MyCalendar from "../components/Calendar";
import Todo from "../components/Todo";
import BottomNav from "../components/Nav";
import { getCategories, getTasksByDay } from "../api";

function Home() {
  const [categories, setCategories] = useState([]);
  const [tasksByDate, setTasksByDate] = useState([]); // category 없이 그냥 배열
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 1️⃣ 초기 카테고리 로드
  useEffect(() => {
    const fetchCategories = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      try {
        const data = await getCategories(user_id);
        console.log("카테고리 로드:", data); // ✅ 콘솔 찍기
        setCategories(data);
      } catch (err) {
        console.error("카테고리 로드 실패:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2️⃣ 선택 날짜 변경 시 tasks 불러오기
  useEffect(() => {
    const fetchTasks = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      // 🔹 로컬 기준 YYYY-MM-DD 생성
      const dateStr = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

      console.log("선택 날짜:", dateStr); // ✅ 콘솔 찍기

      try {
        const tasks = await getTasksByDay(user_id, dateStr);
        console.log("해당 날짜 tasks:", tasks); // ✅ 콘솔 찍기
        setTasksByDate(tasks); // 그대로 배열로 저장
      } catch (err) {
        console.error("날짜별 할 일 로드 실패:", err);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  const handleCategoryAdded = (newCategory) => {
    console.log("새 카테고리 추가:", newCategory); // ✅ 콘솔 찍기
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleDateChange = (newDate) => {
    console.log("날짜 변경:", newDate); // ✅ 콘솔 찍기
    setSelectedDate(newDate);
  };

  console.log("렌더링 - categories:", categories); // ✅ 렌더링마다 상태 확인
  console.log("렌더링 - tasksByDate:", tasksByDate); // ✅ 렌더링마다 상태 확인

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Header
        showMenu={true}
        categories={categories}
        onCategoryAdded={handleCategoryAdded}
      />
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "100px", marginTop: "24px" }}>
        <MyCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
        <div style={{ marginTop: "8px" }}>
          <Todo
            tasksByDate={tasksByDate}
            selectedDate={selectedDate}
            categories={categories} // 필요 없으면 제거 가능
          />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default Home;
