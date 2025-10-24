// Todo.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./todo.css";
import PlusIcon from "../assets/plus.svg";
import ThreeIcon from "../assets/three.svg";
import TaskOptionsPopup from "./TaskOptionsPopup";
import CategoryEditor from "./EditCategoryBox";

function Todo() {
  const [categories, setCategories] = useState([]); 
  const [tasks, setTasks] = useState({}); // { [categoryId]: [{text, checked}, ...] }
  const [popupIndex, setPopupIndex] = useState(null);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);

  const inputRefs = useRef({});
  const buttonRefs = useRef({});
  const API_URL = "http://localhost:8080";

  // ✅ 페이지 로드 시 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      try {
        const response = await axios.get(`${API_URL}/categories?userId=${user_id}`);
        setCategories(response.data);

        // 카테고리별 tasks 초기화
        const initialTasks = {};
        response.data.forEach(cat => {
          initialTasks[cat.category_id] = (cat.tasks || []).map(task => ({
            text: task.task_name,
            checked: task.status === "완료"
          }));
        });
        setTasks(initialTasks);
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  // ✅ 새 카테고리 추가 콜백
  const handleCategoryAdded = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
    setTasks(prev => ({ ...prev, [newCategory.category_id]: [] }));
  };

  // ✅ 새로운 할 일 추가 (빈 입력칸)
  const toggleTaskInput = (categoryId) => {
    setTasks(prev => {
      const catTasks = prev[categoryId] || [];
      return { ...prev, [categoryId]: [...catTasks, { text: "", checked: false }] };
    });
  };

  // ✅ 입력값 변경 핸들러
  const handleInputChange = (categoryId, index, value) => {
    setTasks(prev => {
      const catTasks = [...prev[categoryId]];
      catTasks[index].text = value;
      return { ...prev, [categoryId]: catTasks };
    });
  };

  // ✅ 체크박스 토글
  const toggleChecked = (categoryId, index) => {
    setTasks(prev => {
      const catTasks = [...prev[categoryId]];
      catTasks[index].checked = !catTasks[index].checked;
      return { ...prev, [categoryId]: catTasks };
    });
  };

  // ✅ Enter 누르면 DB에 저장 + 다음 입력칸 생성
  const handleKeyDown = async (e, categoryId, index) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const taskToSave = tasks[categoryId][index];
    const user_id = localStorage.getItem("user_id");

    if (!user_id) return alert("로그인이 필요합니다.");
    if (!taskToSave.text.trim()) return alert("할 일을 입력하세요.");

    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        task_name: taskToSave.text,
        memo: "",
        task_date: new Date().toISOString().split("T")[0],
        category_id: categoryId,
        user_id: parseInt(user_id, 10)
      });

      console.log("✅ Task saved:", response.data.task);

      // 입력 완료 후 새로운 빈 입력칸 추가
      setTasks(prev => {
        const catTasks = [...prev[categoryId]];
        catTasks.splice(index + 1, 0, { text: "", checked: false });
        return { ...prev, [categoryId]: catTasks };
      });
    } catch (error) {
      console.error("❌ Error saving task:", error);
      alert("작업 저장 중 오류가 발생했습니다.");
    }
  };

  // ✅ 새로 추가된 입력창 자동 포커스
  useEffect(() => {
    categories.forEach(cat => {
      const catTasks = tasks[cat.category_id] || [];
      if (catTasks.length > 0) {
        const lastIndex = catTasks.length - 1;
        inputRefs.current[cat.category_id]?.[lastIndex]?.focus();
      }
    });
  }, [tasks, categories]);

  // ✅ 옵션 팝업 토글
  const togglePopup = (index) => {
    setPopupIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="todo-container">
      {/* 카테고리 리스트 + tasks */}
      {categories.map(cat => (
        <div key={cat.category_id} className="category-section">
          <div className="category-box">
            <span className="category-text">{cat.category_name}</span>
            <img
              src={PlusIcon}
              alt="plus button"
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
              onClick={() => toggleTaskInput(cat.category_id)}
            />
          </div>

          {/* 카테고리별 할 일 */}
          {(tasks[cat.category_id] || []).map((task, index) => (
            <div
              key={index}
              className={`task-input ${task.checked ? "checked-bg" : ""}`}
              style={{ position: "relative" }}
            >
              {/* 체크 버튼 */}
              <button
                className={`task-check-btn ${task.checked ? "checked" : ""}`}
                onClick={() => toggleChecked(cat.category_id, index)}
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

              {/* 입력창 */}
              <input
                type="text"
                value={task.text}
                onChange={(e) => handleInputChange(cat.category_id, index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, cat.category_id, index)}
                placeholder="할 일 입력"
                ref={el => {
                  if (!inputRefs.current[cat.category_id]) inputRefs.current[cat.category_id] = [];
                  inputRefs.current[cat.category_id][index] = el;
                }}
              />

              {/* 점 3개 버튼 */}
              <button
                className="task-add-btn"
                ref={el => {
                  if (!buttonRefs.current[cat.category_id]) buttonRefs.current[cat.category_id] = [];
                  buttonRefs.current[cat.category_id][index] = el;
                }}
                onClick={() => togglePopup(index)}
              >
                <img src={ThreeIcon} alt="three dots" style={{ width: "20px" }} />
              </button>

              {/* 옵션 팝업 */}
              {popupIndex === index && (
                <TaskOptionsPopup
                  style={{ top: "50px", left: "0px" }}
                  onClose={() => setPopupIndex(null)}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {/* CategoryEditor 모달 */}
      {showCategoryEditor && (
        <CategoryEditor
          mode="add"
          onClose={() => setShowCategoryEditor(false)}
          onCategoryAdded={handleCategoryAdded}
        />
      )}
    </div>
  );
}

export default Todo;
