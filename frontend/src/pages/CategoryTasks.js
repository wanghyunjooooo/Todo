import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { addTask } from "../api";
import "./CategoryTasks.css";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import BottomTaskInput from "../components/BottomTaskInput";
import CategoryTodo from "../components/CategoryTodo";

function CategoryTasks() {
    const { categoryId } = useParams();
    const userId = localStorage.getItem("user_id");
    const [categoryName, setCategoryName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    /** 카테고리/할 일 불러오기 */
    const fetchTasks = async () => {
        if (!userId || !categoryId) return;
        try {
            let fetchedTasks = [];
            let catName = "";

            if (categoryId === "none") {
                const res = await api.get(`/tasks/${userId}/none`);
                fetchedTasks = res.data;
                catName = "작업";
            } else {
                const res = await api.get(
                    `/categories/${userId}/${categoryId}`
                );
                fetchedTasks = res.data.tasks || [];
                catName = res.data.category_name;
            }

            setCategoryName(catName);
            setTasks(fetchedTasks);
        } catch (err) {
            console.error("카테고리/할 일 불러오기 실패:", err);
            alert("카테고리 정보를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [categoryId, userId]);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    /** 새로운 할 일 추가 */
    const handleAddTask = async (_, text) => {
        if (!userId) return alert("로그인이 필요합니다.");

        const today = new Date();
        const localDate = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        );
        const dateStr = localDate.toISOString().split("T")[0];

        try {
            await addTask({
                task_name: text,
                memo: "",
                task_date: dateStr,
                category_id: categoryId === "none" ? null : Number(categoryId),
                user_id: Number(userId),
                notification_type: "미알림",
                notification_time: null,
            });

            // 추가 후 tasks 새로 불러오기
            await fetchTasks();
        } catch (err) {
            console.error("할 일 추가 실패:", err);
        }
    };

    /** task 상태 갱신 */
    const updateTaskInState = (updatedTask) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.task_id === updatedTask.task_id
                    ? { ...task, ...updatedTask }
                    : task
            )
        );
    };

    /** task 옵션에서 호출할 새로고침 */
    const handleDataUpdated = async () => {
        await fetchTasks();
    };

    if (loading) return <div>로딩중...</div>;

    return (
        <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            <Header onSidebarToggle={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            <div className="title-header">
                {categoryName}
                {/* SVG 아이콘 생략 */}
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
                <CategoryTodo
                    categoryId={categoryId}
                    tasks={tasks}
                    updateTaskInState={updateTaskInState}
                    onDataUpdated={handleDataUpdated} // ✅ 여기서 실제 fetchTasks 호출
                />
            </div>

            <div style={{ position: "fixed", bottom: 40, left: 20 }}>
                <BottomTaskInput
                    onAddTask={handleAddTask}
                    hideCategorySelector={true} // 홈 화면 아니면 카테고리 선택 숨김
                />
            </div>
        </div>
    );
}

export default CategoryTasks;
