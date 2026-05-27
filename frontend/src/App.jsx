import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/common/LoadingScreen';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import EventsPublicPage from './pages/public/EventsPublicPage';
import ClubsPage from './pages/public/ClubsPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Student Pages
import StudentLayout from './components/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentEvents from './pages/student/StudentEvents';
import StudentMyEvents from './pages/student/StudentMyEvents';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentProfile from './pages/student/StudentProfile';

// Organizer Pages
import OrganizerLayout from './components/organizer/OrganizerLayout';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import ManageEvents from './pages/organizer/ManageEvents';
import EventRegistrations from './pages/organizer/EventRegistrations';
import UploadCertificates from './pages/organizer/UploadCertificates';
import AttendancePage from './pages/organizer/AttendancePage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminOrganizers from './pages/admin/AdminOrganizers';
import AdminClubs from './pages/admin/AdminClubs';
import AdminEvents from './pages/admin/AdminEvents';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-royal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-body">Loading CampusHub...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <LoadingScreen />
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#0a1628', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontFamily: 'Inter, system-ui, sans-serif' },
              success: { iconTheme: { primary: '#60a5fa', secondary: '#0a1628' } },
              error: { iconTheme: { primary: '#f87171', secondary: '#0a1628' } },
            }}
          />
          <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPublicPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="events" element={<StudentEvents />} />
            <Route path="my-events" element={<StudentMyEvents />} />
            <Route path="certificates" element={<StudentCertificates />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Organizer */}
          <Route path="/organizer" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerLayout /></ProtectedRoute>}>
            <Route index element={<OrganizerDashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="registrations/:eventId" element={<EventRegistrations />} />
            <Route path="certificates" element={<UploadCertificates />} />
            <Route path="attendance/:eventId" element={<AttendancePage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="organizers" element={<AdminOrganizers />} />
            <Route path="clubs" element={<AdminClubs />} />
            <Route path="events" element={<AdminEvents />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
  );
}

export default App;
