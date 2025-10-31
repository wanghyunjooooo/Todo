import React, { useState, useEffect } from "react";
import "./TaskOptionsPopup.css";
import RepeatIcon from "../assets/calendar.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import EditIcon from "../assets/edit.svg";
import MemoIcon from "../assets/memo.svg";
import DeleteIcon from "../assets/delete.svg";

function TaskOptionsPopup({ taskData, onClose, onDelete, onEditConfirm }) {
    const [showEditor, setShowEditor] = useState(false);
    const [editorType, setEditorType] = useState(null); // 'edit' | 'memo'
    const [showRepeatEditor, setShowRepeatEditor] = useState(false);

    const [editText, setEditText] = useState(""); // 할 일
    const [memoText, setMemoText] = useState(""); // 메모

    const [showRepeatOptions, setShowRepeatOptions] = useState(false);
    const [selectedRepeatOption, setSelectedRepeatOption] = useState("");

    const repeatOptions = ["매일", "매주", "매달"];

    // --- 안정적으로 기존 값 불러오기 ---
    useEffect(() => {
        if (!taskData) return;
        if (editorType === "edit") {
            setEditText(taskData.task_name || ""); // task_name으로 수정
        } else if (editorType === "memo") {
            setMemoText(taskData.memo || "");
        }
    }, [editorType, taskData]);

    const openEditor = (type) => {
        setEditorType(type);
        setShowEditor(true);
        setShowRepeatOptions(false);
    };

    const handleConfirm = () => {
        if (!taskData) return;

        const updatedTask = { ...taskData };

        if (editorType === "edit") {
            updatedTask.task_name = editText;
        } else if (editorType === "memo") {
            updatedTask.memo = memoText;
        }

        if (onEditConfirm) onEditConfirm(updatedTask);

        setShowEditor(false);
        setEditorType(null);
    };

    const getTitle = () => (editorType === "edit" ? "할 일 수정" : "메모");
    const getIcon = () => (editorType === "edit" ? EditIcon : MemoIcon);
    const getPlaceholder = () => (editorType === "edit" ? "할 일 이름을 입력하세요" : "작성하기");

    return (
        <>
            <div className="overlay" onClick={onClose}></div>

            {/* 메인 옵션 */}
            {!showEditor && !showRepeatEditor && (
                <div className="task-options-popup" onClick={(e) => e.stopPropagation()}>
                    <button className="option-btn" onClick={() => openEditor("edit")}>
                        <img src={EditIcon} alt="할 일 수정" />
                        <span>할 일 수정</span>
                    </button>

                    <button className="option-btn" onClick={() => openEditor("memo")}>
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
                </div>
            )}

            {/* 할 일 / 메모 에디터 */}
            {showEditor && editorType && (
                <div className="editor-overlay" onClick={() => setShowEditor(false)}>
                    <div className="editor-box" onClick={(e) => e.stopPropagation()}>
                        <div className="rename-box">
                            <div className="rename-title-with-icon">
                                <img src={getIcon()} alt="아이콘" className="memo-icon" />
                                <span>{getTitle()}</span>
                            </div>

                            <div className="rename-input-container">
                                <input type="text" className="rename-input" value={editorType === "edit" ? editText : memoText} onChange={(e) => (editorType === "edit" ? setEditText(e.target.value) : setMemoText(e.target.value))} placeholder={getPlaceholder()} />
                            </div>

                            <div className="button-group">
                                <button
                                    className="cancel-button"
                                    onClick={() => {
                                        setShowEditor(false);
                                        setEditorType(null);
                                    }}
                                >
                                    취소
                                </button>
                                <button className="confirm-button" onClick={handleConfirm}>
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 반복 설정 */}
            {showRepeatEditor && (
                <div className="editor-overlay" onClick={() => setShowRepeatEditor(false)}>
                    <div className="editor-box" onClick={(e) => e.stopPropagation()}>
                        <div className="rename-box">
                            <div className="category-item">
                                <img src={RepeatIcon} alt="캘린더" className="memo-icon" />
                                <span>반복 일정</span>
                            </div>

                            <div className="category-item clickable" onClick={() => setShowRepeatOptions(!showRepeatOptions)}>
                                <span>반복 주기 {selectedRepeatOption && `: ${selectedRepeatOption}`}</span>
                                <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                            </div>

                            {showRepeatOptions && (
                                <div className="repeat-options-list">
                                    {repeatOptions.map((opt) => (
                                        <div key={opt} className={`repeat-option ${selectedRepeatOption === opt ? "selected" : ""}`} onClick={() => setSelectedRepeatOption(opt)}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}

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
