import React, { useState } from "react";
import "./RepeatEditor.css";
import RepeatIcon from "../assets/calendar.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";

function RepeatEditor({ onClose }) {
    const [showRepeatOptions, setShowRepeatOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const options = ["매일", "매주", "매월"];

    return (
        <div className="editor-overlay" onClick={onClose}>
            <div className="editor-box" onClick={(e) => e.stopPropagation()}>
                <div className="rename-box">
                    <div className="category-list">
                        <div className="category-item white-bg">
                            <img src={RepeatIcon} alt="캘린더" className="memo-icon" />
                            <span>반복 일정</span>
                        </div>

                        <div
                            className="category-item clickable"
                            onClick={() => setShowRepeatOptions(!showRepeatOptions)}
                        >
                            <span>반복 주기</span>
                            <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                        </div>

                        <div className="category-item">
                            <span>기간 설정</span>
                            <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                        </div>

                        {showRepeatOptions &&
                            options.map((opt) => (
                                <div
                                    key={opt}
                                    className={`repeat-option ${selectedOption === opt ? "selected" : ""}`}
                                    onClick={() => setSelectedOption(opt)}
                                >
                                    {opt}
                                </div>
                            ))}

                        <div className="button-group">
                            <button className="cancel-button" onClick={onClose}>취소</button>
                            <button className="confirm-button" onClick={onClose}>확인</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RepeatEditor;
