import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import AuthForm from "./pages/AuthForm";
import MyProfile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import EditProfile from "./components/EditProfile";
import SearchPage from "./pages/Search";
import CategoryTasks from "./pages/CategoryTasks"; // ✅ 새로 import

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    if (isLoggedIn === null) {
        return (
            <div style={{ textAlign: "center", marginTop: "40vh" }}>
                로딩 중...
            </div>
        );
    }

    return (
        <Router>
            <MainContent
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />
        </Router>
    );
}

function MainContent({ isLoggedIn, setIsLoggedIn }) {
    const location = useLocation();
    const hideNav = location.pathname === "/auth";

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
                {/* 홈 */}
                <Route
                    path="/"
                    element={
                        isLoggedIn ? <Home /> : <Navigate to="/auth" replace />
                    }
                />

                {/* 로그인/회원가입 */}
                <Route
                    path="/auth"
                    element={<AuthForm onLogin={() => setIsLoggedIn(true)} />}
                />

                {/* 알림 페이지 */}
                <Route
                    path="/notifications"
                    element={
                        isLoggedIn ? (
                            <Notifications />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                    }
                />

                {/* 내 프로필 */}
                <Route
                    path="/profile"
                    element={
                        isLoggedIn ? (
                            <MyProfile />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                    }
                />

                {/* 프로필 수정 */}
                <Route
                    path="/edit-profile"
                    element={
                        isLoggedIn ? (
                            <EditProfile />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                    }
                />

                {/* 검색 페이지 */}
                <Route
                    path="/search"
                    element={
                        isLoggedIn ? (
                            <SearchPage />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                    }
                />

                {/* ✅ 카테고리별 할 일 페이지 */}
                <Route
                    path="/tasks/:categoryId"
                    element={
                        isLoggedIn ? (
                            <CategoryTasks />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                    }
                />

                {/* 그 외 경로 */}
                <Route
                    path="*"
                    element={
                        <Navigate to={isLoggedIn ? "/" : "/auth"} replace />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
