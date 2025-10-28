import React, { useState, useEffect } from "react";
import "./todo.css";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import { addTask, deleteTask, updateTaskStatus } from "../api";

function Todo({ tasksByDate, selectedDate }) {
    const [tasksByCategory, setTasksByCategory] = useState([]);
    const [popupIndex, setPopupIndex] = useState({ category: null, index: null });

    useEffect(() => {
        if (!Array.isArray(tasksByDate) || tasksByDate.length === 0) {
            // ✅ 기본 카테고리 생성
            setTasksByCategory([
                {
                    categoryName: "카테고리 01",
                    category_id: null,
                    tasks: [
                        {
                            text: "할일 01",
                            checked: false,
                            task_id: null,
                            memo: "",
                        },
                    ],
                },
            ]);
            return;
        }

        const grouped = tasksByDate.reduce((acc, task) => {
            const categoryName = task.category?.category_name || "미분류";
            if (!acc[categoryName]) acc[categoryName] = [];
            acc[categoryName].push({
                text: task.task_name,
                checked: task.status === "완료",
                task_id: task.task_id,
                memo: task.memo || "",
                category_id: task.category?.category_id || null,
            });
            return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([categoryName, tasks]) => ({
            categoryName,
            tasks,
        }));

        setTasksByCategory(formatted);
    }, [tasksByDate]);

    // ✅ 체크 상태 변경
    const toggleChecked = async (catIdx, taskIdx) => {
        const task = tasksByCategory[catIdx].tasks[taskIdx];
        const newChecked = !task.checked;

        if (!task.task_id) {
            console.log("서버에 등록되지 않은 로컬 Task입니다.");
            return;
        }

        try {
            await updateTaskStatus(task.task_id, { status: newChecked ? "완료" : "미완료" });
            setTasksByCategory((prev) => {
                const updated = [...prev];
                updated[catIdx].tasks[taskIdx].checked = newChecked;
                return updated;
            });
        } catch (err) {
            console.error("체크 상태 업데이트 실패:", err);
        }
    };

    // ✅ 할일 추가
    const handleAddTask = (catIdx) => {
        setTasksByCategory((prev) => {
            const newList = [...prev];
            const nextNumber = newList[catIdx].tasks.length + 1;
            newList[catIdx].tasks.push({
                text: `할일 ${String(nextNumber).padStart(2, "0")}`,
                checked: false,
                task_id: null,
                memo: "",
            });
            return newList;
        });
    };

    // ✅ 할일 삭제
    const handleDeleteTask = async (catIdx, taskIdx) => {
        const task = tasksByCategory[catIdx].tasks[taskIdx];
        if (task.task_id) {
            try {
                await deleteTask(task.task_id);
            } catch (err) {
                console.error("Task 삭제 실패:", err);
            }
        }
        setTasksByCategory((prev) => {
            const newList = [...prev];
            newList[catIdx].tasks.splice(taskIdx, 1);
            return newList;
        });
    };

    // ✅ 팝업 열기/닫기
    const togglePopup = (catIdx, taskIdx) => {
        setPopupIndex((prev) => (prev.category === catIdx && prev.index === taskIdx ? { category: null, index: null } : { category: catIdx, index: taskIdx }));
    };

    if (!tasksByCategory.length) {
        return <div className="no-task-text">오늘은 할 일이 없습니다.</div>;
    }

    return (
        <div className="todo-container">
            {tasksByCategory.map((group, catIdx) => (
                <div key={group.categoryName} className="category-group">
                    <div className="category-header">
                        <h3 className="category-title">{group.categoryName}</h3>
                        <button className="task-add-btn" onClick={() => handleAddTask(catIdx)}>
                            +
                        </button>
                    </div>

                    {group.tasks.map((task, taskIdx) => (
                        <div key={task.task_id || taskIdx} className={`task-item ${task.checked ? "checked" : ""}`}>
                            {/* 체크 버튼 */}
                            <button className={`task-check-btn ${task.checked ? "checked" : ""}`} onClick={() => toggleChecked(catIdx, taskIdx)}>
                                {task.checked && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                                        <rect width="20" height="20" rx="10" fill="#36A862" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M15.8 7.18c.13.12.2.28.2.44 0 .17-.07.33-.2.45l-6.15 5.76a.66.66 0 0 1-.47.17.66.66 0 0 1-.47-.17L5.2 10.52a.66.66 0 0 1-.14-.36c0-.13.03-.25.09-.36a.6.6 0 0 1 .26-.24.7.7 0 0 1 .46-.05.7.7 0 0 1 .39.2l3.05 2.86 5.7-5.39a.66.66 0 0 1 .94.04z" fill="#fff" />
                                    </svg>
                                )}
                            </button>

                            {/* 할일 버튼 */}
                            <button className={`task-text-btn ${task.checked ? "checked" : ""}`} onClick={() => {}}>
                                {task.text}
                            </button>

                            {/* “…” 버튼 */}
                            <button
                                className="task-menu-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePopup(catIdx, taskIdx);
                                }}
                            >
                                <img src={ThreeIcon} alt="menu" style={{ width: "20px" }} />
                            </button>

                            {/* 팝업 */}
                            {popupIndex.category === catIdx && popupIndex.index === taskIdx && <TaskOptionsPopup style={{ top: "40px", right: "0" }} onClose={() => setPopupIndex({ category: null, index: null })} onDelete={() => handleDeleteTask(catIdx, taskIdx)} />}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Todo;
