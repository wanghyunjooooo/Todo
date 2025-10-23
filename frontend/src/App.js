import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BottomNav from "./components/Nav";
import AuthForm from "./pages/AuthForm";

function App() {
  return (
    <Router>
      <div
        style={{
          height: "844px",
          width: "390px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* 페이지 내용 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/notifications" element={<h2>알림 페이지</h2>} />
          <Route path="/profile" element={<h2>내 정보 페이지</h2>} />
        </Routes>

        {/* BottomNav 고정 */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
