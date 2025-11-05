// src/pages/CategoryTasks.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // JWT 포함 Axios

function CategoryTasks() {
    const { categoryId } = useParams(); // URL에서 categoryId 가져오기
    const userId = localStorage.getItem("user_id");
    const [categoryName, setCategoryName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ✅ 카테고리별 할 일 불러오기
    useEffect(() => {
        const fetchCategoryTasks = async () => {
            try {
                const res = await api.get(
                    `/categories/${userId}/${categoryId}`
                );
                console.log("서버에서 받은 카테고리 데이터:", res.data); // 전체 데이터 확인

                setCategoryName(res.data.category_name);
                setTasks(res.data.tasks || []);

                console.log("불러온 tasks:", res.data.tasks || []); // tasks 확인
            } catch (err) {
                console.error("카테고리 개별 조회 실패:", err);
                alert("카테고리 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryTasks();
    }, [categoryId, userId]);

    // ✅ 상태 변경 (완료/미완료)
    const toggleTaskStatus = async (taskId, currentStatus) => {
        const newStatus = currentStatus === "미완료" ? "완료" : "미완료";
        try {
            const res = await api.put(`/tasks/${taskId}`, {
                status: newStatus,
            });
            console.log(`Task ${taskId} 상태 업데이트 결과:`, res.data); // 업데이트 결과 확인

            // 클라이언트에서 바로 업데이트
            setTasks((prev) =>
                prev.map((t) =>
                    t.task_id === taskId ? { ...t, status: newStatus } : t
                )
            );

            console.log("업데이트 후 tasks 상태:", tasks); // 상태 반영 확인
        } catch (err) {
            console.error("상태 업데이트 실패:", err);
            alert("할 일 상태 업데이트에 실패했습니다.");
        }
    };

    if (loading) return <div>로딩중...</div>;

    return (
        <div style={{ padding: "20px", fontFamily: "Pretendard" }}>
            <h2>{categoryName} 카테고리의 할 일</h2>

            {tasks.length === 0 ? (
                <p>할 일이 없습니다.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {tasks.map((task) => (
                        <li
                            key={task.task_id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={task.status === "완료"}
                                onChange={() =>
                                    toggleTaskStatus(task.task_id, task.status)
                                }
                                style={{ marginRight: "10px" }}
                            />
                            <span
                                style={{
                                    textDecoration:
                                        task.status === "완료"
                                            ? "line-through"
                                            : "none",
                                }}
                            >
                                {task.task_name} ({task.status})
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={() => navigate(-1)}
                style={{
                    marginTop: "20px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#36A862",
                    color: "#fff",
                    cursor: "pointer",
                }}
            >
                뒤로가기
            </button>
        </div>
    );
}

export default CategoryTasks;
