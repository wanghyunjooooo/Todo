import React, { useState } from "react";
import "./TaskOptionsPopup.css";
import RepeatIcon from "../assets/calendar.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import EditIcon from "../assets/edit.svg";
import MemoIcon from "../assets/memo.svg";
import AlarmIcon from "../assets/alarm.svg";
import DeleteIcon from "../assets/delete.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskOptionsPopup({ taskId, userId, onClose, onDelete, onEditConfirm }) {
    const [showEditor, setShowEditor] = useState(false);
    const [editorType, setEditorType] = useState("");
    const [showRepeatEditor, setShowRepeatEditor] = useState(false);
    const [newText, setNewText] = useState("");

    // 반복 주기
    const [showRepeatOptions, setShowRepeatOptions] = useState(false);
    const [selectedRepeatOption, setSelectedRepeatOption] = useState("");

    // 기간 설정
    const [periodStart, setPeriodStart] = useState(new Date());
    const [periodEnd, setPeriodEnd] = useState(new Date());

    const repeatOptions = ["매일", "매주", "매달"];
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const getTitle = () => (editorType === "edit" ? "할 일 수정" : "메모");
    const getPlaceholder = () => (editorType === "edit" ? "할 일 이름을 입력하세요" : "작성하기");
    const getIcon = () => (editorType === "edit" ? EditIcon : MemoIcon);

    return (
        <>
            <div className="overlay" onClick={onClose}></div>

            {/* 옵션 팝업 */}
            {!showEditor && !showRepeatEditor && (
                <div className="task-options-popup" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="option-btn"
                        onClick={() => {
                            setShowEditor(true);
                            setEditorType("edit");
                        }}
                    >
                        <img src={EditIcon} alt="할 일 수정" />
                        <span>할 일 수정</span>
                    </button>
                    <button
                        className="option-btn"
                        onClick={() => {
                            setShowEditor(true);
                            setEditorType("memo");
                        }}
                    >
                        <img src={MemoIcon} alt="메모" />
                        <span>메모</span>
                    </button>
                    <button className="option-btn" onClick={() => setShowRepeatEditor(true)}>
                        <img src={RepeatIcon} alt="반복 설정" />
                        <span>반복 설정</span>
                    </button>
                    <button className="option-btn" onClick={onDelete}>
                        <img src={DeleteIcon} alt="삭제" />
                        <span>삭제</span>
                    </button>

                    <div className="task-options-footer">
                        <button className="cancel-btn" onClick={onClose}>
                            취소
                        </button>
                        <button className="confirm-btn" onClick={onClose}>
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/* 메모/할 일 수정 */}
            {showEditor && (
                <div className="editor-overlay" onClick={() => setShowEditor(false)}>
                    <div className="editor-box" onClick={(e) => e.stopPropagation()}>
                        <div className="rename-box">
                            <div className="rename-title-with-icon">
                                <img src={getIcon()} alt="아이콘" className="memo-icon" />
                                <span>{getTitle()}</span>
                            </div>

                            <div className="rename-input-container">
                                <input type="text" className="rename-input" value={newText} onChange={(e) => setNewText(e.target.value)} placeholder={getPlaceholder()} />
                            </div>

                            <div className="button-group">
                                <button className="cancel-button" onClick={() => setShowEditor(false)}>
                                    취소
                                </button>
                                <button
                                    className="confirm-button"
                                    onClick={() => {
                                        if (editorType === "edit" && onEditConfirm) onEditConfirm(newText);
                                        setNewText("");
                                        setShowEditor(false);
                                    }}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 반복 설정 + 서브 반복 주기 팝업 */}
            {showRepeatEditor && (
                <div className="editor-overlay" onClick={() => setShowRepeatEditor(false)}>
                    <div className="editor-box" onClick={(e) => e.stopPropagation()}>
                        <div className="rename-box">
                            {/* 상단 반복 일정 */}
                            <div className="category-item white-bg">
                                <img src={RepeatIcon} alt="캘린더" className="memo-icon" />
                                <span>반복 일정</span>
                            </div>

                            {/* 반복 주기 */}
                            <div className="category-item clickable" onClick={() => setShowRepeatOptions(!showRepeatOptions)}>
                                <span>반복 주기 {selectedRepeatOption && `: ${selectedRepeatOption}`}</span>
                                <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                            </div>

                            {/* 기간 설정 */}
                            <div className="category-item">
                                <span>기간 설정</span>
                                <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                            </div>

                            {/* 서브 옵션 */}
                            {showRepeatOptions && (
                                <div className="repeat-options-list">
                                    {repeatOptions.map((opt) => (
                                        <div key={opt} className={`repeat-option ${selectedRepeatOption === opt ? "selected" : ""}`} onClick={() => setSelectedRepeatOption(opt)}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 버튼 맨 아래 */}
                            <div className="button-group">
                                <button className="cancel-button" onClick={() => setShowRepeatEditor(false)}>
                                    취소
                                </button>
                                <button className="confirm-button" onClick={() => alert(`반복 주기: ${selectedRepeatOption}`)}>
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TaskOptionsPopup;
