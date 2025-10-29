import React, { useState, useEffect } from "react";
import "./todo.css";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import { addTask, deleteTask, updateTaskStatus } from "../api";

function Todo({ tasksByDate, selectedDate }) {
  const [tasksByCategory, setTasksByCategory] = useState([]);
  const [popupIndex, setPopupIndex] = useState({ category: null, index: null });

  // ✅ tasksByDate → tasksByCategory 변환 (isNew 유지, 중복 방지)
  useEffect(() => {
    if (!Array.isArray(tasksByDate) || tasksByDate.length === 0) {
      setTasksByCategory((prev) => {
        const newTasks = prev.flatMap((cat) =>
          cat.tasks.filter((t) => t.isNew)
        );
        return newTasks.length
          ? [{ categoryName: "미분류", tasks: newTasks }]
          : [];
      });
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

    const newTasksByCategory = Object.entries(grouped).map(
      ([categoryName, tasks]) => {
        const prevCategory = tasksByCategory.find(
          (c) => c.categoryName === categoryName
        );
        // 중복 방지: 기존 isNew Task가 _tempId 기준으로 서버 Task와 겹치지 않도록
        const isNewTasks = prevCategory
          ? prevCategory.tasks.filter(
              (t) => t.isNew && !tasks.some((s) => s._tempId === t._tempId)
            )
          : [];
        return {
          categoryName,
          tasks: [...isNewTasks, ...tasks],
        };
      }
    );

    setTasksByCategory(newTasksByCategory);
  }, [tasksByDate]);

  // ✅ 체크 상태 토글
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
    } catch (err) {
      console.error("체크 상태 업데이트 실패:", err);
    }
  };

  // ✅ 새 Task 추가 (빈 input, 중복 방지)
  const handleAddTask = (catIdx) => {
    setTasksByCategory((prev) => {
      const updated = [...prev];
      // 이미 isNew Task가 있으면 추가하지 않음
      const hasNewTask = updated[catIdx].tasks.some((t) => t.isNew);
      if (hasNewTask) return updated;

      const newTask = {
        text: "",
        checked: false,
        isNew: true,
        category_id: updated[catIdx].tasks[0]?.category_id || null,
        _tempId: Date.now() + Math.random(),
      };
      updated[catIdx].tasks.push(newTask);
      return updated;
    });
  };

  // ✅ Task 삭제
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
      const updated = [...prev];
      updated[catIdx].tasks.splice(taskIdx, 1);
      return updated;
    });
    setPopupIndex({ category: null, index: null });
  };

  // ✅ 팝업 토글
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
          <div className="category-header">
            <h3 className="category-title">{group.categoryName}</h3>
            <button
              className="task-add-btn"
              onClick={() => handleAddTask(catIdx)}
            >
              +
            </button>
          </div>

          {group.tasks.map((task, taskIdx) => (
            <div
              key={task.task_id || task._tempId}
              className={`task-item ${task.checked ? "checked" : ""}`}
            >
              <button
                className={`task-check-btn ${task.checked ? "checked" : ""}`}
                onClick={() => toggleChecked(catIdx, taskIdx)}
              >
                {task.checked && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <rect width="20" height="20" rx="10" fill="#36A862" />
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
                className={`task-text-input ${task.checked ? "checked" : ""}`}
                value={task.text}
                autoFocus={task.isNew}
                onChange={(e) => {
                  const newText = e.target.value;
                  setTasksByCategory((prev) => {
                    const updated = [...prev];
                    updated[catIdx].tasks[taskIdx].text = newText;
                    return updated;
                  });
                }}
                onKeyDown={async (e) => {
                  if (
                    e.key === "Enter" &&
                    task.text.trim() !== "" &&
                    task.isNew
                  ) {
                    const user_id = localStorage.getItem("user_id");
                    if (!user_id) return alert("로그인이 필요합니다.");
                    const category_id =
                      task.category_id || group.tasks[0]?.category_id;
                    const dateStr = selectedDate.toISOString().split("T")[0];

                    try {
                      const result = await addTask({
                        task_name: task.text,
                        memo: "",
                        task_date: dateStr,
                        category_id,
                        user_id: Number(user_id),
                        notification_type: "미알림",
                        notification_time: null,
                      });
                      const savedTask = result.task;
                      setTasksByCategory((prev) => {
                        const updated = [...prev];
                        updated[catIdx].tasks[taskIdx] = {
                          text: savedTask.task_name,
                          checked: savedTask.status === "완료",
                          task_id: savedTask.task_id,
                          memo: savedTask.memo || "",
                          category_id: savedTask.category_id,
                        };
                        return updated;
                      });
                    } catch (err) {
                      console.error("Task 추가 실패:", err);
                      alert("할 일 추가 중 오류가 발생했습니다.");
                    }
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

              <button
                className="task-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePopup(catIdx, taskIdx);
                }}
              >
                <img src={ThreeIcon} alt="menu" style={{ width: "20px" }} />
              </button>

              {popupIndex.category === catIdx &&
                popupIndex.index === taskIdx && (
                  <TaskOptionsPopup
                    style={{ top: "40px", right: "0" }}
                    taskId={task.task_id}
                    userId={localStorage.getItem("user_id")}
                    onClose={() =>
                      setPopupIndex({ category: null, index: null })
                    }
                    onDelete={() => handleDeleteTask(catIdx, taskIdx)}
                    onEditConfirm={(newText) => {
                      setTasksByCategory((prev) => {
                        const updated = [...prev];
                        updated[catIdx].tasks[taskIdx].text = newText;
                        return updated;
                      });
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
