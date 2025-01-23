import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import FormPage from "./routes/FormPage";
import DisplayPage from "./routes/DisplayPage";

const AppRouter: React.FC = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/form">Insert Data</Link></li>
                    <li><Link to="/display">View Data</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Navigate to="/form" replace />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/display" element={<DisplayPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
