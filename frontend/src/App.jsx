import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import EmployerPanel from './pages/EmployerPanel';
import AdminPanel from './pages/AdminPanel';
import SavedJobs from './pages/SavedJobs';
import MyApplications from './pages/MyApplications';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['job_seeker']} />}>
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/my-applications" element={<MyApplications />} />
          </Route>

          <Route element={<ProtectedRoute roles={['employer']} />}>
            <Route path="/employer" element={<EmployerPanel />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
