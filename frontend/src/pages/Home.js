import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Todo from "../components/Todo";
import { addTask, getTasksByDay } from "../api";
import Sidebar from "../components/SideBar";
import BottomTaskInput from "../components/BottomTaskInput";

function Home() {
    const [tasksByDate, setTasksByDate] = useState([]);
    const [selectedDate] = useState(() => {
        const saved = localStorage.getItem("selectedDate");
        return saved ? new Date(saved) : new Date();
    });
    const [focusedTaskId, setFocusedTaskId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const userId = localStorage.getItem("user_id");

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    /** 오늘 날짜 문자열 포맷: "11월 4일 화요일" */
    const weekDays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const todayString = `${month + 1}월 ${day}일 ${weekDays[selectedDate.getDay()]}`;

    /** 오늘 할 일 로드 */
    useEffect(() => {
        if (!userId) return;

        const fetchTodayTasks = async () => {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            try {
                const tasks = await getTasksByDay(userId, dateStr);
                setTasksByDate(tasks || []);
            } catch (err) {
                console.error("오늘 할 일 로드 실패:", err);
            }
        };

        fetchTodayTasks();
    }, [userId, year, month, day]);

    /** Task 상태 갱신용 */
    const updateTaskInState = (updatedTask) => {
        setTasksByDate((prev) => prev.map((task) => (task.taskId === updatedTask.taskId ? { ...task, ...updatedTask } : task)));
    };

    /** 사이드바 토글 */
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    const handleAddTask = async (_, text) => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return alert("로그인이 필요합니다.");
        if (!selectedDate) return alert("날짜가 유효하지 않습니다.");

        const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
        const dateStr = localDate.toISOString().split("T")[0];

        try {
            await addTask({
                task_name: text,
                memo: "",
                task_date: dateStr,
                category_id: null,
                user_id: Number(user_id),
                notification_type: "미알림",
                notification_time: null,
            });
            // 새로고침
            const tasks = await getTasksByDay(user_id, dateStr);
            setTasksByDate(tasks || []);
        } catch (err) {
            console.error("하단 입력창 추가 실패:", err);
        }
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Header onSidebarToggle={toggleSidebar} />
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            {/* 오늘 날짜 표시 */}
            <div className="title-header" style={{ marginTop: "8px" }}>
                {todayString}
            </div>
            {/* 오늘 할 일만 표시 */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                <Todo
                    tasksByDate={tasksByDate}
                    selectedDate={selectedDate}
                    focusedTaskId={focusedTaskId}
                    updateTaskInState={updateTaskInState}
                    onDataUpdated={async () => {
                        if (!userId) return;
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        try {
                            const tasks = await getTasksByDay(userId, dateStr);
                            setTasksByDate(tasks || []);
                        } catch (err) {
                            console.error("오늘 할 일 새로고침 실패:", err);
                        }
                    }}
                />
            </div>
            <div style={{ position: "fixed", bottom: 40, left: 20 }}>
                <BottomTaskInput onAddTask={handleAddTask} categories={categories} />
            </div>
        </div>
    );
}

export default Home;
