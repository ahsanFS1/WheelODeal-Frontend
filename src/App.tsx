import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicPage } from './components/PublicPage';
import { MainLandingPage } from './components/MainLandingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginForm } from './components/auth/LoginForm';
import { UserDashboard } from './components/UserDashboard';
import { useAuthStore } from './store/authStore';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';

// Protected Route component
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user } = useAuthStore();
//   if (!user) return <Navigate to="/" replace />;
//   return <>{children}</>;
// };

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  if (!user || user.type !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    console.log("Running the app"),
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLandingPage />} />
        <Route path="/wheel/:projectId" element={<PublicPage />} />
        <Route path="/user001z" element={<LoginForm />} />
        <Route 
          path="/admin_d01z" 
          element={
            <AdminDashboard />
          } 
        />
        <Route 
          path="/login-form" 
          element={
            // <ProtectedRoute>
              <LoginForm />
            // </ProtectedRoute>
          }
        />

      <Route
        path = "/user-dashboard/:projectId"
        element = {
          <UserDashboard />
        }
      
      />
       <Route
        path = "/analytics"
        element = {
          <AnalyticsDashboard
          
          pageId='1'/>
        }
      
      />
      
        
      </Routes>
    </BrowserRouter>
  );
}