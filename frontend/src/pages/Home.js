import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MyCalendar from "../components/Calendar";
import Todo from "../components/Todo";
import {
    getCategories,
    getTasksByDay,
    addCategory,
    getMonthlyTasks,
    addTask,
} from "../api";

function Home() {
    const [categories, setCategories] = useState([]);
    const [tasksByDate, setTasksByDate] = useState([]);
    const [tasksByMonth, setTasksByMonth] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const saved = localStorage.getItem("selectedDate");
        return saved ? new Date(saved) : new Date();
    });
    const [focusedTaskId, setFocusedTaskId] = useState(null);
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
            } catch (err) {
                console.error("카테고리 로드 실패:", err);
            }
        };
        fetchCategories();
    }, [userId]);

    /** ✅ 날짜별 Task 로드 */
    useEffect(() => {
        if (!userId || !selectedDate) return;

        const fetchTasksByDate = async () => {
            const dateStr = `${selectedDate.getFullYear()}-${String(
                selectedDate.getMonth() + 1
            ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                2,
                "0"
            )}`;
            try {
                const tasks = await getTasksByDay(userId, dateStr);
                setTasksByDate(tasks || []);
            } catch (err) {
                console.error("날짜별 Task 로드 실패:", err);
            }
        };

        fetchTasksByDate();
    }, [selectedDate, userId]);

    /** ✅ 월간 Task 로드 */
    useEffect(() => {
        if (!userId) return;
        const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const endDate = `${year}-${String(month + 1).padStart(
            2,
            "0"
        )}-${new Date(year, month + 1, 0).getDate()}`;

        const fetchTasksByMonth = async () => {
            try {
                const tasks = await getMonthlyTasks(userId, startDate, endDate);
                setTasksByMonth(tasks || []);
            } catch (err) {
                console.error("월간 Task 로드 실패:", err);
            }
        };

        fetchTasksByMonth();
    }, [userId, year, month]);

    /** ✅ 카테고리 추가 + 할 일 01 생성 */
    const handleCategoryAdded = async (categoryName) => {
        if (!userId) return alert("로그인이 필요합니다.");
        try {
            const categoryRes = await addCategory(userId, categoryName);
            const newCategory = categoryRes.category;

            // 날짜 문자열
            const dateStr = `${selectedDate.getFullYear()}-${String(
                selectedDate.getMonth() + 1
            ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                2,
                "0"
            )}`;

            const taskRes = await addTask({
                task_name: "할 일 01",
                memo: "",
                task_date: dateStr,
                category_id: newCategory.categoryId,
                user_id: Number(userId),
                notification_type: "미알림",
                notification_time: null,
            });

            const newTaskId = taskRes.task.taskId;
            setFocusedTaskId(newTaskId);

            setCategories((prev) => [...prev, newCategory]);

            // ✅ Task 갱신
            const updatedTasks = await getTasksByDay(userId, dateStr);
            setTasksByDate(updatedTasks || []);

            setTimeout(() => setFocusedTaskId(null), 500);
        } catch (err) {
            console.error("카테고리 생성 실패:", err);
            alert("카테고리 추가 중 오류가 발생했습니다.");
        }
    };

    /** ✅ Task 상태 갱신용 함수 (Todo → TaskOptionsPopup에서 사용) */
    const updateTaskInState = (updatedTask) => {
        setTasksByDate((prev) =>
            prev.map((task) =>
                task.taskId === updatedTask.taskId
                    ? { ...task, ...updatedTask }
                    : task
            )
        );
    };

    /** ✅ 날짜 변경 */
    const handleDateChange = (newDate) => setSelectedDate(newDate);

    /** ✅ 전체 새로고침 */
    const refreshData = async () => {
        const dateStr = `${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
        try {
            const [tasks, monthlyTasks, categoryList] = await Promise.all([
                getTasksByDay(userId, dateStr),
                getMonthlyTasks(
                    userId,
                    `${year}-${String(month + 1).padStart(2, "0")}-01`,
                    `${year}-${String(month + 1).padStart(2, "0")}-${new Date(
                        year,
                        month + 1,
                        0
                    ).getDate()}`
                ),
                getCategories(userId),
            ]);
            setTasksByDate(tasks || []);
            setTasksByMonth(monthlyTasks || []);
            setCategories(categoryList || []);
        } catch (err) {
            console.error("데이터 새로고침 실패:", err);
        }
    };

    return (
        <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            <Header
                showMenu={true}
                categories={categories}
                onCategoryAdded={handleCategoryAdded}
                onCategoryChanged={refreshData}
            />
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    paddingBottom: "100px",
                    marginTop: "24px",
                }}
            >
                <MyCalendar
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    tasksByDate={tasksByMonth}
                />
                <div style={{ marginTop: "8px" }}>
                    <Todo
                        tasksByDate={tasksByDate}
                        selectedDate={selectedDate}
                        categories={categories}
                        focusedTaskId={focusedTaskId}
                        onDataUpdated={refreshData}
                        updateTaskInState={updateTaskInState} // ✅ 루틴 삭제/생성 후 Task 상태 갱신용
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
