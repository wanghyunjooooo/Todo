import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Todo from "../components/Todo";
import { addTask, getTasksByDay } from "../api";
import Sidebar from "../components/SideBar";
import BottomTaskInput from "../components/BottomTaskInput";
import CategoryManagePopup from "../components/CategoryManagePopup";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import ArrowIcon from "../assets/icon-arrow-right.svg";
import RepeatIcon from "../assets/calendar.svg";
import "react-datepicker/dist/react-datepicker.css";
import "../components/TaskOptionsPopup.css";

function Home() {
    const [tasksByDate, setTasksByDate] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const saved = localStorage.getItem("selectedDate");
        return saved ? new Date(saved) : new Date();
    });
    const [focusedTaskId, setFocusedTaskId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

    // 단일 날짜 선택용 팝업 상태
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);

    const userId = localStorage.getItem("user_id");

    const weekDays = [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
    ];
    const todayString = `${
        selectedDate.getMonth() + 1
    }월 ${selectedDate.getDate()}일 ${weekDays[selectedDate.getDay()]}`;

    /** 오늘 할 일 로드 */
    useEffect(() => {
        if (!userId) return;
        const fetchTodayTasks = async () => {
            const dateStr = selectedDate.toISOString().split("T")[0];
            try {
                const tasks = await getTasksByDay(userId, dateStr);
                setTasksByDate(tasks || []);
            } catch (err) {
                console.error("오늘 할 일 로드 실패:", err);
            }
        };
        fetchTodayTasks();
    }, [userId, selectedDate]);

    const updateTaskInState = (updatedTask) => {
        setTasksByDate((prev) =>
            prev.map((task) =>
                task.taskId === updatedTask.taskId
                    ? { ...task, ...updatedTask }
                    : task
            )
        );
    };

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    const handleAddTask = async (category_id, text) => {
        if (!userId) return alert("로그인이 필요합니다.");
        if (!selectedDate) return alert("날짜가 유효하지 않습니다.");

        const localDate = new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        );
        const dateStr = localDate.toISOString().split("T")[0];

        try {
            await addTask({
                task_name: text,
                memo: "",
                task_date: dateStr,
                category_id: category_id ?? null,
                user_id: Number(userId),
                notification_type: "미알림",
                notification_time: null,
            });

            const tasks = await getTasksByDay(userId, dateStr);
            setTasksByDate(tasks || []);
        } catch (err) {
            console.error("하단 입력창 추가 실패:", err);
        }
    };

    /** 단일 날짜 선택 후 확인 */
    const handleDateConfirm = () => {
        setSelectedDate(tempSelectedDate);
        setIsDatePickerOpen(false);
        localStorage.setItem("selectedDate", tempSelectedDate.toISOString());
    };

    return (
        <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            <Header onSidebarToggle={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            {/* 오늘 날짜 표시 + 클릭 시 달력 팝업 */}
            <div
                className="title-header"
                style={{ marginTop: "8px", cursor: "pointer" }}
                onClick={() => {
                    setTempSelectedDate(selectedDate);
                    setIsDatePickerOpen(true);
                }}
            >
                {todayString}
            </div>

            {/* 단일 날짜 선택 팝업 */}
            {isDatePickerOpen && (
                <div
                    className="overlay"
                    onClick={() => setIsDatePickerOpen(false)}
                >
                    <div
                        className="editor-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="title-box">
                            <img
                                src={RepeatIcon}
                                alt="달력"
                                className="memo-icon"
                            />
                            <span className="option-title">날짜</span>
                        </div>

                        <div className="calendar-box">
                            <DatePicker
                                inline
                                locale={ko}
                                selected={tempSelectedDate}
                                onChange={(date) =>
                                    date && setTempSelectedDate(date)
                                }
                                renderCustomHeader={({
                                    date,
                                    decreaseMonth,
                                    increaseMonth,
                                    prevMonthButtonDisabled,
                                    nextMonthButtonDisabled,
                                }) => (
                                    <div
                                        className="datepicker-header"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            padding: "0 8px",
                                        }}
                                    >
                                        {/* 왼쪽: 연월 표시 */}
                                        <span
                                            style={{
                                                fontWeight: "550",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {date.getFullYear()}년{" "}
                                            {date.getMonth() + 1}월
                                        </span>

                                        {/* 오른쪽: 이전 화살표 + 오늘 버튼 + 다음 화살표 */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0px",
                                            }}
                                        >
                                            <img
                                                src={ArrowIcon}
                                                alt="prev"
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    transform: "rotate(180deg)",
                                                    cursor: prevMonthButtonDisabled
                                                        ? "default"
                                                        : "pointer",
                                                    opacity:
                                                        prevMonthButtonDisabled
                                                            ? 0.3
                                                            : 1,
                                                    margin: 0,
                                                }}
                                                onClick={
                                                    !prevMonthButtonDisabled
                                                        ? decreaseMonth
                                                        : undefined
                                                }
                                            />

                                            <button
                                                onClick={() => {
                                                    const today = new Date();
                                                    setTempSelectedDate(today);
                                                    setSelectedDate(today);
                                                }}
                                                style={{
                                                    padding: "4px 8px",
                                                    color: "#2a2a2a",
                                                    border: "none",
                                                    borderRadius: "0px",
                                                    cursor: "pointer",
                                                    fontWeight: "400",
                                                    margin: 0,
                                                }}
                                            >
                                                오늘
                                            </button>

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
                                                    margin: 0,
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
                                onClick={() => setIsDatePickerOpen(false)}
                            >
                                취소
                            </button>
                            <button
                                className="confirm-button"
                                onClick={handleDateConfirm}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ flex: 1, overflowY: "auto" }}>
                <Todo
                    tasksByDate={tasksByDate}
                    selectedDate={selectedDate}
                    focusedTaskId={focusedTaskId}
                    updateTaskInState={updateTaskInState}
                    onDataUpdated={async () => {
                        const dateStr = selectedDate
                            .toISOString()
                            .split("T")[0];
                        try {
                            const tasks = await getTasksByDay(userId, dateStr);
                            setTasksByDate(tasks || []);
                        } catch (err) {
                            console.error("오늘 할 일 새로고침 실패:", err);
                        }
                    }}
                />
            </div>

            <BottomTaskInput
                onAddTask={handleAddTask}
                categories={categories}
            />

            {isCategoryPopupOpen && (
                <CategoryManagePopup
                    categories={categories}
                    onClose={() => setIsCategoryPopupOpen(false)}
                    onUpdateCategories={(newCategories) =>
                        setCategories(newCategories)
                    }
                />
            )}
        </div>
    );
}
export default Home;
