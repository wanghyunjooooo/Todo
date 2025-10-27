import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import BottomNav from "./components/Nav";
import AuthForm from "./pages/AuthForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // ✅ 초기값 null → 아직 로딩 중 상태 구분

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // 토큰 있으면 true
  }, []);

  if (isLoggedIn === null) {
    // ✅ 초기 로딩 중일 때 깜빡임 방지
    return <div style={{ textAlign: "center", marginTop: "40vh" }}>로딩 중...</div>;
  }

  return (
    <Router>
      <MainContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

function MainContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const hideNav = location.pathname === "/auth"; // 로그인/회원가입 페이지에서는 nav 숨김

  return (
    <div
      style={{
        height: "844px",
        width: "390px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Home /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/auth"
          element={<AuthForm onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/notifications"
          element={isLoggedIn ? <h2>알림 페이지</h2> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <h2>내 정보 페이지</h2> : <Navigate to="/auth" replace />}
        />
      </Routes>

      {/* 로그인/회원가입 페이지에서는 nav 숨김 */}
      {isLoggedIn && !hideNav && <BottomNav />}
    </div>
  );
}

export default App;
