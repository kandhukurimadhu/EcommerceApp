import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/DashboardPage';
import ProfilePage      from './pages/ProfilePage';
import AdminPage        from './pages/AdminPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';

import './styles/global.css';

/**
 * Root application component.
 *
 * Route structure:
 *  /               → redirect to /dashboard
 *  /login          → public
 *  /register       → public
 *  /oauth2/callback→ public (SSO redirect handler)
 *  /dashboard      → protected (all authenticated users)
 *  /profile        → protected (all authenticated users)
 *  /admin          → protected + admin only
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login"            element={<LoginPage />} />
          <Route path="/register"         element={<RegisterPage />} />
          <Route path="/oauth2/callback"  element={<OAuth2CallbackPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>

      {/* Global toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="dark"
        style={{ fontSize: 14 }}
      />
    </AuthProvider>
  );
}

export default App;
