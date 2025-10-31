import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./todo.css";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import { addTask, deleteTask, updateTaskStatus, updateTask } from "../api";

function Todo({ tasksByDate, selectedDate, focusedTaskId, onDataUpdated, categories = [] }) {
    const [tasksByCategory, setTasksByCategory] = useState([]);
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

    /** tasksByDate → tasksByCategory 변환 + 빈 카테고리 유지 */
    useEffect(() => {
        // ✅ 전체 카테고리 이름을 categories 배열에서 가져오기
        const allCategoryNames = new Set([...categories.map((c) => c.category_name), ...tasksByDate.map((t) => t.category?.category_name || "미분류")]);

        const grouped = tasksByDate.reduce((acc, task) => {
            const categoryName = task.category?.category_name || "미분류";
            if (!acc[categoryName]) acc[categoryName] = [];
            acc[categoryName].push({
                text: task.task_name,
                checked: task.status === "완료",
                task_id: task.task_id,
                memo: task.memo || "",
                category_id: task.category?.category_id || null,
                notification_type: task.notification_type || "미알림",
                notification_time: task.notification_time || null,
                routine_type: task.routine_type || "",
                period_start: task.period_start || null,
                period_end: task.period_end || null,
            });
            return acc;
        }, {});

        // ✅ 빈 카테고리도 항상 표시되게
        const newTasksByCategory = Array.from(allCategoryNames).map((categoryName) => {
            const prevCategory = tasksByCategory.find((c) => c.categoryName === categoryName);
            const existingTasks = grouped[categoryName] || [];
            const newTasks = prevCategory ? prevCategory.tasks.filter((t) => t.isNew && !existingTasks.some((s) => s._tempId === t._tempId)) : [];
            return { categoryName, tasks: [...newTasks, ...existingTasks] };
        });

        setTasksByCategory(newTasksByCategory);
    }, [tasksByDate, categories]);

    /** focusedTaskId 포커스 */
    useLayoutEffect(() => {
        if (!focusedTaskId) return;
        const inputEl = inputRefs.current[focusedTaskId];
        if (inputEl)
            setTimeout(() => {
                inputEl.focus();
                inputEl.select();
            }, 120);
    }, [focusedTaskId, tasksByCategory]);

    /** 체크 토글 */
    const toggleChecked = async (catIdx, taskIdx) => {
        const task = tasksByCategory[catIdx].tasks[taskIdx];
        if (!task.task_id) return alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");
        const newChecked = !task.checked;
        try {
            await updateTaskStatus(task.task_id, {
                status: newChecked ? "완료" : "미완료",
            });
            if (onDataUpdated) onDataUpdated();
            setTasksByCategory((prev) => {
                const updated = [...prev];
                updated[catIdx].tasks[taskIdx].checked = newChecked;
                return updated;
            });
        } catch (err) {
            console.error("체크 상태 업데이트 실패:", err);
        }
    };

    /** 새 Task 추가 */
    const handleAddTask = (catIdx) => {
        const tempId = Date.now() + Math.random();
        const categoryName = tasksByCategory[catIdx].categoryName;

        const matchedCategory = categories.find((c) => c.category_name === categoryName);
        const category_id = matchedCategory ? matchedCategory.category_id : null;

        setTasksByCategory((prev) => {
            const updated = [...prev];
            if (updated[catIdx].tasks.some((t) => t.isNew)) return updated;
            updated[catIdx].tasks.unshift({
                text: "",
                checked: false,
                isNew: true,
                category_id,
                _tempId: tempId,
            });
            return updated;
        });

        setTimeout(() => {
            const el = inputRefs.current[tempId];
            if (el) el.focus();
        }, 50);
    };

    /** Task 삭제 */
    const handleDeleteTask = async (catIdx, taskIdx) => {
        const task = tasksByCategory[catIdx].tasks[taskIdx];
        if (task.task_id) {
            try {
                await deleteTask(task.task_id);
                if (onDataUpdated) onDataUpdated();
            } catch (err) {
                console.error("Task 삭제 실패:", err);
            }
        }
        setTasksByCategory((prev) => prev.map((cat, idx) => (idx !== catIdx ? cat : { ...cat, tasks: cat.tasks.filter((_, tIdx) => tIdx !== taskIdx) })));
        setPopupIndex((prev) => (prev.category === catIdx && prev.index === taskIdx ? { category: null, index: null } : prev));
    };

    /** 팝업 토글 */
    const togglePopup = (catIdx, taskIdx) => {
        const task = tasksByCategory[catIdx].tasks[taskIdx];
        if (!task.task_id) return alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");
        setPopupIndex((prev) => (prev.category === catIdx && prev.index === taskIdx ? { category: null, index: null } : { category: catIdx, index: taskIdx }));
    };

    if (!tasksByCategory.length) return <div className="no-task-text">오늘은 할 일이 없습니다.</div>;

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
                        <div key={task.task_id || task._tempId} className={`task-item ${task.checked ? "checked" : ""}`}>
                            <div className="task-content">
                                <div className="task-left">
                                    <button className={`task-check-btn ${task.checked ? "checked" : ""}`} onClick={() => toggleChecked(catIdx, taskIdx)}>
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
                                        className={`task-text-input ${task.checked ? "checked" : ""}`}
                                        value={task.text}
                                        disabled={!!task.task_id}
                                        onChange={(e) => {
                                            if (task.task_id) return;
                                            const newText = e.target.value;
                                            setTasksByCategory((prev) => {
                                                const updated = [...prev];
                                                updated[catIdx].tasks[taskIdx].text = newText;
                                                return updated;
                                            });
                                        }}
                                        onBlur={async () => {
                                            if (task.task_id || !task.isNew) return;
                                            if (!task.text.trim()) {
                                                setTasksByCategory((prev) => {
                                                    const updated = [...prev];
                                                    updated[catIdx].tasks.splice(taskIdx, 1);
                                                    return updated;
                                                });
                                                return;
                                            }

                                            const user_id = localStorage.getItem("user_id");
                                            if (!user_id) return alert("로그인이 필요합니다.");

                                            const category_id = task.category_id || group.tasks[0]?.category_id;
                                            if (!category_id) return alert("카테고리를 선택해주세요.");
                                            if (!selectedDate) return alert("날짜가 유효하지 않습니다.");

                                            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                                            const dateStr = localDate.toISOString().split("T")[0];

                                            try {
                                                const result = await addTask({
                                                    task_name: task.text,
                                                    memo: "",
                                                    task_date: dateStr,
                                                    category_id: Number(category_id),
                                                    user_id: Number(user_id),
                                                    notification_type: "미알림",
                                                    notification_time: null,
                                                });
                                                if (onDataUpdated) onDataUpdated();
                                                const savedTask = result.task;
                                                setTasksByCategory((prev) => {
                                                    const updated = [...prev];
                                                    updated[catIdx].tasks[taskIdx] = {
                                                        text: savedTask.task_name,
                                                        checked: savedTask.status === "완료",
                                                        task_id: savedTask.task_id,
                                                        memo: savedTask.memo || "",
                                                        category_id: savedTask.category_id,
                                                        notification_type: savedTask.notification_type || "미알림",
                                                        notification_time: savedTask.notification_time || null,
                                                        routine_type: savedTask.routine_type || "",
                                                        period_start: savedTask.period_start || null,
                                                        period_end: savedTask.period_end || null,
                                                    };
                                                    return updated;
                                                });
                                            } catch (err) {
                                                console.error("Task 자동 저장 실패:", err);
                                            }
                                        }}
                                        onKeyDown={async (e) => {
                                            if (task.task_id) return;
                                            if (e.key === "Enter") {
                                                e.target.blur();
                                            }
                                            if (e.key === "Escape" && task.isNew) {
                                                setTasksByCategory((prev) => {
                                                    const updated = [...prev];
                                                    updated[catIdx].tasks.splice(taskIdx, 1);
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
                                        togglePopup(catIdx, taskIdx);
                                    }}
                                >
                                    <img src={ThreeIcon} alt="menu" style={{ width: "20px" }} />
                                </button>
                            </div>

                            {task.notification_type === "알림" && task.notification_time && <p className="task-time">{formatTime(task.notification_time)}</p>}

                            {task.memo && <p className="task-memo">{task.memo}</p>}

                            {popupIndex.category === catIdx && popupIndex.index === taskIdx && (
                                <TaskOptionsPopup
                                    style={{ top: "40px", right: "0" }}
                                    taskId={task.task_id}
                                    taskData={task}
                                    userId={localStorage.getItem("user_id")}
                                    onClose={() =>
                                        setPopupIndex({
                                            category: null,
                                            index: null,
                                        })
                                    }
                                    onDelete={() => handleDeleteTask(catIdx, taskIdx)}
                                    onEditConfirm={async (updatedTask) => {
                                        setTasksByCategory((prev) => {
                                            const updated = [...prev];
                                            updated[catIdx].tasks[taskIdx] = {
                                                ...updated[catIdx].tasks[taskIdx],
                                                ...updatedTask,
                                            };
                                            return updated;
                                        });
                                        if (onDataUpdated) onDataUpdated();
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Todo;
