// src/components/TaskOptionsPopup.js
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "./TaskOptionsPopup.css";

import EditIcon from "../assets/edit.svg";
import MemoIcon from "../assets/memo.svg";
import RepeatIcon from "../assets/calendar.svg";
import AlarmIcon from "../assets/alarm.svg";
import DeleteIcon from "../assets/delete.svg";
import ArrowIcon from "../assets/icon-arrow-right.svg";

import {
    createRoutine,
    updateRoutine,
    updateTask,
    deleteRoutine,
} from "../api";

function TaskOptionsPopup({
    taskId,
    taskData,
    userId,
    onClose,
    onDelete,
    onEditConfirm,
}) {
    // --- Editor States ---
    const [showEditor, setShowEditor] = useState(false);
    const [editorType, setEditorType] = useState(""); // 'edit' | 'memo'
    const [newText, setNewText] = useState("");
    const [repeatOptionsVisible, setRepeatOptionsVisible] = useState(false);
    const [periodVisible, setPeriodVisible] = useState(false);

    // --- Repeat States ---
    const [showRepeatEditor, setShowRepeatEditor] = useState(false);
    const [repeatEnabled, setRepeatEnabled] = useState(false);
    const [selectedRepeatOption, setSelectedRepeatOption] = useState("");
    const [periodStart, setPeriodStart] = useState(new Date());
    const [periodEnd, setPeriodEnd] = useState(new Date());
    const [routineId, setRoutineId] = useState(taskData?.routine_id || null);
    const repeatOptions = ["매일", "매주", "매달"];

    // --- Alarm States ---
    const [showAlarmEditor, setShowAlarmEditor] = useState(false);
    const [alarmEnabled, setAlarmEnabled] = useState(false);
    const [alarmDate, setAlarmDate] = useState(new Date());

    // --- 기타 상태 ---
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // --- Helper ---
    const getTitle = () => (editorType === "edit" ? "할 일 수정" : "메모");
    const getIcon = () => (editorType === "edit" ? EditIcon : MemoIcon);
    const getPlaceholder = () =>
        editorType === "edit" ? "할 일 이름을 입력하세요" : "작성하기";

    // --- 초기값 세팅 ---
    useEffect(() => {
        if (!taskData) return;
        console.log("taskData 전달됨:", taskData);

        const routineTypes = ["매일", "매주", "매달"];
        setRepeatEnabled(routineTypes.includes(taskData.routine_type?.trim()));
        setSelectedRepeatOption(taskData.routine_type || "");
        setRoutineId(taskData.routine_id ?? null);

        if (taskData.period_start)
            setPeriodStart(new Date(taskData.period_start));
        if (taskData.period_end) setPeriodEnd(new Date(taskData.period_end));

        setAlarmEnabled(taskData.notification_type === "알림");
        if (taskData.notification_time) {
            const [h, m] = taskData.notification_time.split(":");
            const d = new Date();
            d.setHours(parseInt(h));
            d.setMinutes(parseInt(m));
            setAlarmDate(d);
        }
    }, [taskData]);

    // --- Task 삭제 ---
    const handleDeleteTask = async () => {
        if (!taskId) return;
        setLoading(true);
        setError("");
        try {
            if (onDelete) await onDelete(); // 실제 삭제 로직
            setShowDeleteConfirm(false); // 삭제 확인창 닫기
            if (onClose) onClose(); // 전체 팝업 닫기
        } catch (err) {
            console.error(err);
            setError("삭제 실패");
        } finally {
            setLoading(false);
        }
    };

    // --- 루틴 생성 / 수정 ---
    const handleCreateOrUpdateRoutine = async () => {
        if (!taskId || !userId) return alert("모든 정보를 선택해주세요.");

        try {
            // 🔹 반복 끄면 루틴 삭제
            if (!repeatEnabled) {
                if (!routineId && taskData?.routine_id)
                    setRoutineId(taskData.routine_id);
                await handleDeleteRoutine();
                setShowRepeatEditor(false);
                return;
            }

            let routineResponse;
            if (routineId) {
                routineResponse = await updateRoutine(
                    routineId,
                    selectedRepeatOption,
                    periodStart.toISOString().split("T")[0],
                    periodEnd.toISOString().split("T")[0]
                );
            } else {
                routineResponse = await createRoutine(
                    taskId,
                    selectedRepeatOption,
                    periodStart.toISOString().split("T")[0],
                    periodEnd.toISOString().split("T")[0],
                    userId
                );
            }

            const newRoutineId =
                routineResponse?.routine_id ??
                routineResponse?.routine?.routine_id ??
                routineId;
            setRoutineId(newRoutineId);

            const payload = {
                ...taskData,
                routine_id: newRoutineId,
            };

            const result = await updateTask(taskId, payload, userId);
            if (onEditConfirm) onEditConfirm(result.task);

            alert(routineId ? "루틴 수정 완료!" : "루틴 생성 완료!");
            setShowRepeatEditor(false);
            onClose && onClose();
        } catch (err) {
            console.error("루틴 생성/수정 실패:", err);
            alert("루틴 생성/수정 실패");
        }
    };

    // --- 루틴 삭제 ---
    const handleDeleteRoutine = async () => {
        const targetId = routineId || taskData?.routine_id;
        if (!targetId) {
            console.warn("루틴 ID 없음, 삭제 불가", { routineId, taskData });
            alert("삭제할 루틴이 없습니다.");
            return;
        }

        try {
            await deleteRoutine(targetId);

            const payload = {
                ...taskData,
                routine_id: null,
            };

            const result = await updateTask(taskId, payload, userId);
            if (onEditConfirm) onEditConfirm(result.task);

            setRoutineId(null);
            setRepeatEnabled(false);
            setSelectedRepeatOption("");
            alert("반복 루틴이 삭제되었습니다.");
        } catch (err) {
            console.error("루틴 삭제 실패:", err);
            alert("루틴 삭제 실패");
        }
    };

    // --- 메모 / 이름 수정 ---
    const openEditor = (type) => {
        setEditorType(type);
        setShowEditor(true);
        setNewText(
            type === "edit" ? taskData.task_name || "" : taskData.memo || ""
        );
    };

    const handleConfirmEdit = async () => {
        if (!taskId) return;
        if (editorType === "edit" && (!newText || !newText.trim()))
            return alert("할 일 이름을 입력해주세요.");

        try {
            const payload = {
                ...taskData,
                task_name: editorType === "edit" ? newText : taskData.task_name,
                memo: editorType === "memo" ? newText : taskData.memo,
            };

            const result = await updateTask(taskId, payload, userId);
            if (onEditConfirm) onEditConfirm(result.task);

            alert("수정 완료!");
            setShowEditor(false);
            onClose && onClose();
        } catch (err) {
            console.error("수정 실패:", err);
            alert("수정 실패");
        }
    };

    // --- 알람 설정 확인 ---
    const handleConfirmAlarm = async () => {
        if (!taskId) return;
        try {
            const payload = {
                ...taskData,
                notification_type: alarmEnabled ? "알림" : "미알림",
                notification_time: alarmEnabled
                    ? `${String(alarmDate.getHours()).padStart(
                          2,
                          "0"
                      )}:${String(alarmDate.getMinutes()).padStart(2, "0")}:00`
                    : null,
            };
            const result = await updateTask(taskId, payload, userId);
            if (onEditConfirm) onEditConfirm(result.task);
            alert("알람 설정 완료!");
            setShowAlarmEditor(false);
            onClose && onClose();
        } catch (err) {
            console.error("알람 설정 실패:", err);
            alert("알람 설정 실패");
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
            2,
            "0"
        )}.${String(date.getDate()).padStart(2, "0")}`;
    };

    return (
        <>
            <div className="overlay" onClick={onClose}></div>

            {/* --- 기본 옵션 메뉴 --- */}
            {!showEditor &&
                !showRepeatEditor &&
                !showAlarmEditor &&
                !showDeleteConfirm && (
                    <div
                        className="editor-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="option-btn"
                            onClick={() => openEditor("edit")}
                        >
                            <img src={EditIcon} alt="할 일 수정" />
                            <span>할 일 수정</span>
                        </button>
                        <button
                            className="option-btn"
                            onClick={() => openEditor("memo")}
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
                            <img src={AlarmIcon} alt="알람 설정" />
                            <span>알람 설정</span>
                        </button>
                        <button
                            className="option-btn delete-btn"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <img src={DeleteIcon} alt="삭제" />
                            <span>삭제</span>
                        </button>
                    </div>
                )}

            {/* --- 삭제 확인 모달 --- */}
            {showDeleteConfirm && (
                <div
                    className="editor-box"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="rename-box">
                        <div className="rename-title-with-icon">
                            <img
                                src={DeleteIcon}
                                alt="삭제"
                                className="memo-icon"
                            />
                            <span className="delete-title-text">삭제</span>
                        </div>
                        <p className="delete-text">
                            할 일이 영구적으로 삭제됩니다.
                        </p>
                        {error && <p className="error-text">{error}</p>}
                        <div className="button-group">
                            <button
                                className="cancel-button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={loading}
                            >
                                취소
                            </button>
                            <button
                                className="confirm-button delete"
                                onClick={handleDeleteTask}
                                disabled={loading}
                            >
                                {loading ? "처리 중..." : "삭제"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Edit / Memo Editor --- */}
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
                                    autoFocus
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
                                    onClick={handleConfirmEdit}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Repeat Editor --- */}
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
                            {/* 반복 토글 */}
                            <div className="title-box">
                                <img
                                    src={RepeatIcon}
                                    alt="캘린더"
                                    className="memo-icon"
                                />
                                <span className="option-title">반복 일정</span>
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
                                className={`category-item gray ${
                                    !repeatEnabled ? "disabled-item" : ""
                                }`}
                                onClick={() =>
                                    repeatEnabled &&
                                    setRepeatOptionsVisible(true)
                                }
                            >
                                반복 주기{" "}
                                {selectedRepeatOption &&
                                    `: ${selectedRepeatOption}`}
                                <img
                                    src={ArrowIcon}
                                    alt="arrow"
                                    className="arrow-icon"
                                />
                            </div>

                            {/* 기간 설정 */}
                            <div
                                className={`category-item gray ${
                                    !repeatEnabled ? "disabled-item" : ""
                                }`}
                                onClick={() =>
                                    repeatEnabled && setPeriodVisible(true)
                                }
                            >
                                기간 설정{" "}
                                {repeatEnabled &&
                                    periodStart &&
                                    periodEnd &&
                                    (periodStart.getTime() ===
                                    periodEnd.getTime()
                                        ? ``
                                        : ` : ${formatDate(
                                              periodStart
                                          )} - ${formatDate(periodEnd)}`)}
                                <img
                                    src={ArrowIcon}
                                    alt="arrow"
                                    className="arrow-icon"
                                />
                            </div>

                            {/* 반복 주기 서브 팝업 */}
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
                                            className={`category-item gray ${
                                                selectedRepeatOption === opt
                                                    ? "selected"
                                                    : ""
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
                                            onClick={() =>
                                                setRepeatOptionsVisible(false)
                                            }
                                        >
                                            취소
                                        </button>
                                        <button
                                            className="confirm-button"
                                            onClick={() =>
                                                setRepeatOptionsVisible(false)
                                            }
                                        >
                                            확인
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 기간 설정 서브 팝업 */}
                            {periodVisible && (
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
                                            기간 설정
                                        </span>
                                    </div>
                                    <div className="calendar-box">
                                        <DatePicker
                                            inline
                                            locale={ko}
                                            showOutsideDays={false}
                                            selected={periodEnd}
                                            startDate={periodStart}
                                            endDate={periodEnd}
                                            minDate={periodStart}
                                            filterDate={(date) =>
                                                date >= periodStart
                                            }
                                            onChange={(date) =>
                                                date && setPeriodEnd(date)
                                            }
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
                                                    <span className="header-month-year">
                                                        {date.getFullYear()}년{" "}
                                                        {date.getMonth() + 1}월
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
                                    <div className="button-group">
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

                            <div className="button-group">
                                <button
                                    className="cancel-button"
                                    onClick={() => setShowRepeatEditor(false)}
                                >
                                    취소
                                </button>
                                <button
                                    className="confirm-button"
                                    onClick={handleCreateOrUpdateRoutine}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Alarm Editor --- */}
            {showAlarmEditor && (
                <div
                    className="editor-overlay"
                    onClick={() => setShowAlarmEditor(false)}
                >
                    <div
                        className="editor-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="title-box">
                            <img
                                src={AlarmIcon}
                                alt="알람"
                                className="memo-icon"
                            />
                            <span className="option-title">알람 설정</span>
                            <div
                                className="toggle"
                                onClick={() => setAlarmEnabled((prev) => !prev)}
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
                                    ? "#F3F3F3"
                                    : "#E0E0E0",
                                pointerEvents: alarmEnabled ? "auto" : "none",
                                opacity: alarmEnabled ? 1 : 0.5,
                            }}
                        >
                            <p className="hour-title">시</p>
                            <div className="hour-container">
                                {Array.from({ length: 24 }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`hour-btn ${
                                            alarmDate.getHours() === i
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            if (!alarmEnabled) return;
                                            const d = new Date(alarmDate);
                                            d.setHours(i);
                                            setAlarmDate(d);
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
                                        key={m}
                                        className={`minute-btn ${
                                            alarmDate.getMinutes() === m
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            if (!alarmEnabled) return;
                                            const d = new Date(alarmDate);
                                            d.setMinutes(m);
                                            setAlarmDate(d);
                                        }}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
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
                                onClick={handleConfirmAlarm}
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
