import React, { useState } from 'react';
import { Button } from '../ui/button';
import { api_Url } from '../../config';
interface Props {
  onLogin: () => void; // Callback after successful login
}

export const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [error, setError] = useState('');
  const [secret, setSecret] = useState('')

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');



    try {
      const response = await fetch(`${api_Url}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        setSecret(data.twoFactorSecret);
        setStep('2fa'); // Proceed to 2FA verification
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Error during login. Please try again.');
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
     
      const response = await fetch(`${api_Url}/api/admin/verify-2fa`, {
       
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  secret, token:twoFactorToken }),
      });

      const data = await response.json();
      if (data.success) {
        onLogin(); // Callback on successful login
      } else {
        setError(data.message || 'Invalid 2FA code');
      }
    } catch (error) {
      setError('Error verifying 2FA. Please try again.');
    }
  };

  if (step === '2fa') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121218] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-[#1B1B21] p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#C33AFF] text-center mb-4">Enter 2FA Code</h2>

          <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit code"
              value={twoFactorToken}
              onChange={(e) => setTwoFactorToken(e.target.value)}
              className="w-full p-3 bg-[#121218] text-gray-300 border border-[#C33AFF] rounded focus:ring-[#C33AFF] focus:outline-none"
            />

            {error && <div className="text-red-500 text-center text-sm">{error}</div>}

            <div className="flex space-x-4">
              <Button onClick={() => setStep('credentials')} className="w-full bg-purple-900 text-white hover:bg-purple-950">
                Back
              </Button>
              <Button type="submit" className="w-full bg-purple-900 text-white hover:bg-950" disabled={twoFactorToken.length !== 6}>
                Verify
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1B1B21] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#C33AFF] text-center mb-4">Admin Login</h2>

        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
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

          {error && <div className="text-red-500 text-center text-sm">{error}</div>}

          <Button type="submit" className="w-full bg-purple-700 text-white hover:bg-purple-700/70">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
