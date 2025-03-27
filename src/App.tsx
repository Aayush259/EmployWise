import { useEffect, useState } from "react";
import Login from "./components/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./utils/funcs";

export default function App() {

    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        setLoggedIn((getToken() ? true : false));
    }, []);

    if (loggedIn === null) return null;

    return (
        <Routes>
            <Route
                path="/login"
                element={loggedIn ? <Navigate to="/" /> : <Login />}
            />
            <Route
                path="/"
                element={loggedIn ? (
                    <div>Welcome Back</div>
                ) : (
                    <Navigate to="/login" />
                )}
            />
        </Routes>
    );
};
