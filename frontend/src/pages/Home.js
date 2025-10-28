import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MyCalendar from "../components/Calendar";
import Todo from "../components/Todo";
import BottomNav from "../components/Nav";
import { getCategories, getTasksByDay, addCategory, getMonthlyTasks } from "../api";

function Home() {
    const [categories, setCategories] = useState([]);
    const [tasksByDate, setTasksByDate] = useState([]);
    const [tasksByMonth, setTasksByMonth] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const userId = localStorage.getItem("user_id");

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    useEffect(() => {
        if (!userId) return;
        const fetchCategories = async () => {
            try {
                const data = await getCategories(userId);
                console.log("카테고리 목록:", data);
                setCategories(data);
            } catch (err) {
                console.error("카테고리 로드 실패:", err);
            }
        };
        fetchCategories();
    }, [userId]);

    useEffect(() => {
        if (!userId || !selectedDate) return;

        const fetchTasksByDate = async () => {
            const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
            try {
                const tasks = await getTasksByDay(userId, dateStr);
                setTasksByDate(tasks);
            } catch (err) {
                console.error("날짜별 Task 로드 실패:", err);
            }
        };

        fetchTasksByDate();
    }, [selectedDate, userId]);

    useEffect(() => {
        if (!userId) return;

        const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(year, month + 1, 0).getDate()}`;

        const fetchTasksByMonth = async () => {
            try {
                const tasks = await getMonthlyTasks(userId, startDate, endDate);
                setTasksByMonth(tasks);
            } catch (err) {
                console.error("월간 Task 로드 실패:", err);
            }
        };

        fetchTasksByMonth();
    }, [userId, year, month]);

    const handleCategoryAdded = async (categoryName) => {
        try {
            const newCategory = await addCategory(userId, categoryName);
            console.log("새 카테고리:", newCategory);
            setCategories((prev) => [...prev, newCategory]);
        } catch (err) {
            console.error("카테고리 추가 실패:", err);
        }
    };

    const handleDateChange = (newDate) => {
        console.log("선택 날짜:", newDate);
        setSelectedDate(newDate);
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header showMenu={true} categories={categories} onCategoryAdded={handleCategoryAdded} />
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: "100px", marginTop: "24px" }}>
                <MyCalendar selectedDate={selectedDate} onDateChange={handleDateChange} tasksByDate={tasksByMonth} />
                <div style={{ marginTop: "8px" }}>
                    <Todo tasksByDate={tasksByDate} selectedDate={selectedDate} categories={categories} />
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

export default Home;
