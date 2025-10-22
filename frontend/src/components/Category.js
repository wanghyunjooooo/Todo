import React, { useState } from "react";
import "./category.css";

function CategoryManager() {
  const [categories, setCategories] = useState([
    { name: "Work", tasks: [] },
    { name: "Personal", tasks: [] },
    { name: "Study", tasks: [] },
  ]);

  const [newTaskText, setNewTaskText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");

  const addTask = () => {
    if (!newTaskText) return;

    setCategories(prev =>
      prev.map(cat =>
        cat.name === selectedCategory
          ? { ...cat, tasks: [...cat.tasks, newTaskText] }
          : cat
      )
    );
    setNewTaskText("");
  };

  return (
    <div className="category-container">
      <h3>카테고리별 할 일</h3>

      {/* 카테고리 선택 + 입력 */}
      <div className="task-input">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          placeholder="할 일 입력"
        />
        <button onClick={addTask}>추가</button>
      </div>

      {/* 카테고리별 할 일 표시 */}
      <div className="category-list">
        {categories.map(cat => (
          <div key={cat.name} className="category">
            <h4>{cat.name}</h4>
            <ul>
              {cat.tasks.map((task, idx) => (
                <li key={idx}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryManager;
