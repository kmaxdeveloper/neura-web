import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Layouts
import { AdminLayout, TeacherLayout, StudentLayout } from './components/Layouts';

// Pages
import Login from './pages/Login';
import Attendance from './pages/Attendance';
import MizanAI from './pages/MizanAI';
import Leaderboard from './pages/Leaderboard';
import Arcade from './pages/Arcade';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMatrix from './pages/admin/AdminMatrix';
import AdminImport from './pages/admin/AdminImport';
import AdminManagement from './pages/admin/AdminManagement';
import SystemLogs from './pages/admin/SystemLogs';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import TeacherProfile from './pages/teacher/TeacherProfile';
import StudentProfile from './pages/student/StudentProfile';
import TeacherSchedule from './pages/teacher/TeacherSchedule'; // Yangi
import StudentTimetable from './pages/student/StudentTimetable'; // Yangi

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherQRDashboard from './pages/teacher/TeacherQRDashboard';
import TeacherSyllabus from './pages/teacher/TeacherSyllabus';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';

const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  TEACHER: 'ROLE_TEACHER',
  STUDENT: 'ROLE_STUDENT'
} as const;

// --- HELPERS ---

// QR Dashboard uchun ID'ni raqamga o'girib beruvchi wrapper
const QRWrapper = () => {
  const { lessonId } = useParams();
  return <TeacherQRDashboard lessonId={Number(lessonId)} />;
};

// Logindan so'ng roliga qarab yo'naltirish
const RootRedirect = () => {
  const auth = useContext(AuthContext);
  if (!auth?.user) return <Navigate to="/login" replace />;
  
  const role = auth.user.role;
  if (role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
  if (role === ROLES.TEACHER) return <Navigate to="/teacher/dashboard" replace />;
  if (role === ROLES.STUDENT) return <Navigate to="/student/dashboard" replace />;
  
  return <Navigate to="/login" replace />;
};

// --- MAIN CONTENT ---

function AppContent() {
  return (
    <Routes>
      {/* Ochiq route */}
      <Route path="/login" element={<Login />} />

      {/* 🛠 ADMIN ROUTES (Cyan Theme) */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="matrix" element={<AdminMatrix />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="import" element={<AdminImport />} />
              <Route path="management" element={<AdminManagement />} />
              <Route path="logs" element={<SystemLogs />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="leaderboard" element={<Leaderboard />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* 👨‍🏫 TEACHER ROUTES (Purple Theme) */}
      <Route path="/teacher/*" element={
        <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
          <TeacherLayout>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="qr-session/:lessonId" element={<QRWrapper />} />
              <Route path="syllabus/:subjectId" element={<TeacherSyllabus />} />
              <Route path="schedule" element={<TeacherSchedule />} />
              <Route path="mizan" element={<MizanAI />} />
              <Route path="profile" element={<TeacherProfile />} />
              <Route path="leaderboard" element={<Leaderboard />} />
            </Routes>
          </TeacherLayout>
        </ProtectedRoute>
      } />

      {/* 🎓 STUDENT ROUTES (Emerald Theme) */}
      <Route path="/student/*" element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="timetable" element={<StudentTimetable />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="mizan" element={<MizanAI />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="arcade" element={<Arcade />} />
            </Routes>
          </StudentLayout>
        </ProtectedRoute>
      } />

      {/* Redirects */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster position="bottom-right" reverseOrder={false} />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;