// src/components/TaskOptionsPopup.js
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

function TaskOptionsPopup({
  taskId,
  userId,
  onClose,
  onDelete,
  onEditConfirm,
}) {
  const [showEditor, setShowEditor] = useState(false);
  const [editorType, setEditorType] = useState("");
  const [showRepeatEditor, setShowRepeatEditor] = useState(false);
  const [showAlarmEditor, setShowAlarmEditor] = useState(false);
  const [newText, setNewText] = useState("");

  // 반복 관련 상태
  const [repeatOptionsVisible, setRepeatOptionsVisible] = useState(false);
  const [selectedRepeatOption, setSelectedRepeatOption] = useState("");
  const [periodVisible, setPeriodVisible] = useState(false);
  const [periodStart, setPeriodStart] = useState(new Date());
  const [periodEnd, setPeriodEnd] = useState(new Date());
  const [repeatEnabled, setRepeatEnabled] = useState(false);

  // 알림 설정
  const [alarmDate, setAlarmDate] = useState(new Date());

  const repeatOptions = ["매일", "매주", "매월"];

  const getTitle = () => (editorType === "edit" ? "할 일 수정" : "메모");
  const getPlaceholder = () =>
    editorType === "edit" ? "할 일 이름을 입력하세요" : "작성하기";
  const getIcon = () => (editorType === "edit" ? EditIcon : MemoIcon);

  // 반복 루틴 생성
  const handleCreateRoutine = async () => {
    if (!taskId || !userId || !selectedRepeatOption) {
      alert("모든 정보를 선택해주세요.");
      return;
    }
    try {
      await createRoutine(
        taskId,
        selectedRepeatOption,
        periodStart.toISOString().split("T")[0],
        periodEnd.toISOString().split("T")[0],
        userId
      );
      alert("루틴 생성 완료!");
      setShowRepeatEditor(false);
    } catch (err) {
      console.error(err);
      alert("루틴 생성 실패");
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div>

      {/* 메인 옵션 팝업 */}
      {!showEditor && !showRepeatEditor && !showAlarmEditor && (
        <div
          className="task-options-popup"
          onClick={(e) => e.stopPropagation()}
        >
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
          <button
            className="option-btn"
            onClick={() => setShowRepeatEditor(true)}
          >
            <img src={RepeatIcon} alt="반복 설정" />
            <span>반복 설정</span>
          </button>
          <button
            className="option-btn"
            onClick={() => setShowAlarmEditor(true)}
          >
            <img src={AlarmIcon} alt="알림 설정" />
            <span>알림 설정</span>
          </button>
          <button className="option-btn delete-btn" onClick={onDelete}>
            <img src={DeleteIcon} alt="삭제" />
            <span>삭제</span>
          </button>
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
                <input
                  type="text"
                  className="rename-input"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder={getPlaceholder()}
                />
              </div>
              <div className="button-group">
                <button
                  className="cancel-button"
                  onClick={() => setShowEditor(false)}
                >
                  취소
                </button>
                <button
                  className="confirm-button"
                  onClick={() => {
                    if (editorType === "edit" && onEditConfirm)
                      onEditConfirm(newText);
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
        <div
          className="editor-overlay"
          onClick={() => setShowRepeatEditor(false)}
        >
          <div className="editor-box" onClick={(e) => e.stopPropagation()}>
            <div className="rename-box">
              <div className="category-list">
                {/* ✅ 반복 일정 + 토글 */}
                <div
                  className="category-item white-bg"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img src={RepeatIcon} alt="캘린더" className="memo-icon" />
                    <span>반복 일정</span>
                  </div>

                  {/* 토글 */}
                  <div
                    style={{
                      display: "flex",
                      width: "40px",
                      height: "40px",
                      padding: "10px 5px 12px 5px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => setRepeatEnabled((prev) => !prev)}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "16px",
                        borderRadius: "20px",
                        background: repeatEnabled ? "#4CAF50" : "#CCC",
                        position: "relative",
                        transition: "background 0.3s",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: "#FFF",
                          position: "absolute",
                          top: "2px",
                          left: repeatEnabled ? "14px" : "2px",
                          transition: "left 0.3s",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* 반복 주기 */}
                <div
                  className="category-item repeat-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRepeatOptionsVisible(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span>
                    반복 주기{" "}
                    {selectedRepeatOption && `: ${selectedRepeatOption}`}
                  </span>
                  <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                </div>

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
                  <div
                    className="repeat-option-popup"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>기간 설정</h3>

                    <div
                      style={{
                        width: "310px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "var(--Grey-Light, #F3F3F3)",
                        borderRadius: "8px",
                        margin: "0 auto",
                      }}
                    >
                      <DatePicker
                        selected={periodStart}
                        onChange={(dates) => {
                          const [start, end] = dates;
                          setPeriodStart(start);
                          setPeriodEnd(end);
                        }}
                        startDate={periodStart}
                        endDate={periodEnd}
                        selectsRange
                        inline
                      />
                    </div>

                    <div className="button-group" style={{ marginTop: "12px" }}>
                      <button
                        className="cancel-button"
                        onClick={() => setPeriodVisible(false)}
                      >
                        취소
                      </button>
                      <button
                        className="confirm-button"
                        onClick={() => setPeriodVisible(false)}
                      >
                        확인
                      </button>
                    </div>
                  </div>
                )}
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
                  onClick={handleCreateRoutine}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 반복 주기 옵션 팝업 */}
      {repeatOptionsVisible && (
        <div
          className="repeat-option-popup"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>반복 주기 선택</h3>
          {repeatOptions.map((opt) => (
            <div
              key={opt}
              className={`repeat-option ${
                selectedRepeatOption === opt ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedRepeatOption(opt);
                setRepeatOptionsVisible(false);
              }}
            >
              {opt}
            </div>
          ))}
          <div className="button-group">
            <button
              className="cancel-button"
              onClick={() => setRepeatOptionsVisible(false)}
            >
              취소
            </button>
            <button
              className="confirm-button"
              onClick={() => setRepeatOptionsVisible(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 알람 설정 */}
      {showAlarmEditor && (
        <div
          className="repeat-option-popup"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>알람 시간 설정</h3>

          {/* 시 선택 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <button
                key={i}
                style={{
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border:
                    alarmDate.getHours() === i
                      ? "2px solid #4CAF50"
                      : "1px solid #ccc",
                  background: alarmDate.getHours() === i ? "#DFF5E1" : "#fff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const newDate = new Date(alarmDate);
                  newDate.setHours(i);
                  setAlarmDate(newDate);
                }}
              >
                {i}
              </button>
            ))}
          </div>

          {/* 분 선택 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
              <button
                key={m}
                style={{
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border:
                    alarmDate.getMinutes() === m
                      ? "2px solid #4CAF50"
                      : "1px solid #ccc",
                  background: alarmDate.getMinutes() === m ? "#DFF5E1" : "#fff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const newDate = new Date(alarmDate);
                  newDate.setMinutes(m);
                  setAlarmDate(newDate);
                }}
              >
                {m}
              </button>
            ))}
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
      )}
    </>
  );
}

export default TaskOptionsPopup;
