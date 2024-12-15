import React, { useState } from 'react';
import { Button } from '../ui/button';
import { TwoFactorSetup } from './TwoFactorSetup';
import axios from 'axios';
import { api_Url } from '../../config';

export const AdminSetup: React.FC<{ onSetupComplete: () => void }> = ({ onSetupComplete }) => {
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 12) {
      setError('Password must be at least 12 characters long');
      return;
    }

    setStep('2fa');
  };

  const handleTwoFactorComplete = async (twoFactorSecret: string) => {
    try {
      const response = await axios.post(`${api_Url}/api/admin/setup`, {
        username,
        password,
        twoFactorSecret,
      });

      if (response.data.success) {
        alert('Admin account created successfully!');
        onSetupComplete(); // Notify AdminDashboard to recheck setup status
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error creating admin account:', err.message);
      setError('An error occurred while setting up the admin account.');
    }
  };

  if (step === '2fa') {
    return (
      <TwoFactorSetup
        onComplete={handleTwoFactorComplete}
        onCancel={() => setStep('credentials')}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1B1B21] p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-[#C33AFF] text-center mb-4">Create Admin Account</h2>
          <p className="text-sm text-gray-400 text-center">
            This is a one-time setup. No additional admin accounts can be created.
          </p>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-[#121218] text-gray-300 border border-[#C33AFF] rounded focus:ring-[#C33AFF] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#121218] text-gray-300 border border-[#C33AFF] rounded focus:ring-[#C33AFF] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-[#121218] text-gray-300 border border-[#C33AFF] rounded focus:ring-[#C33AFF] focus:outline-none"
            />
          </div>

          {error && <div className="text-red-500 text-center text-sm">{error}</div>}

          <Button type="submit" className="w-full bg-purple-700 text-white hover:bg-[#C33AFF]/90">
            Continue to 2FA Setup
          </Button>
        </form>
      </div>
    </div>
  );
};
