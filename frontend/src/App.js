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
import Notifications from "./pages/Notifications"; // 새로 import
import EditProfile from "./components/EditProfile";

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
                    element={
                        isLoggedIn ? (
                            <Notifications />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                    }
                />
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
                <Route
                    path="*"
                    element={
                        <Navigate to={isLoggedIn ? "/" : "/auth"} replace />
                    }
                />

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
            </Routes>
        </div>
    );
}

export default App;
