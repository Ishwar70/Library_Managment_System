import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import StudentDashboard from "./pages/StudentDashboard";
import LibrarianDashboard from "./pages/LibrarianDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/librarian" element={<LibrarianDashboard />} />
        <Route path="*" element={<h2>404 Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}