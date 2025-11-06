// ✅ src/components/Todo.js
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./todo.css";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import { addTask, deleteTask, updateTaskStatus } from "../api";

function Todo({
    tasksByDate,
    selectedDate,
    focusedTaskId,
    onDataUpdated,
    categories = [],
}) {
    const [tasksByCategory, setTasksByCategory] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // ✅ 팝업에서 선택한 카테고리
    const [popupIndex, setPopupIndex] = useState({
        category: null,
        index: null,
    });
    const inputRefs = useRef({});
    const [bottomInput, setBottomInput] = useState("");

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

    // ✅ 날짜별 할일 묶기
    useEffect(() => {
        const allCategoryNames = new Set([
            ...categories.map((c) => c.category_name),
            ...tasksByDate.map((t) => t.category_name || "미분류"),
        ]);

        const grouped = tasksByDate.reduce((acc, task) => {
            const categoryName = task.category_name || "미분류";
            if (!acc[categoryName]) acc[categoryName] = [];
            acc[categoryName].push({
                task_name: task.task_name,
                checked: task.status === "완료",
                task_id: task.task_id,
                memo: task.memo || "",
                category_id: task.category?.category_id || null,
                notification_type: task.notification_type || "미알림",
                notification_time: task.notification_time || null,
            });
            return acc;
        }, {});

        const newTasksByCategory = Array.from(allCategoryNames).map(
            (categoryName) => ({
                categoryName,
                tasks: grouped[categoryName] || [],
            })
        );

        setTasksByCategory((prev) => {
            const prevStr = JSON.stringify(prev);
            const nextStr = JSON.stringify(newTasksByCategory);
            return prevStr !== nextStr ? newTasksByCategory : prev;
        });
    }, [tasksByDate, categories]);

    // ✅ 포커스 유지
    useLayoutEffect(() => {
        if (!focusedTaskId) return;
        const el = inputRefs.current[focusedTaskId];
        if (el)
            setTimeout(() => {
                el.focus();
                el.select();
            }, 120);
    }, [focusedTaskId, tasksByCategory]);

    // ✅ 체크 토글
    const toggleChecked = async (catIdx, taskIdx) => {
        const task = tasksByCategory[catIdx].tasks[taskIdx];
        if (!task.task_id)
            return alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");
        const newChecked = !task.checked;
        try {
            await updateTaskStatus(task.task_id, {
                status: newChecked ? "완료" : "미완료",
            });
            setTasksByCategory((prev) => {
                const updated = [...prev];
                updated[catIdx].tasks[taskIdx].checked = newChecked;
                return updated;
            });
            onDataUpdated && onDataUpdated();
        } catch (err) {
            console.error("체크 상태 업데이트 실패:", err);
        }
    };

    // ✅ 새 할일 추가 (상단 +버튼)
    const handleAddTask = async (catIdx, task_name) => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return alert("로그인이 필요합니다.");
        if (!selectedDate) return alert("날짜가 유효하지 않습니다.");

        const localDate = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        );
        const dateStr = localDate.toISOString().split("T")[0];

        const tempId = Date.now() + Math.random();
        const categoryName =
            catIdx != null ? tasksByCategory[catIdx].categoryName : "미분류";

        const matchedCategory = categories.find(
            (c) => c.category_name === categoryName
        );

        // ✅ 팝업에서 선택된 카테고리 우선 적용
        const category_id =
            selectedCategoryId ??
            (matchedCategory ? matchedCategory.category_id : null);

        const targetIdx =
            catIdx != null
                ? catIdx
                : tasksByCategory.findIndex(
                      (c) => c.categoryName === categoryName
                  );

        if (targetIdx === -1) return;

        setTasksByCategory((prev) => {
            const updated = [...prev];
            if (updated[targetIdx].tasks.some((t) => t.isNew)) return updated;
            updated[targetIdx].tasks.unshift({
                task_name: "",
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

    // ✅ 삭제
    const handleDeleteTask = async (catIdx, taskIdx) => {
        const task = tasksByCategory[catIdx].tasks[taskIdx];
        if (task.task_id) {
            try {
                await deleteTask(task.task_id);
                onDataUpdated && onDataUpdated();
            } catch (err) {
                console.error("삭제 실패:", err);
            }
        }
        setTasksByCategory((prev) =>
            prev.map((cat, i) =>
                i !== catIdx
                    ? cat
                    : {
                          ...cat,
                          tasks: cat.tasks.filter((_, j) => j !== taskIdx),
                      }
            )
        );
    };

    // ✅ 팝업 열기/닫기
    const togglePopup = (catIdx, taskIdx) => {
        const task = tasksByCategory[catIdx].tasks[taskIdx];
        if (!task.task_id)
            return alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");
        setPopupIndex((prev) =>
            prev.category === catIdx && prev.index === taskIdx
                ? { category: null, index: null }
                : { category: catIdx, index: taskIdx }
        );
    };

    if (!tasksByCategory.length)
        return <div className="no-task-text">오늘은 할 일이 없습니다.</div>;

    return (
        <div className="todo-container">
            {tasksByCategory.map((group, catIdx) => (
                <div key={group.categoryName} className="category-group">
                    {group.tasks.map((task, taskIdx) => (
                        <div
                            key={task.task_id || task._tempId}
                            className={`task-item ${
                                task.checked ? "checked" : ""
                            }`}
                        >
                            <div className="task-content">
                                <div className="task-left">
                                    <button
                                        className={`task-check-btn ${
                                            task.checked ? "checked" : ""
                                        }`}
                                        onClick={() =>
                                            toggleChecked(catIdx, taskIdx)
                                        }
                                    >
                                        {task.checked && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                            >
                                                <rect
                                                    width="20"
                                                    height="20"
                                                    rx="10"
                                                    fill="#36A862"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M15.8 7.18c.13.12.2.28.2.44 0 .17-.07.33-.2.45l-6.15 5.76a.66.66 0 0 1-.47.17.66.66 0 0 1-.47-.17L5.2 10.52a.66.66 0 0 1-.14-.36c0-.13.03-.25.09-.36a.6.6 0 0 1 .26-.24.7.7 0 0 1 .46-.05.7.7 0 0 1 .39.2l3.05 2.86 5.7-5.39a.66.66 0 0 1 .94.04z"
                                                    fill="#fff"
                                                />
                                            </svg>
                                        )}
                                    </button>

                                    <input
                                        type="text"
                                        ref={(el) =>
                                            setInputRef(
                                                task.task_id || task._tempId,
                                                el
                                            )
                                        }
                                        className={`task-text-input ${
                                            task.checked ? "checked" : ""
                                        }`}
                                        value={task.task_name}
                                        disabled={!!task.task_id}
                                        onChange={(e) => {
                                            if (task.task_id) return;
                                            const val = e.target.value;
                                            setTasksByCategory((prev) => {
                                                const updated = [...prev];
                                                updated[catIdx].tasks[
                                                    taskIdx
                                                ].task_name = val;
                                                return updated;
                                            });
                                        }}
                                        onBlur={async () => {
                                            if (task.task_id || !task.isNew)
                                                return;
                                            if (!task.task_name.trim()) {
                                                setTasksByCategory((prev) => {
                                                    const updated = [...prev];
                                                    updated[
                                                        catIdx
                                                    ].tasks.splice(taskIdx, 1);
                                                    return updated;
                                                });
                                                return;
                                            }

                                            const user_id =
                                                localStorage.getItem("user_id");
                                            if (!user_id)
                                                return alert(
                                                    "로그인이 필요합니다."
                                                );

                                            const localDate = new Date(
                                                selectedDate.getTime() -
                                                    selectedDate.getTimezoneOffset() *
                                                        60000
                                            );
                                            const dateStr = localDate
                                                .toISOString()
                                                .split("T")[0];

                                            const category_id =
                                                selectedCategoryId ??
                                                task.category_id ??
                                                null;

                                            try {
                                                await addTask({
                                                    task_name: task.task_name,
                                                    memo: "",
                                                    task_date: dateStr,
                                                    category_id,
                                                    user_id: Number(user_id),
                                                    notification_type: "미알림",
                                                    notification_time: null,
                                                });
                                                onDataUpdated &&
                                                    onDataUpdated();
                                            } catch (err) {
                                                console.error(
                                                    "추가 실패:",
                                                    err
                                                );
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (task.task_id) return;
                                            if (e.key === "Enter")
                                                e.target.blur();
                                            if (
                                                e.key === "Escape" &&
                                                task.isNew
                                            ) {
                                                setTasksByCategory((prev) => {
                                                    const updated = [...prev];
                                                    updated[
                                                        catIdx
                                                    ].tasks.splice(taskIdx, 1);
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
                                    <img
                                        src={ThreeIcon}
                                        alt="menu"
                                        width="20"
                                    />
                                </button>
                            </div>

                            {popupIndex.category === catIdx &&
                                popupIndex.index === taskIdx && (
                                    <TaskOptionsPopup
                                        taskId={task.task_id}
                                        taskData={task}
                                        userId={localStorage.getItem("user_id")}
                                        selectedCategoryId={selectedCategoryId}
                                        onCategorySelect={(id) =>
                                            setSelectedCategoryId(id)
                                        } // ✅ 추가
                                        onClose={() =>
                                            setPopupIndex({
                                                category: null,
                                                index: null,
                                            })
                                        }
                                        onDelete={() =>
                                            handleDeleteTask(catIdx, taskIdx)
                                        }
                                        onEditConfirm={(updatedTask) => {
                                            setTasksByCategory((prev) => {
                                                const updated = [...prev];
                                                updated[catIdx].tasks[taskIdx] =
                                                    {
                                                        ...updated[catIdx]
                                                            .tasks[taskIdx],
                                                        ...updatedTask,
                                                    };
                                                return updated;
                                            });
                                            onDataUpdated && onDataUpdated();
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
