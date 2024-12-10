import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicPage } from './components/PublicPage';
import { MainLandingPage } from './components/MainLandingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginForm } from './components/auth/LoginForm';
import { UserDashboard } from './components/UserDashboard';

import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = sessionStorage.getItem('userToken'); // Check token in session storage
  if (!token) return <Navigate to="/user001z" replace />; // Redirect to login if no token
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLandingPage />} />
        <Route path="/wheel/:projectId" element={<PublicPage />} />
        <Route path="/user001z" element={<LoginForm />} />
        <Route 
          path="/admin_d01z" 
          element={<AdminDashboard />} 
        />
        <Route 
          path="/login-form" 
          element={<LoginForm />} 
        />
        <Route
          path="/user-dashboard/:projectId"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard pageId="1" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
