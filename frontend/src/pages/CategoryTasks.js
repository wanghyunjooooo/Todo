import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { addTask } from "../api";
import "./CategoryTasks.css";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import BottomTaskInput from "../components/BottomTaskInput";
import CategoryTodo from "../components/CategoryTodo";

function CategoryTasks() {
    const { categoryId } = useParams(); // 카테고리 ID
    const userId = localStorage.getItem("user_id");
    const [categoryName, setCategoryName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 카테고리 할 일 불러오기
    useEffect(() => {
        const fetchCategoryTasks = async () => {
            try {
                const res = await api.get(`/categories/${userId}/${categoryId}`);
                setCategoryName(res.data.category_name);
                setTasks(res.data.tasks || []);
            } catch (err) {
                console.error("카테고리 정보 불러오기 실패:", err);
                alert("카테고리 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (categoryId && userId) fetchCategoryTasks();
    }, [categoryId, userId]);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    const handleAddTask = async (_, text) => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return alert("로그인이 필요합니다.");

        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
        const dateStr = localDate.toISOString().split("T")[0];

        try {
            await addTask({
                task_name: text,
                memo: "",
                task_date: dateStr,
                category_id: Number(categoryId),
                user_id: Number(user_id),
                notification_type: "미알림",
                notification_time: null,
            });
            // 새로고침
            const updatedTasks = await api.get(`/categories/${userId}/${categoryId}`);
            setTasks(updatedTasks.data.tasks || []);
            console.log("새 할 일 추가 완료");
        } catch (err) {
            console.error("할 일 추가 실패:", err);
        }
    };

    const updateTaskInState = (updatedTask) => {
        setTasks((prev) => prev.map((task) => (task.taskId === updatedTask.taskId ? { ...task, ...updatedTask } : task)));
    };

    if (loading) return <div>로딩중...</div>;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header onSidebarToggle={toggleSidebar} />

            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            <div className="title-header">
                {categoryName}
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.893 19.9934C12.893 19.4647 12.6886 18.9577 12.3248 18.5838C11.961 18.21 11.4675 18 10.953 18H10.94C10.4255 18 9.93205 18.21 9.56822 18.5838C9.2044 18.9577 9 19.4647 9 19.9934V20.0066C9 20.5353 9.2044 21.0423 9.56822 21.4162C9.93205 21.79 10.4255 22 10.94 22H10.953C11.4675 22 11.961 21.79 12.3248 21.4162C12.6886 21.0423 12.893 20.5353 12.893 20.0066V19.9934ZM20.0065 18C20.521 18 21.0145 18.21 21.3783 18.5838C21.7421 18.9577 21.9465 19.4647 21.9465 19.9934V20.0066C21.9465 20.5353 21.7421 21.0423 21.3783 21.4162C21.0145 21.79 20.521 22 20.0065 22H19.9935C19.479 22 18.9855 21.79 18.6217 21.4162C18.2579 21.0423 18.0535 20.5353 18.0535 20.0066V19.9934C18.0535 19.4647 18.2579 18.9577 18.6217 18.5838C18.9855 18.21 19.479 18 19.9935 18H20.0065ZM29.06 18C29.5745 18 30.0679 18.21 30.4318 18.5838C30.7956 18.9577 31 19.4647 31 19.9934V20.0066C31 20.5353 30.7956 21.0423 30.4318 21.4162C30.0679 21.79 29.5745 22 29.06 22H29.047C28.5325 22 28.039 21.79 27.6752 21.4162C27.3114 21.0423 27.107 20.5353 27.107 20.0066V19.9934C27.107 19.4647 27.3114 18.9577 27.6752 18.5838C28.039 18.21 28.5325 18 29.047 18H29.06Z"
                        fill="#595959"
                    />
                </svg>
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                <CategoryTodo categoryId={categoryId} tasks={tasks} updateTaskInState={updateTaskInState} onDataUpdated={() => console.log("업데이트됨")} />
            </div>

            <div style={{ position: "fixed", bottom: 40, left: 20 }}>
                <BottomTaskInput onAddTask={handleAddTask} categories={[]} />
            </div>
        </div>
    );
}

export default CategoryTasks;
