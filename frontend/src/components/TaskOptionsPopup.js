import React, { useState } from "react";
import "./TaskOptionsPopup.css";
import MemoIcon from "../assets/memo.svg";
import RepeatIcon from "../assets/calendar.svg";
import AlarmIcon from "../assets/alarm.svg";
import DeleteIcon from "../assets/delete.svg";
import "./CategoryEditor.css";

function TaskOptionsPopup({ onClose, onConfirm }) {
  const [showMemoEditor, setShowMemoEditor] = useState(false);

  return (
    <>
      {/* TaskOptionsPopup 오버레이 */}
      <div className="overlay" onClick={onClose}></div>

      {/* 팝업 */}
      <div className="task-options-popup" onClick={(e) => e.stopPropagation()}>
        <button
          className="option-btn"
          onClick={() => {
            console.log("메모 버튼 클릭됨");
            setShowMemoEditor(true);
          }}
        >
          <img src={MemoIcon} alt="메모" />
          <span>메모</span>
        </button>
        <button className="option-btn">
          <img src={RepeatIcon} alt="반복 설정" />
          <span>반복 설정</span>
        </button>
        <button className="option-btn">
          <img src={AlarmIcon} alt="알림 설정" />
          <span>알림 설정</span>
        </button>
        <button className="option-btn delete-btn">
          <img src={DeleteIcon} alt="삭제" />
          <span>삭제</span>
        </button>

        <div className="task-options-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>

    </>
  );
}

export default TaskOptionsPopup;
