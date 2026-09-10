import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Courses } from './pages/public/Courses';
import { CourseDetail } from './pages/public/CourseDetail';
import { Teachers } from './pages/public/Teachers';
import { Schedules } from './pages/public/Schedules';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { CoursesAdmin } from './pages/admin/CoursesAdmin';
import { StudentsAdmin } from './pages/admin/StudentsAdmin';
import { TeachersAdmin } from './pages/admin/TeachersAdmin';
import { ClassesAdmin } from './pages/admin/ClassesAdmin';
import { SchedulesAdmin } from './pages/admin/SchedulesAdmin';
import { PaymentsAdmin } from './pages/admin/PaymentsAdmin';
import { ResultsAdmin } from './pages/admin/ResultsAdmin';
import { ProgressAdmin } from './pages/admin/ProgressAdmin';
import { RegistrationsAdmin } from './pages/admin/RegistrationsAdmin';
import { ReportsAdmin } from './pages/admin/ReportsAdmin';
import { SettingsAdmin } from './pages/admin/SettingsAdmin';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="classes" element={<Courses />} />
            <Route path="schedule" element={<Schedules />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Dashboard Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<CoursesAdmin />} />
            <Route path="students" element={<StudentsAdmin />} />
            <Route path="teachers" element={<TeachersAdmin />} />
            <Route path="classes" element={<ClassesAdmin />} />
            <Route path="schedules" element={<SchedulesAdmin />} />
            <Route path="payments" element={<PaymentsAdmin />} />
            <Route path="results" element={<ResultsAdmin />} />
            <Route path="progress" element={<ProgressAdmin />} />
            <Route path="registrations" element={<RegistrationsAdmin />} />
            <Route path="reports" element={<ReportsAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>

          {/* Catch-all fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
