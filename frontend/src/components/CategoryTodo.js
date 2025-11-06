import React, { useRef } from "react";
import "./todo.css";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import { deleteTask, updateTaskStatus } from "../api";

function CategoryTodo({ tasks, updateTaskInState, onDataUpdated }) {
    const [popupIndex, setPopupIndex] = React.useState({
        category: null,
        index: null,
    });
    const inputRefs = useRef({});

    const setInputRef = (id, el) => {
        if (el) inputRefs.current[id] = el;
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr.padStart(2, "0");
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${ampm} ${hour}:${minute}`;
    };

    const toggleChecked = async (taskIdx) => {
        const task = tasks[taskIdx];
        if (!task.task_id) return alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");

        const newChecked = !task.checked;
        try {
            await updateTaskStatus(task.task_id, {
                status: newChecked ? "완료" : "미완료",
            });

            // 부모 함수로 상태 업데이트
            updateTaskInState({ ...task, checked: newChecked });
            onDataUpdated && onDataUpdated();
        } catch (err) {
            console.error("체크 상태 업데이트 실패:", err);
        }
    };

    const handleDeleteTask = async (taskIdx) => {
        const task = tasks[taskIdx];
        if (task.task_id) {
            try {
                await deleteTask(task.task_id);

                // 삭제 후 부모에서 상태 갱신
                onDataUpdated && onDataUpdated();
            } catch (err) {
                console.error("삭제 실패:", err);
            }
        }
    };

    const togglePopup = (taskIdx) => {
        const task = tasks[taskIdx];
        if (!task.task_id) return alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");

        setPopupIndex((prev) => (prev.index === taskIdx ? { category: null, index: null } : { category: null, index: taskIdx }));
    };

    if (!tasks || tasks.length === 0) return <div className="no-task-text">이 카테고리에 할 일이 없습니다.</div>;

    return (
        <div className="todo-container">
            {tasks.map((task, taskIdx) => (
                <div key={task.task_id || taskIdx} className={`task-item ${task.checked ? "checked" : ""}`}>
                    <div className="task-content">
                        <div className="task-left">
                            <button className={`task-check-btn ${task.checked ? "checked" : ""}`} onClick={() => toggleChecked(taskIdx)}>
                                {task.checked && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                        <rect width="20" height="20" rx="10" fill="#36A862" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M15.8 7.18c.13.12.2.28.2.44 0 .17-.07.33-.2.45l-6.15 5.76a.66.66 0 0 1-.47.17.66.66 0 0 1-.47-.17L5.2 10.52a.66.66 0 0 1-.14-.36c0-.13.03-.25.09-.36a.6.6 0 0 1 .26-.24.7.7 0 0 1 .46-.05.7.7 0 0 1 .39.2l3.05 2.86 5.7-5.39a.66.66 0 0 1 .94.04z" fill="#fff" />
                                    </svg>
                                )}
                            </button>
                            <p className="task-text">{task.task_name}</p>
                        </div>

                        <button
                            className="task-menu-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePopup(taskIdx);
                            }}
                        >
                            <img src={ThreeIcon} alt="menu" width="20" />
                        </button>
                    </div>

                    {task.memo && (
                        <div className="task-memo-content">
                            <svg className="task-time-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M5.13889 7.35294H14.8611M5 8.55529C5 7.31118 5 6.68882 5.24222 6.21353C5.46125 5.78959 5.80111 5.44971 6.21333 5.24235C6.68889 5 7.31111 5 8.55556 5H11.4444C12.6889 5 13.3111 5 13.7867 5.24235C14.205 5.45529 14.5444 5.79529 14.7578 6.21294C15 6.68941 15 7.31176 15 8.55588V11.4453C15 12.6894 15 13.3118 14.7578 13.7871C14.5388 14.211 14.1989 14.5509 13.7867 14.7582C13.3111 15 12.6889 15 11.4444 15H8.55556C7.31111 15 6.68889 15 6.21333 14.7576C5.80119 14.5504 5.46134 14.2108 5.24222 13.7871C5 13.3106 5 12.6882 5 11.4441V8.55529Z"
                                    stroke="#595959"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path d="M8 10H12" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 12H12" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="task-memo">{task.memo}</p>
                        </div>
                    )}

                    {task.notification_type === "알림" && task.notification_time && (
                        <div className="task-time-content">
                            <svg className="task-time-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 15.5C12.76 15.5 15 13.26 15 10.5C15 7.74 12.76 5.5 10 5.5C7.24 5.5 5 7.74 5 10.5C5 13.26 7.24 15.5 10 15.5Z" stroke="#595959" />
                                <path d="M10 8.333V10.555L11.389 11.944" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="task-time">{formatTime(task.notification_time)}</p>
                        </div>
                    )}
                </div>
            ))}

            {popupIndex.index !== null && (
                <TaskOptionsPopup
                    taskId={tasks[popupIndex.index]?.task_id}
                    taskData={tasks[popupIndex.index]}
                    userId={localStorage.getItem("user_id")}
                    onClose={() => setPopupIndex({ category: null, index: null })}
                    onDelete={() => handleDeleteTask(popupIndex.index)}
                    onEditConfirm={(updatedTask) => {
                        updateTaskInState(updatedTask); // ✅ 부모 함수 사용
                        onDataUpdated && onDataUpdated();
                    }}
                />
            )}
        </div>
    );
}

export default CategoryTodo;
