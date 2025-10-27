// src/api.js
import axios from "axios";

// ✅ 기본 API URL 설정
const API_URL = "http://localhost:8080";

// ✅ Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터: 토큰 자동 추가
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

// ✅ 응답 인터셉터: 에러 공통 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "서버 요청 중 오류가 발생했습니다.";
    console.error("API 오류:", message);
    return Promise.reject(error);
  }
);

export default api;
