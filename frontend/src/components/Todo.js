import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./todo.css";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import { addTask, deleteTask, updateTaskStatus } from "../api";

function Todo({ tasksByDate, selectedDate, focusedTaskId, onDataUpdated }) {
    const [tasks, setTasks] = useState([]);
    const [popupIndex, setPopupIndex] = useState(null);
    const inputRefs = useRef({});
    const bottomInputRef = useRef(null);
    const [bottomInput, setBottomInput] = useState("");
    const tasksContainerRef = useRef(null);

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

    useEffect(() => {
        setTasks(
            tasksByDate.map((task) => ({
                text: task.task_name,
                checked: task.status === "완료",
                task_id: task.task_id,
                memo: task.memo || "",
                notification_type: task.notification_type || "미알림",
                notification_time: task.notification_time || null,
            }))
        );
    }, [tasksByDate]);

    useLayoutEffect(() => {
        if (!focusedTaskId) return;
        const inputEl = inputRefs.current[focusedTaskId];
        if (inputEl) setTimeout(() => inputEl.focus(), 120);
    }, [focusedTaskId, tasks]);

    const toggleChecked = async (taskIdx) => {
        const task = tasks[taskIdx];
        if (!task.task_id)
            return alert("서버에 저장된 할 일을 먼저 선택하세요.");
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
            if (onDataUpdated) onDataUpdated();
        } catch (err) {
            console.error("체크 상태 업데이트 실패:", err);
        }
    };

    /** 하단 입력창에서 엔터 → 상단 리스트에 추가 */
    const handleBottomInputEnter = async (e) => {
        if (e.key !== "Enter") return;
        const text = bottomInput.trim();
        if (!text) return;

        const user_id = localStorage.getItem("user_id");
        if (!user_id) return alert("로그인이 필요합니다.");
        if (!selectedDate) return alert("날짜가 유효하지 않습니다.");

        const localDate = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        );
        const dateStr = localDate.toISOString().split("T")[0];

        try {
            // 서버 저장
            const result = await addTask({
                task_name: text,
                memo: "",
                task_date: dateStr,
                user_id: Number(user_id),
                notification_type: "미알림",
                notification_time: null,
            });

            const savedTask = result.task;

            // tasks 상단에 추가
            setTasks((prev) => [
                {
                    text: savedTask.task_name,
                    checked: savedTask.status === "완료",
                    task_id: savedTask.task_id,
                    memo: savedTask.memo || "",
                    notification_type: savedTask.notification_type || "미알림",
                    notification_time: savedTask.notification_time || null,
                },
                ...prev,
            ]);

            setBottomInput(""); // 입력창 초기화
            if (onDataUpdated) onDataUpdated();

            // 스크롤 맨 위로 이동
            setTimeout(() => {
                if (tasksContainerRef.current)
                    tasksContainerRef.current.scrollTop = 0;
            }, 50);
        } catch (err) {
            console.error("Task 저장 실패:", err);
        }
    };

    const handleDeleteTask = async (taskIdx) => {
        const task = tasks[taskIdx];
        if (task.task_id) {
            try {
                await deleteTask(task.task_id);
                if (onDataUpdated) onDataUpdated();
            } catch (err) {
                console.error("Task 삭제 실패:", err);
            }
        }
        setTasks((prev) => prev.filter((_, idx) => idx !== taskIdx));
        if (popupIndex === taskIdx) setPopupIndex(null);
    };

    const togglePopup = (taskIdx) => {
        const task = tasks[taskIdx];
        if (!task.task_id)
            return alert("서버에 저장된 할 일을 먼저 선택하세요.");
        setPopupIndex(popupIndex === taskIdx ? null : taskIdx);
    };

    return (
        <div className="todo-container">
            <div className="tasks-scroll" ref={tasksContainerRef}>
                {tasks.map((task, idx) => (
                    <div
                        key={task.task_id}
                        className={`task-item ${task.checked ? "checked" : ""}`}
                    >
                        <div className="task-content">
                            <div className="task-left">
                                <button
                                    className={`task-check-btn ${
                                        task.checked ? "checked" : ""
                                    }`}
                                    onClick={() => toggleChecked(idx)}
                                />
                                <input
                                    type="text"
                                    ref={(el) => setInputRef(task.task_id, el)}
                                    className={`task-text-input ${
                                        task.checked ? "checked" : ""
                                    }`}
                                    value={task.text}
                                    disabled={!!task.task_id}
                                />
                            </div>

                            <button
                                className="task-menu-btn"
                                onClick={() => togglePopup(idx)}
                            >
                                <img
                                    src={ThreeIcon}
                                    alt="menu"
                                    style={{ width: 20 }}
                                />
                            </button>
                        </div>

                        {task.notification_type === "알림" &&
                            task.notification_time && (
                                <p className="task-time">
                                    {formatTime(task.notification_time)}
                                </p>
                            )}

                        {task.memo && <p className="task-memo">{task.memo}</p>}

                        {popupIndex === idx && (
                            <TaskOptionsPopup
                                taskId={task.task_id}
                                taskData={task}
                                userId={localStorage.getItem("user_id")}
                                onClose={() => setPopupIndex(null)}
                                onDelete={() => handleDeleteTask(idx)}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* 하단 고정 입력창 */}
            <div className="task-add-fixed">
                <input
                    ref={bottomInputRef}
                    type="text"
                    placeholder="오늘 할 일을 입력하세요"
                    value={bottomInput}
                    onChange={(e) => setBottomInput(e.target.value)}
                    onKeyDown={handleBottomInputEnter}
                    className="task-bottom-input"
                />
            </div>
        </div>
    );
}

export default Todo;
