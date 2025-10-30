// src/components/TaskOptionsPopup.js
import React, { useState, useEffect } from "react";

import MemoIcon from "../assets/memo.svg";
import RepeatIcon from "../assets/calendar.svg";
import AlarmIcon from "../assets/alarm.svg";
import DeleteIcon from "../assets/delete.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import EditIcon from "../assets/edit.svg";
import { createRoutine, updateTask } from "../api";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "./TaskOptionsPopup.css";

function TaskOptionsPopup({
    taskId,
    taskData,
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

    // 알람 설정
    const [alarmDate, setAlarmDate] = useState(new Date());
    const [alarmEnabled, setAlarmEnabled] = useState(false);
    const repeatOptions = ["매일", "매주", "매월"];

    const getTitle = () => (editorType === "edit" ? "할 일 수정" : "메모");
    const getPlaceholder = () =>
        editorType === "edit" ? "할 일 이름을 입력하세요" : "작성하기";
    const getIcon = () => (editorType === "edit" ? EditIcon : MemoIcon);

    // =========================
    // 반복/알람 초기값 세팅
    // =========================
    useEffect(() => {
        if (!taskData) return;

        // 반복
        const repeatTypes = ["매일", "매주", "매월"];
        const routineType = taskData.routine_type?.trim();
        const isRepeat = repeatTypes.includes(routineType);
        setRepeatEnabled(isRepeat); // 반복이 없으면 false
        setSelectedRepeatOption(isRepeat ? routineType : "");

        setPeriodStart(
            taskData.period_start ? new Date(taskData.period_start) : new Date()
        );
        setPeriodEnd(
            taskData.period_end ? new Date(taskData.period_end) : new Date()
        );

        // 알람
        setAlarmEnabled(taskData.notification_type === "알림"); // "미알림"이면 false
        if (taskData.notification_time) {
            const [hours, minutes] = taskData.notification_time.split(":");
            const date = new Date();
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            setAlarmDate(date);
        }
    }, [taskData]);
    // =========================
    // 반복 주기 선택 → DB & Todo 동기화
    // =========================
    const handleConfirmRepeatOption = async () => {
        if (!taskId) return;
        try {
            const payload = {
                ...taskData,
                routine_type: selectedRepeatOption,
            };
            await updateTask(taskId, payload, userId);
            setRepeatOptionsVisible(false);
            if (onEditConfirm) onEditConfirm(payload);
        } catch (err) {
            console.error("반복 주기 DB 업데이트 실패:", err);
        }
    };

    // =========================
    // 기간 설정 → DB & Todo 동기화
    // =========================
    const handleConfirmPeriod = async () => {
        if (!taskId) return;
        try {
            const payload = {
                ...taskData,
                period_start: periodStart.toISOString().split("T")[0],
                period_end: periodEnd.toISOString().split("T")[0],
            };
            await updateTask(taskId, payload, userId);
            setPeriodVisible(false);
            if (onEditConfirm) onEditConfirm(payload);
        } catch (err) {
            console.error("기간 DB 업데이트 실패:", err);
        }
    };

    // =========================
    // 알람 설정 → DB & Todo 동기화
    // =========================
    const handleConfirmAlarm = async () => {
        if (!taskId) return;
        try {
            const hours = alarmDate.getHours().toString().padStart(2, "0");
            const minutes = alarmDate.getMinutes().toString().padStart(2, "0");

            const payload = {
                ...taskData,
                notification_type: alarmEnabled ? "알림" : "미알림",
                notification_time: alarmEnabled ? `${hours}:${minutes}` : null,
            };

            await updateTask(taskId, payload, userId);
            if (onEditConfirm) onEditConfirm(payload);
        } catch (err) {
            console.error("알람 DB 업데이트 실패:", err);
        }
    };

    // =========================
    // 반복 루틴 생성 → DB & Todo 동기화
    // =========================
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

            // Todo 화면 갱신
            if (onEditConfirm) {
                const payload = {
                    ...taskData,
                    routine_type: selectedRepeatOption,
                    period_start: periodStart.toISOString().split("T")[0],
                    period_end: periodEnd.toISOString().split("T")[0],
                };
                onEditConfirm(payload);
            }
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
                    className="editor-box"
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
                    <button
                        className="option-btn delete-btn"
                        onClick={onDelete}
                    >
                        <img src={DeleteIcon} alt="삭제" />
                        <span>삭제</span>
                    </button>
                </div>
            )}

            {/* 메모/할 일 수정 */}
            {showEditor && (
                <div
                    className="editor-overlay"
                    onClick={() => setShowEditor(false)}
                >
                    <div
                        className="editor-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rename-box">
                            <div className="rename-title-with-icon">
                                <img
                                    src={getIcon()}
                                    alt="아이콘"
                                    className="memo-icon"
                                />
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
                                    onClick={async () => {
                                        try {
                                            const payload = {};

                                            if (editorType === "edit") {
                                                payload.task_name = newText;
                                                payload.memo = taskData.memo; // 기존 메모 유지
                                            } else if (editorType === "memo") {
                                                payload.memo = newText;
                                                payload.task_name =
                                                    taskData.task_name; // 기존 task_name 유지
                                            }

                                            // 기타 필드도 필요하면 추가
                                            payload.task_date =
                                                taskData.task_date;
                                            payload.notification_type =
                                                taskData.notification_type;
                                            payload.notification_time =
                                                taskData.notification_time;

                                            const result = await updateTask(
                                                taskId,
                                                payload,
                                                userId
                                            );
                                            alert("할 일 수정 완료!");
                                            setShowEditor(false);
                                            setNewText("");

                                            if (onEditConfirm)
                                                onEditConfirm(result.task);
                                        } catch (err) {
                                            console.error("수정 실패:", err);
                                            alert("수정 실패");
                                        }
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
                    <div
                        className="editor-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rename-box">
                            <div className="category-list">
                                {/* ✅ 반복 일정 + 토글 */}
                                <div className="title-box">
                                    <img
                                        src={RepeatIcon}
                                        alt="캘린더"
                                        className="memo-icon"
                                    />
                                    <span className="option-title">
                                        반복 일정
                                    </span>

                                    {/* 토글 */}
                                    <div
                                        className="toggle"
                                        onClick={() =>
                                            setRepeatEnabled((prev) => !prev)
                                        }
                                    >
                                        <div
                                            className="toggle-container"
                                            style={{
                                                background: repeatEnabled
                                                    ? "#4CAF50"
                                                    : "#CCC",
                                            }}
                                        >
                                            <div
                                                className="toggle-switch"
                                                style={{
                                                    left: repeatEnabled
                                                        ? "14px"
                                                        : "2px",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 반복 주기 */}
                                <div
                                    className={`category-item ${
                                        !repeatEnabled ? "disabled-item" : ""
                                    }`}
                                    onClick={(e) => {
                                        if (!repeatEnabled) return; // 토글 꺼져있으면 무시
                                        e.stopPropagation();
                                        setRepeatOptionsVisible(true);
                                    }}
                                >
                                    <span>
                                        반복 주기{" "}
                                        {selectedRepeatOption &&
                                            `: ${selectedRepeatOption}`}
                                    </span>
                                    <img
                                        src={ArrowIcon}
                                        alt="arrow"
                                        className="arrow-icon"
                                    />
                                </div>

                                {/* 기간 설정 */}
                                <div
                                    className={`category-item ${
                                        !repeatEnabled ? "disabled-item" : ""
                                    }`}
                                    onClick={() => {
                                        if (!repeatEnabled) return; // 토글 꺼져있으면 무시
                                        setPeriodVisible(!periodVisible);
                                    }}
                                >
                                    <span>기간 설정</span>
                                    <img
                                        src={ArrowIcon}
                                        alt="arrow"
                                        className="arrow-icon"
                                    />
                                </div>

                                {/* 반복 주기 옵션 서브 팝업 */}
                                {repeatOptionsVisible && (
                                    <div
                                        className="editor-box"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="title-box">
                                            <img
                                                src={RepeatIcon}
                                                alt="캘린더"
                                                className="memo-icon"
                                            />
                                            <span className="option-title">
                                                반복 주기
                                            </span>
                                        </div>

                                        {repeatOptions.map((opt) => (
                                            <div
                                                key={opt}
                                                className={`category-item ${
                                                    selectedRepeatOption === opt
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    setSelectedRepeatOption(
                                                        opt
                                                    );
                                                    setRepeatOptionsVisible(
                                                        false
                                                    );
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}

                                        <div className="button-group">
                                            <button
                                                className="cancel-button"
                                                onClick={() =>
                                                    setRepeatOptionsVisible(
                                                        false
                                                    )
                                                }
                                            >
                                                취소
                                            </button>
                                            <button
                                                className="confirm-button"
                                                onClick={() =>
                                                    setRepeatOptionsVisible(
                                                        false
                                                    )
                                                }
                                            >
                                                확인
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {periodVisible && (
                                    <div
                                        className="editor-box"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* 기간 설정 타이틀 */}
                                        <div className="title-box">
                                            <img
                                                src={RepeatIcon}
                                                alt="캘린더"
                                                className="memo-icon"
                                            />
                                            <span className="option-title">
                                                기간 설정
                                            </span>
                                        </div>

                                        <div className="calendar-box">
                                            <DatePicker
                                                inline
                                                locale={ko}
                                                showOutsideDays={false}
                                                selected={periodEnd}
                                                startDate={periodStart} // 시작일 고정
                                                endDate={periodEnd} // 종료일 선택
                                                minDate={periodStart} // 시작일 이전 선택 불가
                                                filterDate={(date) =>
                                                    date >= periodStart
                                                } // 안전장치
                                                onChange={(date) => {
                                                    // 클릭 시 종료일로 설정
                                                    if (
                                                        date &&
                                                        date >= periodStart
                                                    ) {
                                                        setPeriodEnd(date);
                                                    }
                                                }}
                                                dayClassName={(date) => {
                                                    if (date < periodStart)
                                                        return "disabled-day";
                                                    if (
                                                        periodEnd &&
                                                        date >= periodStart &&
                                                        date <= periodEnd
                                                    )
                                                        return "selected-range-day";
                                                    return "";
                                                }}
                                                renderCustomHeader={({
                                                    date,
                                                    decreaseMonth,
                                                    increaseMonth,
                                                    prevMonthButtonDisabled,
                                                    nextMonthButtonDisabled,
                                                }) => (
                                                    <div className="datepicker-header">
                                                        <span
                                                            className="header-month-year"
                                                            style={{
                                                                marginRight:
                                                                    "8px",
                                                            }}
                                                        >
                                                            {date.getFullYear()}
                                                            년{" "}
                                                            {date.getMonth() +
                                                                1}
                                                            월
                                                        </span>
                                                        <div className="arrow-btn">
                                                            <img
                                                                src={ArrowIcon}
                                                                alt="previous"
                                                                style={{
                                                                    width: "20px",
                                                                    height: "20px",
                                                                    transform:
                                                                        "rotate(180deg)",
                                                                    cursor: prevMonthButtonDisabled
                                                                        ? "default"
                                                                        : "pointer",
                                                                    opacity:
                                                                        prevMonthButtonDisabled
                                                                            ? 0.3
                                                                            : 1,
                                                                }}
                                                                onClick={
                                                                    !prevMonthButtonDisabled
                                                                        ? decreaseMonth
                                                                        : undefined
                                                                }
                                                            />
                                                            <img
                                                                src={ArrowIcon}
                                                                alt="next"
                                                                style={{
                                                                    width: "20px",
                                                                    height: "20px",
                                                                    cursor: nextMonthButtonDisabled
                                                                        ? "default"
                                                                        : "pointer",
                                                                    opacity:
                                                                        nextMonthButtonDisabled
                                                                            ? 0.3
                                                                            : 1,
                                                                }}
                                                                onClick={
                                                                    !nextMonthButtonDisabled
                                                                        ? increaseMonth
                                                                        : undefined
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        <div
                                            className="button-group"
                                            style={{ marginTop: "12px" }}
                                        >
                                            <button
                                                className="cancel-button"
                                                onClick={() =>
                                                    setPeriodVisible(false)
                                                }
                                            >
                                                취소
                                            </button>
                                            <button
                                                className="confirm-button"
                                                onClick={() =>
                                                    setPeriodVisible(false)
                                                }
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

            {showAlarmEditor && (
                <div
                    className="editor-overlay"
                    onClick={() => setShowAlarmEditor(false)}
                >
                    <div
                        className="editor-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 알람 설정 타이틀 + 토글 */}
                        <div className="title-box">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <img
                                    src={AlarmIcon}
                                    alt="알람"
                                    className="memo-icon"
                                />
                                <span className="option-title">알람 설정</span>
                            </div>
                            {/* 토글 */}
                            <div
                                className="toggle"
                                onClick={() => setAlarmEnabled((prev) => !prev)} // ✅ repeatEnabled → alarmEnabled
                            >
                                <div
                                    className="toggle-container"
                                    style={{
                                        background: alarmEnabled
                                            ? "#4CAF50"
                                            : "#CCC",
                                    }}
                                >
                                    <div
                                        className="toggle-switch"
                                        style={{
                                            left: alarmEnabled ? "14px" : "2px",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* 시/분 선택 전체 박스 */}
                        <div
                            style={{
                                display: "flex",
                                width: "310px",
                                padding: "20px",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "flex-start",
                                gap: "20px",
                                borderRadius: "16px",
                                background: alarmEnabled
                                    ? "var(--Grey-Light, #F3F3F3)"
                                    : "#E0E0E0",
                                pointerEvents: alarmEnabled ? "auto" : "none", // 꺼져있으면 클릭 불가
                                opacity: alarmEnabled ? 1 : 0.5, // 비활성화 느낌
                            }}
                        >
                            <p className="hour-title">시</p>
                            <div className="hour-container">
                                {Array.from({ length: 24 }, (_, i) => (
                                    <button
                                        className={`hour-btn ${
                                            alarmDate.getHours() === i
                                                ? "selected"
                                                : ""
                                        }`}
                                        key={i}
                                        onClick={() => {
                                            if (!alarmEnabled) return;
                                            const newDate = new Date(alarmDate);
                                            newDate.setHours(i);
                                            setAlarmDate(newDate);
                                        }}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>

                            <p className="minute-title">분</p>
                            <div className="minute-container">
                                {Array.from(
                                    { length: 12 },
                                    (_, i) => i * 5
                                ).map((m) => (
                                    <button
                                        className={`minute-btn ${
                                            alarmDate.getMinutes() === m
                                                ? "selected"
                                                : ""
                                        }`}
                                        key={m}
                                        onClick={() => {
                                            if (!alarmEnabled) return;
                                            const newDate = new Date(alarmDate);
                                            newDate.setMinutes(m);
                                            setAlarmDate(newDate);
                                        }}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 버튼 그룹 */}
                        <div className="button-group">
                            <button
                                className="cancel-button"
                                onClick={() => setShowAlarmEditor(false)}
                            >
                                취소
                            </button>
                            <button
                                className="confirm-button"
                                onClick={async () => {
                                    try {
                                        if (!taskId)
                                            return alert(
                                                "할 일을 먼저 선택해주세요."
                                            );

                                        const payload = {
                                            task_name:
                                                typeof newText === "string" &&
                                                newText.trim() !== ""
                                                    ? newText
                                                    : taskData.task_name,
                                            memo:
                                                typeof taskData.memo ===
                                                "string"
                                                    ? taskData.memo
                                                    : "",
                                            task_date:
                                                typeof taskData.task_date ===
                                                    "string" &&
                                                taskData.task_date
                                                    ? taskData.task_date
                                                    : new Date()
                                                          .toISOString()
                                                          .split("T")[0],
                                            notification_type: alarmEnabled
                                                ? "알림"
                                                : "미알림",
                                            notification_time: alarmEnabled
                                                ? alarmDate
                                                      .toTimeString()
                                                      .split(" ")[0]
                                                : null,
                                        };

                                        console.log("보낼 payload:", payload);
                                        console.log(
                                            "updateTask 호출 - taskId:",
                                            taskId,
                                            "payload:",
                                            payload
                                        );

                                        const result = await updateTask(
                                            taskId,
                                            payload,
                                            userId
                                        );
                                        alert("알람 설정 완료!");
                                        setShowAlarmEditor(false);

                                        if (onEditConfirm)
                                            onEditConfirm(result.task);
                                    } catch (err) {
                                        console.error("알람 설정 실패:", err);
                                        alert("알람 설정 실패");
                                    }
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default TaskOptionsPopup;
