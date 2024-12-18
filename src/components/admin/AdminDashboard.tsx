import React, { useState, useEffect } from 'react';
import { AdminSetup } from '../auth/AdminSetup';
import { AdminLogin } from '../auth/AdminLogin';
import { AdminPanel } from './AdminPanel';
import { Toaster } from 'sonner';
import { api_Url } from '../../config';
export const AdminDashboard: React.FC = () => {
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  // Check if the admin is already set up
  useEffect(() => {
    const checkAdminSetup = async () => {
      try {
        console.log("Fetching");
        const response = await fetch(`${api_Url}/api/admin`); // API to check if admin exists
        const data = await response.json();
        if (data.success && data.data) {
          setIsSetup(true);
        } else {
          setIsSetup(false);
        }
      } catch (error) {
        console.error('Error checking admin setup:', error);
        setIsSetup(false);
      }
    };

    checkAdminSetup();
  }, []);

  // Display a loading state while checking setup
  if (isSetup === null) {
    return <div>Loading...</div>;
  }

  if (!isSetup) {
    return (
      <AdminSetup
        onSetupComplete={() => {
          setIsSetup(true); // Update the state after setup
        }}
      />
    );
  }

  if (!isLoggedIn||isLoggedOut) {
    return (
      <AdminLogin
        onLogin={() => {
          console.log('Admin logged in');
          setIsLoggedIn(true);
          setIsLoggedOut(false);
        }}
      />
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <AdminPanel 
      onLogout={() => {
        console.log('Admin logged out');
        setIsLoggedOut(true);
      }} />
    </>
  );
};
