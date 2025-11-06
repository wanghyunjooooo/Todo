import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Todo from "../components/Todo";
import { addTask, getTasksByDay } from "../api";
import Sidebar from "../components/SideBar";
import BottomTaskInput from "../components/BottomTaskInput";
import ThreeIcon from "../assets/three.svg";
import CategoryManagePopup from "../components/CategoryManagePopup"; // 카테고리 관리용 팝업

function Home() {
    const [tasksByDate, setTasksByDate] = useState([]);
    const [selectedDate] = useState(() => {
        const saved = localStorage.getItem("selectedDate");
        return saved ? new Date(saved) : new Date();
    });
    const [focusedTaskId, setFocusedTaskId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false); // 팝업 상태
    const userId = localStorage.getItem("user_id");

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    /** 오늘 날짜 문자열 포맷 */
    const weekDays = [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
    ];
    const todayString = `${month + 1}월 ${day}일 ${
        weekDays[selectedDate.getDay()]
    }`;

    /** 오늘 할 일 로드 */
    useEffect(() => {
        if (!userId) return;

        const fetchTodayTasks = async () => {
            const dateStr = `${year}-${String(month + 1).padStart(
                2,
                "0"
            )}-${String(day).padStart(2, "0")}`;
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
        setTasksByDate((prev) =>
            prev.map((task) =>
                task.taskId === updatedTask.taskId
                    ? { ...task, ...updatedTask }
                    : task
            )
        );
    };

    /** 사이드바 토글 */
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    /** 할 일 추가 */
    const handleAddTask = async (category_id, text) => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return alert("로그인이 필요합니다.");
        if (!selectedDate) return alert("날짜가 유효하지 않습니다.");

        const localDate = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        );
        const dateStr = localDate.toISOString().split("T")[0];

        try {
            await addTask({
                task_name: text,
                memo: "",
                task_date: dateStr,
                category_id: category_id ?? null, // 선택된 카테고리 id 전달
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
        <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            {/* Header */}
            <Header onSidebarToggle={toggleSidebar} />
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            {/* 오늘 날짜 표시 */}
            <div className="title-header" style={{ marginTop: "8px" }}>
                {todayString}
            </div>

            {/* 오늘 할 일만 표시 */}
            <div style={{ flex: 1, overflowY: "auto" }}>
                <Todo
                    tasksByDate={tasksByDate}
                    selectedDate={selectedDate}
                    focusedTaskId={focusedTaskId}
                    updateTaskInState={updateTaskInState}
                    onDataUpdated={async () => {
                        if (!userId) return;
                        const dateStr = `${year}-${String(month + 1).padStart(
                            2,
                            "0"
                        )}-${String(day).padStart(2, "0")}`;
                        try {
                            const tasks = await getTasksByDay(userId, dateStr);
                            setTasksByDate(tasks || []);
                        } catch (err) {
                            console.error("오늘 할 일 새로고침 실패:", err);
                        }
                    }}
                />
            </div>

            {/* 하단 입력창 */}
            <div style={{ position: "fixed", bottom: 40, left: 20 }}>
                <BottomTaskInput
                    onAddTask={handleAddTask}
                    categories={categories}
                />
            </div>

            {/* 카테고리 관리 팝업 */}
            {isCategoryPopupOpen && (
                <CategoryManagePopup
                    categories={categories}
                    onClose={() => setIsCategoryPopupOpen(false)}
                    onUpdateCategories={(newCategories) =>
                        setCategories(newCategories)
                    }
                />
            )}
        </div>
    );
}

export default Home;
