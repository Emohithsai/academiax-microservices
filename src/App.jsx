import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AcademicProvider } from './context/AcademicContext';
import StudentPortal from './pages/StudentPortal';
import FacultyPortal from './pages/FacultyPortal';
import Register from './pages/Register';
import Login from './pages/Login'; // Ensure this matches your login file name (e.g., AuthPage or Login)

export default function App() {
  return (
    <AcademicProvider>
      <Router>
        <Routes>
          {/* Default Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route path="/student-dashboard" element={<StudentPortal />} />
          <Route path="/faculty-dashboard" element={<FacultyPortal />} />

          {/* Catch-All Fallback (Fixes Blank Screen if Path is Wrong) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AcademicProvider>
  );
}