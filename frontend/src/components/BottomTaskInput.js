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
            <div className="bottom-content">
                <div className="bottom-left">
                    <button className="bottom-check-btn" disabled></button>
                    <input className="bottom-text-input" ref={bottomInputRef} type="text" value={bottomInput} onChange={(e) => setBottomInput(e.target.value)} onKeyDown={handleEnter} placeholder="할 일 적는 칸" />
                </div>

                <button className="bottom-menu-btn" onClick={() => setPopupOpen((prev) => !prev)}>
                    <img className="bottom-category-btn" src={TaskIcon} alt="task" />
                    <span className="bottom-category-span">작업</span>
                </button>
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
    );
}
