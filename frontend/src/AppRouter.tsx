import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import FormPage from "./routes/FormPage";
import DisplayPage from "./routes/DisplayPage";
import LoginPage from "./routes/LoginPage";

const AppRouter: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <nav>
                <ul>
                    {!isAuthenticated ? (
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to="/form">Insert Data</Link>
                            </li>
                            <li>
                                <Link to="/display">View Data</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/form" element={isAuthenticated ? <FormPage /> : <Navigate to="/login" />} />
                <Route path="/display" element={isAuthenticated ? <DisplayPage /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/form" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
