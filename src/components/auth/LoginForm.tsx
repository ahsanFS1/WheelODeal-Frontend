import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Key } from 'lucide-react';
import { toast } from 'sonner';
import { UserDashboard } from '../UserDashboard';
import { api_Url } from '../../config';




export const LoginForm: React.FC = () => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Call backend to validate the secret key
      const response = await fetch(`${api_Url}/api/admin/keys/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Invalid secret key');
        return;
      }

      // Key is valid, extract plan and projectName
      const { plan, projectName ,projectId} = data.data;

      const token = btoa(
        JSON.stringify({
          id: Date.now().toString(),
          type: 'user',
          name: 'User',
          plan,
          projectName,
        })
      );

      // Save the token in session storage (or any other storage mechanism)
      sessionStorage.setItem('userToken', token);

      toast.success('Login successful!');
      
      navigate(`/user-dashboard/${projectId}`);
    } catch (err) {
      console.error('Error validating secret key:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#D3D3DF] flex items-center justify-center gap-2">
            <Key className="w-8 h-8 text-[#C33AFF]" />
            User Access
          </h2>
          <p className="mt-2 text-center text-sm text-[#D3D3DF]/60">
            Enter your secret key to access the dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="secretKey" className="sr-only">
              Secret Key
            </label>
            <input
              id="secretKey"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-[#C33AFF]/20 placeholder-[#D3D3DF]/40 text-[#D3D3DF] rounded-lg bg-[#1B1B21] focus:outline-none focus:ring-2 focus:ring-[#C33AFF] focus:border-transparent"
              placeholder="Enter your secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div className='flex justify-center'>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-[#C33AFF] text-[#D3D3DF] bg-[#1B1B21] hover:bg-[#C33AFF] hover:text-white transition-all duration-200 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C33AFF]"
            >
              Access Dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


//