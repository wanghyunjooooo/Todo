import React, { useState } from "react";
import "./TaskOptionsPopup.css";
import MemoIcon from "../assets/memo.svg";
import RepeatIcon from "../assets/calendar.svg";
import AlarmIcon from "../assets/alarm.svg";
import DeleteIcon from "../assets/delete.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";

function TaskOptionsPopup({ onClose, onDelete }) {
    const [showMemoEditor, setShowMemoEditor] = useState(false);
    const [showRepeatEditor, setShowRepeatEditor] = useState(false);
    const [newName, setNewName] = useState("");

    return (
        <>
            {/* 공통 오버레이 */}
            <div className="overlay" onClick={onClose}></div>

            {/* 옵션 팝업 */}
            {!showMemoEditor && !showRepeatEditor && (
                <div className="task-options-popup" onClick={(e) => e.stopPropagation()}>
                    <button className="option-btn" onClick={() => setShowMemoEditor(true)}>
                        <img src={MemoIcon} alt="메모" />
                        <span>메모</span>
                    </button>
                    <button className="option-btn" onClick={() => setShowRepeatEditor(true)}>
                        <img src={RepeatIcon} alt="반복 설정" />
                        <span>반복 설정</span>
                    </button>
                    <button className="option-btn">
                        <img src={AlarmIcon} alt="알림 설정" />
                        <span>알림 설정</span>
                    </button>
                    {/* 삭제 버튼 */}
                    <button className="option-btn delete-btn" onClick={onDelete}>
                        <img src={DeleteIcon} alt="삭제" />
                        <span>삭제</span>
                    </button>

                    {/* 취소/확인 버튼 그룹 */}
                    <div className="task-options-footer">
                        <button className="cancel-btn" onClick={onClose}>
                            취소
                        </button>
                    </div>
                </div>
            )}

            {/* 메모 팝업 */}
            {showMemoEditor && (
                <div className="editor-overlay" onClick={() => setShowMemoEditor(false)}>
                    <div className="editor-box" onClick={(e) => e.stopPropagation()}>
                        <div className="rename-box">
                            <div className="rename-title-with-icon">
                                <img src={MemoIcon} alt="메모 아이콘" className="memo-icon" />
                                <span className="rename-title-text">메모</span>
                            </div>

                            <div className="rename-input-container">
                                <input type="text" className="rename-input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="작성 하기" />
                            </div>

                            <div className="button-group">
                                <button className="cancel-button" onClick={() => setShowMemoEditor(false)}>
                                    취소
                                </button>
                                <button
                                    className="confirm-button"
                                    onClick={() => {
                                        setNewName("");
                                        setShowMemoEditor(false);
                                    }}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 반복 설정 팝업 */}
            {showRepeatEditor && (
                <div className="editor-overlay" onClick={() => setShowRepeatEditor(false)}>
                    <div className="editor-box" onClick={(e) => e.stopPropagation()}>
                        <div className="rename-box">
                            <div className="category-list">
                                {/* 반복 일정 */}
                                <div className="category-item white-bg">
                                    <img src={RepeatIcon} alt="캘린더" className="memo-icon" />
                                    <span>반복 일정</span>
                                </div>

                                {/* 반복 주기 */}
                                <div className="category-item">
                                    <span>반복 주기</span>
                                    <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                                </div>

                                {/* 기간 설정 */}
                                <div className="category-item">
                                    <span>기간 설정</span>
                                    <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="cancel-button" onClick={() => setShowRepeatEditor(false)}>
                                    취소
                                </button>
                                <button className="confirm-button" onClick={() => setShowRepeatEditor(false)}>
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
