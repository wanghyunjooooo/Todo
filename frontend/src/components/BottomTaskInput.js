import React, { useState, useRef } from "react";
import TaskIcon from "../assets/task.svg"; // 임포트
import "./bottomTaskInput.css"; // CSS 분리
import CategoryPopup from "./CategoryPopup";

export default function BottomTaskInput({ categories = [], onAddTask }) {
    const [bottomInput, setBottomInput] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);
    const bottomInputRef = useRef(null);

    const handleEnter = async (e) => {
        if (e.key !== "Enter") return;
        if (!bottomInput.trim()) return;

        if (onAddTask) {
            await onAddTask(null, bottomInput.trim());
            setBottomInput("");
        }
    };

    return (
        <div className="bottom-input-wrapper">
            <div className="task-item bottom-task-item">
                <div className="task-content">
                    <div className="task-left">
                        <button className="task-check-btn" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="10" fill="none" stroke="#777" strokeWidth="1" />
                            </svg>
                        </button>

                        <input ref={bottomInputRef} type="text" value={bottomInput} onChange={(e) => setBottomInput(e.target.value)} onKeyDown={handleEnter} placeholder="할 일 적는 칸" className="task-text-input" />
                    </div>

                    <div
                        className="task-right"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => setPopupOpen((prev) => !prev)}
                    >
                        <img src={TaskIcon} alt="task" style={{ width: "13px", marginRight: "6px" }} />
                        <span
                            style={{
                                fontSize: "12px",
                                color: "#595959",
                                whiteSpace: "nowrap",
                            }}
                        >
                            작업
                        </span>
                    </div>
                </div>

                {popupOpen && (
                    <CategoryPopup
                        categories={categories}
                        onSelect={(cat) => {
                            console.log("선택한 카테고리:", cat.category_name);
                            setPopupOpen(false);
                        }}
                        onClose={() => setPopupOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
