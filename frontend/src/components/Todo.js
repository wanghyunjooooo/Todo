import React, { useState, useRef, useEffect } from "react";
import "./todo.css";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import { addTask, deleteTask } from "../api";

function Todo({ tasksByDate, selectedDate }) {
  const [tasks, setTasks] = useState({ all: [] });
  const [popupIndex, setPopupIndex] = useState(null);

  const inputRefs = useRef({});

  // tasksByDate가 바뀌면 tasks 초기화
  useEffect(() => {
    if (!tasksByDate) return;

    const initialTasks = (tasksByDate || []).map((task) => ({
      text: task.task_name,
      checked: task.status === "완료",
      task_id: task.task_id,
      memo: task.memo || "",
    }));

    setTasks({ all: initialTasks });
  }, [tasksByDate]);

  const toggleTaskInput = () => {
    setTasks((prev) => ({
      all: [...prev.all, { text: "", checked: false, memo: "" }],
    }));
  };

  const handleInputChange = (index, value) => {
    setTasks((prev) => {
      const newTasks = [...prev.all];
      newTasks[index].text = value;
      return { all: newTasks };
    });
  };

  const toggleChecked = (index) => {
    setTasks((prev) => {
      const newTasks = [...prev.all];
      newTasks[index].checked = !newTasks[index].checked;
      return { all: newTasks };
    });
  };

  const handleKeyDown = async (e, index) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const taskToSave = tasks.all[index];
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return alert("로그인이 필요합니다.");
    if (!taskToSave.text.trim()) return alert("할 일을 입력하세요.");

    try {
      const result = await addTask({
        task_name: taskToSave.text,
        memo: taskToSave.memo || "",
        task_date: selectedDate.toISOString().split("T")[0],
        category_id: null, // 카테고리 무시
        user_id: parseInt(user_id, 10),
        notification_type: "미알림",
        notification_time: null,
      });

      const savedTask = result.task;

      setTasks((prev) => {
        const newTasks = [...prev.all];
        newTasks[index] = {
          text: savedTask.task_name,
          checked: savedTask.status === "완료",
          task_id: savedTask.task_id,
          memo: savedTask.memo || "",
        };
        newTasks.splice(index + 1, 0, { text: "", checked: false, memo: "" });
        return { all: newTasks };
      });
    } catch (error) {
      console.error("할 일 저장 실패:", error);
      alert("작업 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteTask = async (index) => {
    const task = tasks.all[index];
    if (!task.task_id) {
      setTasks((prev) => {
        const newTasks = [...prev.all];
        newTasks.splice(index, 1);
        return { all: newTasks };
      });
      return;
    }

    try {
      await deleteTask(task.task_id);
      setTasks((prev) => {
        const newTasks = [...prev.all];
        newTasks.splice(index, 1);
        return { all: newTasks };
      });
    } catch (error) {
      console.error("Task 삭제 실패:", error);
      alert("할 일 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (tasks.all.length > 0) {
      const lastIndex = tasks.all.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }
  }, [tasks]);

  const togglePopup = (index) => {
    setPopupIndex((prev) => (prev === index ? null : index));
  };

  const allTasksEmpty = !tasks.all || tasks.all.length === 0;

  return (
    <div className="todo-container">
      {allTasksEmpty ? (
        <div style={{ textAlign: "center", marginTop: "20px", color: "#888" }}>
          오늘은 할 일이 없습니다.
        </div>
      ) : (
        tasks.all.map((task, index) => (
          <div key={task.task_id || index} className="task-input" style={{ position: "relative" }}>
            <button
              className={`task-check-btn ${task.checked ? "checked" : ""}`}
              onClick={() => toggleChecked(index)}
            >
              {task.checked && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" rx="10" fill="#36A862" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.8073 7.18066C15.9307 7.29649 16 7.4535 16 7.6172C16 7.7809 15.9307 7.93791 15.8073 8.05374L9.65614 13.8193C9.53257 13.935 9.36506 14 9.19041 14C9.01576 14 8.84826 13.935 8.72469 13.8193L5.20976 10.5247C5.14501 10.4682 5.09307 10.4 5.05705 10.3242C5.02103 10.2484 5.00166 10.1666 5.0001 10.0837C4.99854 10.0007 5.01482 9.91833 5.04797 9.84141C5.08111 9.76449 5.13045 9.69461 5.19303 9.63595C5.25561 9.57729 5.33016 9.53105 5.41222 9.49998C5.49429 9.46891 5.58218 9.45365 5.67067 9.45512C5.75917 9.45658 5.84644 9.47473 5.92728 9.5085C6.00812 9.54226 6.08088 9.59094 6.14122 9.65163L9.19041 12.5097L14.8758 7.18066C14.9994 7.06498 15.1669 7 15.3415 7C15.5162 7 15.6837 7.06498 15.8073 7.18066Z"
                    fill="#EBF6EF"
                  />
                </svg>
              )}
            </button>

            <input
              type="text"
              value={task.text}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder="할 일 입력"
              ref={(el) => (inputRefs.current[index] = el)}
            />

            <button className="task-add-btn" onClick={() => togglePopup(index)}>
              <img src={ThreeIcon} alt="three dots" style={{ width: "20px" }} />
            </button>

            {popupIndex === index && (
              <TaskOptionsPopup
                style={{ top: "50px", left: "0px" }}
                onClose={() => setPopupIndex(null)}
                onDelete={() => {
                  handleDeleteTask(index);
                  setPopupIndex(null);
                }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Todo;
