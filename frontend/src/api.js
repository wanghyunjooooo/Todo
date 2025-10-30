// src/api.js
import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ 토큰 자동 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "서버 요청 중 오류가 발생했습니다.";
        console.error("API 오류:", message);
        return Promise.reject(error);
    }
);

// ✅ 로그인
export const loginUser = (email, password) => api.post("/users/login", { user_email: email, user_password: password });

// ✅ 회원가입
export const signupUser = (username, email, password) => api.post("/users/signup", { user_name: username, user_email: email, user_password: password });

// ✅ 카테고리 불러오기 (✅ 수정됨)
export const getCategories = (user_id) =>
    api
        .get(`/categories/${user_id}`)
        .then((res) => res.data)
        .catch((err) => {
            console.error("카테고리 조회 실패:", err);
            throw err;
        });

// ✅ 카테고리 추가
export const addCategory = (user_id, category_name) =>
    api
        .post("/categories", {
            user_id: Number(user_id),
            category_name: typeof category_name === "string" ? category_name : category_name?.category_name, // ✅ 객체일 경우에도 문자열만 보냄
        })
        .then((res) => res.data)
        .catch((err) => {
            console.error("카테고리 추가 실패:", err);
            throw err;
        });

// ✅ 카테고리 수정
export const updateCategory = (user_id, category_id, category_name) =>
    api
        .put(`/categories/${user_id}/${category_id}`, { category_name })
        .then((res) => res.data)
        .catch((err) => {
            console.error("카테고리 수정 실패:", err);
            throw err;
        });

// ✅ 카테고리 삭제 (✅ 수정됨)
export const deleteCategory = (user_id, category_id) =>
    api
        .delete(`/categories/${user_id}/${category_id}`)
        .then((res) => res.data)
        .catch((err) => {
            console.error("카테고리 삭제 실패:", err);
            throw err;
        });

// ✅ Task 추가
export const addTask = (taskData) =>
    api
        .post("/tasks", taskData)
        .then((res) => res.data)
        .catch((err) => {
            console.error("Task 추가 실패:", err);
            throw err;
        });

// ✅ Task 삭제
export const deleteTask = (task_id) =>
    api
        .delete(`/tasks/${task_id}`)
        .then((res) => res.data)
        .catch((err) => {
            console.error("Task 삭제 실패:", err);
            throw err;
        });

// ✅ Task 상태 업데이트
export const updateTaskStatus = (task_id, data) =>
    api
        .patch(`/tasks/${task_id}/status`, data)
        .then((res) => res.data)
        .catch((err) => {
            console.error("Task 상태 업데이트 실패:", err);
            throw err;
        });

// ✅ 특정 날짜의 Task 조회
export const getTasksByDay = (user_id, date) =>
    api
        .post(`/tasks/${user_id}/day`, { date })
        .then((res) => res.data)
        .catch((err) => {
            console.error("날짜별 Task 조회 실패:", err);
            throw err;
        });

// ✅ 한 달치 Task 통계 조회 (기존)
export const getTasksByMonth = (user_id, start_date, end_date) =>
    api
        .post(`/tasks/stats/monthly/${user_id}`, { start_date, end_date })
        .then((res) => res.data)
        .catch((err) => {
            console.error("월간 Task 통계 조회 실패:", err);
            throw err;
        });

// ✅ 월간 Task 목록 조회 (집계 아님, 캘린더용)
export const getMonthlyTasks = (user_id, start_date, end_date) =>
    api
        .post(`/tasks/${user_id}/month`, { start_date, end_date })
        .then((res) => res.data)
        .catch((err) => {
            console.error("월간 Task 목록 조회 실패:", err);
            throw err;
        });

// ✅ 알림 전체 조회
export const getNotifications = (user_id) => api.get(`/notifications/${user_id}`).then((res) => res.data);

// ✅ 알림 개별 조회
export const getNotificationById = (user_id, notification_id) => api.get(`/notifications/${user_id}/${notification_id}`).then((res) => res.data);

// ✅ 알림 읽음 처리
export const markNotificationRead = (notification_id) => api.patch(`/notifications/${notification_id}/read`).then((res) => res.data);

// ✅ 필요 시 기본 api 인스턴스 export
export default api;

// ✅ 루틴 생성
export const createRoutine = (task_id, routine_type, start_date, end_date, user_id) =>
    api
        .post(`/tasks/routine/${task_id}`, {
            routine_type,
            start_date,
            end_date,
            user_id,
        })
        .then((res) => res.data)
        .catch((err) => {
            console.error("루틴 생성 실패:", err);
            throw err;
        });

// ✅ 주간 Task 통계 조회
export const getWeeklyStats = (user_id) =>
    api
        .get(`/tasks/stats/weekly/${user_id}`)
        .then((res) => res.data)
        .catch((err) => {
            console.error("주간 Task 통계 조회 실패:", err);
            throw err;
        });


export const updateTask = async (taskId, data) => {
  const token = localStorage.getItem("token"); // JWT 등
  const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Task 업데이트 실패");
  return await response.json();
};