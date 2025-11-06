import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 한 줄로 합침
import api, { addTask } from "../api";
import "./CategoryTasks.css";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import BottomTaskInput from "../components/BottomTaskInput";
import CategoryTodo from "../components/CategoryTodo";
import ThreeIcon from "../assets/three.svg";
import CategoryManagePopup from "../components/CategoryManagePopup";

function CategoryTasks() {
    const { categoryId } = useParams();
    const userId = localStorage.getItem("user_id");

    const [categoryName, setCategoryName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
    const [isEditingCategoryName, setIsEditingCategoryName] = useState(false);
    const categoryInputRef = useRef(null);
    const navigate = useNavigate(); // 이걸 추가해야 함

    /** 상단 카테고리 이름 편집 시 포커스 */
    useEffect(() => {
        if (isEditingCategoryName) {
            categoryInputRef.current?.focus();
            categoryInputRef.current?.select();
        }
    }, [isEditingCategoryName]);

    /** 특정 카테고리와 할 일 불러오기 */
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
                const res = await api.get(`/categories/${userId}/${categoryId}`);
                fetchedTasks = res.data.tasks || [];
                catName = res.data.category_name;
            }

            setCategoryName(catName);
            setTasks(fetchedTasks);
        } catch (err) {
            console.error("카테고리/할 일 불러오기 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    /** 모든 카테고리 불러오기 (팝업용) */
    const fetchCategories = async () => {
        if (!userId) return;
        try {
            const res = await api.get(`/categories/${userId}`);
            setCategories(res.data || []);
        } catch (err) {
            console.error("카테고리 목록 불러오기 실패:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchCategories();
    }, [categoryId, userId]);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    const handleAddTask = async (_, text) => {
        if (!userId) return alert("로그인이 필요합니다.");

        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
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
            await fetchTasks();
        } catch (err) {
            console.error("할 일 추가 실패:", err);
        }
    };

    const updateTaskInState = (updatedTask) => {
        setTasks((prev) => prev.map((task) => (task.task_id === updatedTask.task_id ? { ...task, ...updatedTask } : task)));
    };

    const handleDataUpdated = async () => {
        await fetchTasks();
    };

    /** 상단 카테고리 이름 수정 완료 */
    const handleCategoryNameBlur = async () => {
        setIsEditingCategoryName(false);

        try {
            const res = await api.put(`/categories/${userId}/${categoryId}`, {
                category_name: categoryName,
            });

            // 서버에서 반환한 최종 카테고리 이름으로 상태 업데이트
            if (res.data && res.data.category) {
                setCategoryName(res.data.category.category_name);
            }

            // 카테고리 목록 갱신
            await fetchCategories();
        } catch (err) {
            console.error("카테고리 이름 업데이트 실패:", err);
        }
    };

    if (loading) return <div>로딩중...</div>;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header onSidebarToggle={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            {/* 카테고리 이름 + 점 세개 아이콘 */}
            <div className="title-header">
                {isEditingCategoryName ? (
                    <input
                        ref={categoryInputRef}
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        onBlur={handleCategoryNameBlur}
                        className="editing"
                        style={{
                            fontSize: "18px",
                            fontWeight: "500",
                            border: "1px solid #007bff",
                            borderRadius: "4px",
                            padding: "2px 4px",
                        }}
                    />
                ) : (
                    <span>{categoryName}</span>
                )}
                {categoryId !== "none" && (
                    <img
                        src={ThreeIcon}
                        alt="더보기"
                        style={{
                            width: "35px",
                            height: "35px",
                            cursor: "pointer",
                        }}
                        onClick={() => setIsCategoryPopupOpen(true)}
                    />
                )}
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
                <CategoryTodo categoryId={categoryId} tasks={tasks} updateTaskInState={updateTaskInState} onDataUpdated={handleDataUpdated} />
            </div>

            <div style={{ position: "fixed", bottom: 40, left: 20 }}>
                <BottomTaskInput onAddTask={handleAddTask} hideCategorySelector={true} />
            </div>

            {/* 카테고리 관리 팝업 */}
            {isCategoryPopupOpen && (
                <CategoryManagePopup
                    categories={categories}
                    onClose={() => setIsCategoryPopupOpen(false)}
                    onEdit={() => setIsEditingCategoryName(true)}
                    onDelete={async () => {
                        if (window.confirm("정말 이 카테고리를 삭제하시겠습니까?")) {
                            try {
                                await api.delete(`/categories/${userId}/${categoryId}`);
                                setIsCategoryPopupOpen(false);
                                // 삭제 후 홈 화면으로 이동
                                navigate("/"); // <- 여기서 이동
                            } catch (err) {
                                console.error("카테고리 삭제 실패", err);
                            }
                        }
                    }}
                    onUpdateCategories={setCategories}
                />
            )}
        </div>
    );
}

export default CategoryTasks;
