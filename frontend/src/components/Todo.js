// Todo.js
import React, { useState, useRef, useEffect } from "react";
import "./todo.css";
import PlusIcon from "../assets/plus.svg";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";

function Todo() {
  const [tasks, setTasks] = useState([{ text: "", checked: false }]);
  const [popupIndex, setPopupIndex] = useState(null); // 어떤 input의 팝업인지
  const inputRefs = useRef([]);
  const buttonRefs = useRef([]);

  const toggleTaskInput = () => {
    setTasks([...tasks, { text: "", checked: false }]);
  };

  const handleInputChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].text = value;
    setTasks(newTasks);
  };

  const toggleChecked = (index) => {
    const newTasks = [...tasks];
    newTasks[index].checked = !newTasks[index].checked;
    setTasks(newTasks);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setTasks((prev) => {
        const newTasks = [...prev];
        newTasks.splice(index + 1, 0, { text: "", checked: false });
        return newTasks;
      });
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      const lastIndex = tasks.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }
  }, [tasks.length]);

  // 팝업 토글
  const togglePopup = (index) => {
    setPopupIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="todo-container">
      {/* 카테고리 박스 */}
      <div className="category-box">
        <span className="category-text">카테고리 01</span>
        <img
          src={PlusIcon}
          alt="plus button"
          style={{ width: "20px", height: "20px", cursor: "pointer" }}
          onClick={toggleTaskInput}
        />
      </div>

      {/* 할 일 입력 영역 */}
      {tasks.map((task, index) => (
        <div
          key={index}
          className={`task-input ${task.checked ? "checked-bg" : ""}`}
          style={{ position: "relative" }}
        >
          {/* 체크박스 */}
          <button
            className={`task-check-btn ${task.checked ? "checked" : ""}`}
            onClick={() => toggleChecked(index)}
          >
            {task.checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
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

          {/* 인풋 */}
          <input
            type="text"
            value={task.text}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder="할 일 입력"
            ref={(el) => (inputRefs.current[index] = el)}
          />

          {/* 점 3개 버튼 */}
          <button
            className="task-add-btn"
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => togglePopup(index)}
          >
            <img src={ThreeIcon} alt="three dots" style={{ width: "20px" }} />
          </button>

          {/* 팝업 */}
          {popupIndex === index && (
            <TaskOptionsPopup
              style={{
                top: "50px", // 버튼 기준 적절히 위치 조정
                left: "0px",
              }}
              onClose={() => setPopupIndex(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Todo;
