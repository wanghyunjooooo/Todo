import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MyCalendar from "../components/Calendar";
import Todo from "../components/Todo";
import BottomNav from "../components/Nav";
import { getCategories, getTasksByDay, addCategory, getMonthlyTasks, addTask } from "../api";

function Home() {
    const [categories, setCategories] = useState([]);
    const [tasksByDate, setTasksByDate] = useState([]);
    const [tasksByMonth, setTasksByMonth] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const userId = localStorage.getItem("user_id");

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    /** ✅ 카테고리 로드 */
    useEffect(() => {
        if (!userId) return;
        const fetchCategories = async () => {
            try {
                const data = await getCategories(userId);
                setCategories(data || []);
                console.log("카테고리 목록:", data);
            } catch (err) {
                console.error("카테고리 로드 실패:", err);
            }
        };
        fetchCategories();
    }, [userId]);

    /** ✅ 날짜별 할 일 로드 */
    useEffect(() => {
        if (!userId || !selectedDate) return;

        const fetchTasksByDate = async () => {
            const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
            try {
                const tasks = await getTasksByDay(userId, dateStr);
                setTasksByDate(tasks || []);
                console.log(`${dateStr}의 Task:`, tasks);
            } catch (err) {
                console.error("날짜별 Task 로드 실패:", err);
            }
        };

        fetchTasksByDate();
    }, [selectedDate, userId]);

    /** ✅ 월간 Task 로드 (달력용) */
    useEffect(() => {
        if (!userId) return;

        const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(year, month + 1, 0).getDate()}`;

        const fetchTasksByMonth = async () => {
            try {
                const tasks = await getMonthlyTasks(userId, startDate, endDate);
                setTasksByMonth(tasks || []);
                console.log(`${month + 1}월 Task 목록:`, tasks);
            } catch (err) {
                console.error("월간 Task 로드 실패:", err);
            }
        };

        fetchTasksByMonth();
    }, [userId, year, month]);

    const handleCategoryAdded = async (categoryName) => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return alert("로그인이 필요합니다.");

        try {
            // 1️⃣ 새 카테고리 생성
            const categoryRes = await addCategory(user_id, categoryName);
            const newCategory = categoryRes.category;

            // 2️⃣ 카테고리 하위에 기본 할 일 01 자동 추가
            const dateStr = new Date().toISOString().split("T")[0];
            const taskRes = await addTask({
                task_name: "할 일 01",
                memo: "",
                task_date: dateStr,
                category_id: newCategory.category_id,
                user_id: Number(user_id),
                notification_type: "미알림",
                notification_time: null,
            });

            console.log("자동 생성된 할 일:", taskRes.task);

            // 3️⃣ 프론트 상태 업데이트
            setCategories((prev) => [...prev, newCategory]);
        } catch (err) {
            console.error("카테고리 생성 실패:", err);
            alert("카테고리 추가 중 오류가 발생했습니다.");
        }
    };

    /** ✅ 날짜 변경 시 실행 */
    const handleDateChange = (newDate) => {
        console.log("선택 날짜 변경:", newDate);
        setSelectedDate(newDate);
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* 상단 헤더 */}
            <Header showMenu={true} categories={categories} onCategoryAdded={handleCategoryAdded} />

            {/* 메인 콘텐츠 */}
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: "100px", marginTop: "24px" }}>
                {/* 달력 */}
                <MyCalendar selectedDate={selectedDate} onDateChange={handleDateChange} tasksByDate={tasksByMonth} />

                {/* 할 일 목록 */}
                <div style={{ marginTop: "8px" }}>
                    <Todo tasksByDate={tasksByDate} selectedDate={selectedDate} categories={categories} />
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
        </div>
    );
}

export default Home;
