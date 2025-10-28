import React, { useState } from "react";
import "./TaskOptionsPopup.css";
import MemoIcon from "../assets/memo.svg";
import RepeatIcon from "../assets/calendar.svg";
import AlarmIcon from "../assets/alarm.svg";
import DeleteIcon from "../assets/delete.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import EditIcon from "../assets/edit.svg";
import { createRoutine } from "../api";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskOptionsPopup({ taskId, userId, onClose, onDelete, onEditConfirm }) {
  const [showEditor, setShowEditor] = useState(false);
  const [editorType, setEditorType] = useState("");
  const [showRepeatEditor, setShowRepeatEditor] = useState(false);
  const [showAlarmEditor, setShowAlarmEditor] = useState(false);
  const [newText, setNewText] = useState("");

  // 반복 주기
  const [repeatOptionsVisible, setRepeatOptionsVisible] = useState(false);
  const [selectedRepeatOption, setSelectedRepeatOption] = useState("");

  // 기간 설정
  const [periodVisible, setPeriodVisible] = useState(false);
  const [periodStart, setPeriodStart] = useState(new Date());
  const [periodEnd, setPeriodEnd] = useState(new Date());

  // 알림 설정
  const [alarmDate, setAlarmDate] = useState(new Date());

  const repeatOptions = ["매일", "매주", "매월"];
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const getTitle = () => (editorType === "edit" ? "할일 수정" : "메모");
  const getPlaceholder = () =>
    editorType === "edit" ? "할일 이름을 입력하세요" : "작성 하기";
  const getIcon = () => (editorType === "edit" ? EditIcon : MemoIcon);

  // ✅ 반복 루틴 생성
  const handleCreateRoutine = async () => {
    if (!taskId) {
      alert("서버에 저장된 할 일을 먼저 선택해야 합니다.");
      return;
    }
    if (!userId) {
      alert("사용자 정보가 없습니다.");
      return;
    }
    if (!selectedRepeatOption) {
      alert("반복 주기를 선택해주세요.");
      return;
    }

    try {
      const res = await createRoutine(
        taskId,
        selectedRepeatOption,
        periodStart.toISOString().split("T")[0],
        periodEnd.toISOString().split("T")[0],
        userId
      );
      console.log("루틴 생성 완료:", res);
      alert("루틴 생성 완료!");
      setShowRepeatEditor(false);
    } catch (err) {
      console.error("루틴 생성 실패:", err);
      alert("루틴 생성 실패");
    }
  };

  return (
    <>
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
            <button className="cancel-btn" onClick={onClose}>취소</button>
            <button className="confirm-btn" onClick={onClose}>확인</button>
          </div>
        </div>
      )}

      {/* 메모/할일 수정 */}
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
                <button className="cancel-button" onClick={() => setShowEditor(false)}>취소</button>
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

      {/* 반복 설정 */}
      {showRepeatEditor && (
        <div className="editor-overlay" onClick={() => setShowRepeatEditor(false)}>
          <div className="editor-box" onClick={(e) => e.stopPropagation()}>
            <div className="rename-box">
              <div className="category-list">
                <div className="category-item white-bg">
                  <img src={RepeatIcon} alt="캘린더" className="memo-icon" />
                  <span>반복 일정</span>
                </div>

                {/* 반복 주기 선택 */}
                <div
                  className="category-item"
                  onClick={() => setRepeatOptionsVisible(!repeatOptionsVisible)}
                  style={{ cursor: "pointer" }}
                >
                  <span>반복 주기 {selectedRepeatOption && `: ${selectedRepeatOption}`}</span>
                  <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                </div>
                {repeatOptionsVisible &&
                  repeatOptions.map((opt) => (
                    <div
                      key={opt}
                      className="repeat-option"
                      onClick={() => setSelectedRepeatOption(opt)}
                      style={{
                        padding: "8px 20px",
                        border: selectedRepeatOption === opt ? "2px solid #4caf50" : "1px solid #ccc",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: "4px",
                      }}
                    >
                      {opt}
                    </div>
                  ))}

                {/* 기간 설정 */}
                <div
                  className="category-item"
                  onClick={() => setPeriodVisible(!periodVisible)}
                  style={{ cursor: "pointer" }}
                >
                  <span>기간 설정</span>
                  <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                </div>
                {periodVisible && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap", maxWidth: "100%" }}>
                    <DatePicker
                      selected={periodStart}
                      onChange={(date) => setPeriodStart(date)}
                      selectsStart
                      startDate={periodStart}
                      endDate={periodEnd}
                      dateFormat="yyyy/MM/dd"
                      popperModifiers={[{ name: "preventOverflow", options: { tether: false, altAxis: true } }]}
                      withPortal={isMobile}
                    />
                    <DatePicker
                      selected={periodEnd}
                      onChange={(date) => setPeriodEnd(date)}
                      selectsEnd
                      startDate={periodStart}
                      endDate={periodEnd}
                      dateFormat="yyyy/MM/dd"
                      popperModifiers={[{ name: "preventOverflow", options: { tether: false, altAxis: true } }]}
                      withPortal={isMobile}
                    />
                  </div>
                )}
              </div>

              <div className="button-group">
                <button className="cancel-button" onClick={() => setShowRepeatEditor(false)}>취소</button>
                <button className="confirm-button" onClick={handleCreateRoutine}>확인</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 알림 설정 (달력) */}
      {showAlarmEditor && (
        <div className="editor-overlay" onClick={() => setShowAlarmEditor(false)}>
          <div className="editor-box" onClick={(e) => e.stopPropagation()}>
            <div className="rename-box" style={{ width: "350px", padding: "20px" }}>
              <label>알림 날짜/시간 선택</label>
              <div style={{ maxWidth: "100%" }}>
                <DatePicker
                  selected={alarmDate}
                  onChange={(date) => setAlarmDate(date)}
                  showTimeSelect
                  dateFormat="yyyy/MM/dd HH:mm"
                  popperPlacement="bottom-start"
                  popperModifiers={[{ name: "preventOverflow", options: { tether: false, altAxis: true } }]}
                  withPortal={isMobile}
                />
              </div>

              <div className="button-group" style={{ marginTop: "16px" }}>
                <button className="cancel-button" onClick={() => setShowAlarmEditor(false)}>취소</button>
                <button className="confirm-button" onClick={() => setShowAlarmEditor(false)}>확인</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskOptionsPopup;
