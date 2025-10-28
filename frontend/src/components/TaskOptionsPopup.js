import React, { useState } from "react";
import "./TaskOptionsPopup.css";
import MemoIcon from "../assets/memo.svg";
import RepeatIcon from "../assets/calendar.svg";
import AlarmIcon from "../assets/alarm.svg";
import DeleteIcon from "../assets/delete.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import EditIcon from "../assets/edit.svg";

// 달력용
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskOptionsPopup({ onClose, onDelete, onEditConfirm }) {
  const [showEditor, setShowEditor] = useState(false);
  const [editorType, setEditorType] = useState(""); // "memo" 또는 "edit"
  const [showRepeatEditor, setShowRepeatEditor] = useState(false);
  const [showAlarmEditor, setShowAlarmEditor] = useState(false);
  const [newText, setNewText] = useState("");
  const [alarmDate, setAlarmDate] = useState(new Date());

  // editorType에 따라 제목과 placeholder 변경
  const getTitle = () => (editorType === "edit" ? "할일 수정" : "메모");
  const getPlaceholder = () =>
    editorType === "edit" ? "할일 이름을 입력하세요" : "작성 하기";
  const getIcon = () => (editorType === "edit" ? EditIcon : MemoIcon);

  return (
    <>
      {/* 공통 오버레이 */}
      <div className="overlay" onClick={onClose}></div>

      {/* 옵션 팝업 */}
      {!showEditor && !showRepeatEditor && !showAlarmEditor && (
        <div className="task-options-popup" onClick={(e) => e.stopPropagation()}>
          <button
            className="option-btn"
            onClick={() => {
              setShowEditor(true);
              setEditorType("edit");
            }}
          >
            <img src={EditIcon} alt="할일 수정" />
            <span>할일 수정</span>
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
          <button className="option-btn" onClick={() => setShowAlarmEditor(true)}>
            <img src={AlarmIcon} alt="알림 설정" />
            <span>알림 설정</span>
          </button>
          <button className="option-btn delete-btn" onClick={onDelete}>
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

      {/* 메모/할일 수정 팝업 */}
      {showEditor && (
        <div className="editor-overlay" onClick={() => setShowEditor(false)}>
          <div className="editor-box" onClick={(e) => e.stopPropagation()}>
            <div className="rename-box">
              <div className="rename-title-with-icon">
                <img src={getIcon()} alt="아이콘" className="memo-icon" />
                <span className="rename-title-text">{getTitle()}</span>
              </div>

              <div className="rename-input-container">
                <input
                  type="text"
                  className="rename-input"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder={getPlaceholder()}
                />
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

      {/* 반복 설정 팝업 */}
      {showRepeatEditor && (
        <div className="editor-overlay" onClick={() => setShowRepeatEditor(false)}>
          <div className="editor-box" onClick={(e) => e.stopPropagation()}>
            <div className="rename-box">
              <div className="category-list">
                <div className="category-item white-bg">
                  <img src={RepeatIcon} alt="캘린더" className="memo-icon" />
                  <span>반복 일정</span>
                </div>
                <div className="category-item">
                  <span>반복 주기</span>
                  <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                </div>
                <div className="category-item">
                  <span>기간 설정</span>
                  <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                </div>
              </div>

              <div className="button-group">
                <button
                  className="cancel-button"
                  onClick={() => setShowRepeatEditor(false)}
                >
                  취소
                </button>
                <button
                  className="confirm-button"
                  onClick={() => setShowRepeatEditor(false)}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 알림 설정 팝업 (달력) */}
      {showAlarmEditor && (
        <div className="editor-overlay" onClick={() => setShowAlarmEditor(false)}>
          <div className="editor-box" onClick={(e) => e.stopPropagation()}>
            <div className="rename-box">
              <div
                style={{
                  width: "350px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <label>알림 날짜/시간 선택</label>
                <DatePicker
                  selected={alarmDate}
                  onChange={(date) => setAlarmDate(date)}
                  showTimeSelect
                  dateFormat="yyyy/MM/dd HH:mm"
                />
              </div>

              <div className="button-group">
                <button
                  className="cancel-button"
                  onClick={() => setShowAlarmEditor(false)}
                >
                  취소
                </button>
                <button
                  className="confirm-button"
                  onClick={() => setShowAlarmEditor(false)}
                >
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
