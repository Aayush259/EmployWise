import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./utils/funcs";
import Login from "./components/Login";
import UserList from "./components/UserList";
import EditUser from "./components/EditUser";
import { UserContextProvider } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {

    // State to track if the user is logged in
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    // Check if the user is logged in on component mount
    useEffect(() => {
        setLoggedIn((getToken() ? true : false));
    }, []);

    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        return loggedIn ? children : <Navigate to="/login" />;
    };

    if (loggedIn === null) return null;

    return (
        <Routes>
            <Route
                path="/"
                element={loggedIn ? <Navigate to="/user-list" /> : <Navigate to="/login" />}
            />
            <Route
                path="/login"
                element={loggedIn ? <Navigate to="/user-list" /> : <Login />}
            />

            <Route
                path="*"
                element={
                    <ProtectedRoute>
                        <ToastProvider>
                            <UserContextProvider>
                                <Routes>
                                    <Route path="user-list" element={<UserList />} />
                                    <Route path="edit" element={<EditUser />} />
                                </Routes>
                            </UserContextProvider>
                        </ToastProvider>
                    </ProtectedRoute>
                } />
        </Routes>
    );
}
