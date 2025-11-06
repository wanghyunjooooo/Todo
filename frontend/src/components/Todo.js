import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./todo.css";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import { addTask, deleteTask, updateTaskStatus } from "../api";

function Todo({ tasksByDate, selectedDate, focusedTaskId, onDataUpdated, categories = [] }) {
    const [tasks, setTasks] = useState([]);
    const [popupIndex, setPopupIndex] = useState({
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

    // ✅ 모든 할 일 불러오기
    useEffect(() => {
        const allTasks = tasksByDate.map((task) => ({
            task_name: task.task_name,
            checked: task.status === "완료",
            task_id: task.task_id,
            memo: task.memo || "",
            category_id: task.category?.category_id || null,
            notification_type: task.notification_type || "미알림",
            notification_time: task.notification_time || null,
            routine_type: task.routine_type || "",
            routine_id: task.routine_id || null,
            period_start: task.period_start || null,
            period_end: task.period_end || null,
        }));

        setTasks(allTasks);
    }, [tasksByDate]);

    // ✅ 포커스 유지
    useLayoutEffect(() => {
        if (!focusedTaskId) return;
        const el = inputRefs.current[focusedTaskId];
        if (el)
            setTimeout(() => {
                el.focus();
                el.select();
            }, 120);
    }, [focusedTaskId, tasks]);

    // ✅ 체크 토글
    const toggleChecked = async (taskIdx) => {
        const task = tasks[taskIdx];
        if (!task.task_id) return alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");
        const newChecked = !task.checked;
        try {
            await updateTaskStatus(task.task_id, {
                status: newChecked ? "완료" : "미완료",
            });
            setTasks((prev) => {
                const updated = [...prev];
                updated[taskIdx].checked = newChecked;
                return updated;
            });
            onDataUpdated && onDataUpdated();
        } catch (err) {
            console.error("체크 상태 업데이트 실패:", err);
        }
    };

    // ✅ 새 할일 추가 (상단 +버튼)
    const handleAddTask = async (task_name) => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return alert("로그인이 필요합니다.");
        if (!selectedDate) return alert("날짜가 유효하지 않습니다.");

        const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
        const dateStr = localDate.toISOString().split("T")[0];

        const tempId = Date.now() + Math.random();

        setTasks((prev) => {
            const updated = [...prev];
            updated.unshift({
                task_name: "",
                checked: false,
                isNew: true,
                _tempId: tempId,
            });
            return updated;
        });

        setTimeout(() => {
            const el = inputRefs.current[tempId];
            if (el) el.focus();
        }, 50);
    };

    // ✅ 삭제
    const handleDeleteTask = async (taskIdx) => {
        const task = tasks[taskIdx];
        if (task.task_id) {
            try {
                await deleteTask(task.task_id);
                onDataUpdated && onDataUpdated();
            } catch (err) {
                console.error("삭제 실패:", err);
            }
        }
        setTasks((prev) => prev.filter((_, i) => i !== taskIdx));
    };

    // ✅ 팝업 열기/닫기
    const togglePopup = (taskIdx) => {
        const task = tasks[taskIdx];
        if (!task.task_id) return alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");
        setPopupIndex((prev) => (prev.index === taskIdx ? { category: null, index: null } : { category: null, index: taskIdx }));
    };

    if (!tasks.length) return <div className="no-task-text">오늘은 할 일이 없습니다.</div>;

    return (
        <div className="todo-container">
            {tasks.map((task, taskIdx) => (
                <div key={task.task_id || task._tempId} className={`task-item ${task.checked ? "checked" : ""}`}>
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

                            <input
                                type="text"
                                ref={(el) => setInputRef(task.task_id || task._tempId, el)}
                                className={`task-text ${task.checked ? "checked" : ""}`}
                                value={task.task_name}
                                disabled={!!task.task_id}
                                onChange={(e) => {
                                    if (task.task_id) return;
                                    const newText = e.target.value;
                                    setTasks((prev) => {
                                        const updated = [...prev];
                                        updated[taskIdx].task_name = newText;
                                        return updated;
                                    });
                                }}
                                onBlur={async () => {
                                    if (task.task_id || !task.isNew) return;
                                    if (!task.task_name.trim()) {
                                        setTasks((prev) => {
                                            const updated = [...prev];
                                            updated.splice(taskIdx, 1);
                                            return updated;
                                        });
                                        return;
                                    }

                                    const user_id = localStorage.getItem("user_id");
                                    if (!user_id) return alert("로그인이 필요합니다.");

                                    const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                                    const dateStr = localDate.toISOString().split("T")[0];

                                    try {
                                        await addTask({
                                            task_name: task.task_name,
                                            memo: "",
                                            task_date: dateStr,
                                            category_id: null,
                                            user_id: Number(user_id),
                                            notification_type: "미알림",
                                            notification_time: null,
                                        });
                                        onDataUpdated && onDataUpdated();
                                    } catch (err) {
                                        console.error("추가 실패:", err);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (task.task_id) return;
                                    if (e.key === "Enter") e.target.blur();
                                    if (e.key === "Escape" && task.isNew) {
                                        setTasks((prev) => {
                                            const updated = [...prev];
                                            updated.splice(taskIdx, 1);
                                            return updated;
                                        });
                                    }
                                }}
                            />
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
                                <path d="M9.99999 15.5555C12.7614 15.5555 15 13.317 15 10.5555C15 7.79412 12.7614 5.55554 9.99999 5.55554C7.23857 5.55554 5 7.79412 5 10.5555C5 13.317 7.23857 15.5555 9.99999 15.5555Z" stroke="#595959" />
                                <path d="M10 8.33334V10.5556L11.3889 11.9444M5.27783 5.83335L7.50005 4.44446M14.7223 5.83335L12.5 4.44446" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="task-time">{formatTime(task.notification_time)}</p>
                        </div>
                    )}

                    {popupIndex.index === taskIdx && (
                        <TaskOptionsPopup
                            taskId={task.task_id}
                            taskData={task}
                            userId={localStorage.getItem("user_id")}
                            onClose={() => setPopupIndex({ category: null, index: null })}
                            onDelete={() => handleDeleteTask(taskIdx)}
                            onEditConfirm={(updatedTask) => {
                                setTasks((prev) => {
                                    const updated = [...prev];
                                    updated[taskIdx] = { ...updated[taskIdx], ...updatedTask };
                                    return updated;
                                });
                                if (onDataUpdated) onDataUpdated();
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Todo;
