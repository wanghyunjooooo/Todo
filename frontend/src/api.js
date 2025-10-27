// src/api.js
import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "서버 요청 중 오류가 발생했습니다.";
    console.error("API 오류:", message);
    return Promise.reject(error);
  }
);

// ✅ 로그인
export const loginUser = (email, password) =>
  api.post("/users/login", { user_email: email, user_password: password });

// ✅ 회원가입
export const signupUser = (username, email, password) =>
  api.post("/users/signup", { user_name: username, user_email: email, user_password: password });

// ✅ 카테고리 불러오기
export const getCategories = (user_id) =>
  api.get(`/categories?userId=${user_id}`).then((res) => res.data);

// ✅ Task 추가
export const addTask = (taskData) =>
  api.post("/tasks", taskData).then((res) => res.data);

// ✅ Task 삭제
export const deleteTask = (task_id) =>
  api.delete(`/tasks/${task_id}`).then((res) => res.data);

// ✅ 필요 시 default로 api 인스턴스도 export
export default api;

// ✅ 특정 날짜의 Task 조회
export const getTasksByDay = (user_id, date) =>
  api.post(`/tasks/${user_id}/day`, { date }).then((res) => res.data);