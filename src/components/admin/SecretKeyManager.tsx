import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Key } from 'lucide-react';
import {api_Url} from '../../config';
import { web_Url } from '../../config';
interface SecretKey {
  _id: string;
  secretKey: string;
  projectName: string;
  projectId: string; // Added projectId
  plan: string;
  expiryDate: string;
}

export const SecretKeyManager: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [plan, setPlan] = useState<'basic' | 'better' | 'best'>('basic');
  const [expiryDate, setExpiryDate] = useState('');
  const [secretKeys, setSecretKeys] = useState<SecretKey[]>([]);

  // Fetch keys from the database
  const fetchSecretKeys = async () => {
    try {
      const response = await fetch(`${api_Url}/api/admin/keys`);
      const data = await response.json();
      if (data.success) {
        setSecretKeys(data.data);
      }
    } catch (error) {
      console.error('Error fetching secret keys:', error.message);
    }
  };

  useEffect(() => {
    fetchSecretKeys();
  }, []);

  // Create a new key
  const generateSecretKey = async () => {
    if (!projectName || !expiryDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
     
      let totalPages = 0;
      let remainingPages = 0; // Default value for remainingPages
  
      // Set pages based on the selected plan
      switch (plan) {
        case 'basic':
          totalPages = 1;
          remainingPages = 1
          break;
        case 'better':
          totalPages = 3;
          remainingPages = 3
          break;
        case 'best':
          totalPages = 6;
          remainingPages =6
          break;
      }
      const response = await fetch(`${api_Url}/api/admin/keys`, {
      
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          plan,
          expiryDate,
          totalPages, 
          remainingPages
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSecretKeys((prev) => [...prev, data.data]);
        setProjectName('');
        setExpiryDate('');
      }
    } catch (error) {
      console.error('Error creating secret key:', error.message);
    }
  };

  // Delete a key
 const handleDelete = async (id: string, projectId: string) => {
  if (window.confirm('Are you sure you want to revoke this key?')) {
    // Optimistically update the UI
    setSecretKeys((prev) => prev.filter((key) => key._id !== id));

    try {
      const response = await fetch(`${api_Url}/api/admin/keys/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!data.success) {
        // If the API fails, roll back the optimistic update
        
        fetchSecretKeys(); // Re-fetch the secret keys to ensure the UI is in sync
      }
    } catch (error) {
      console.error('Error deleting secret key:', error.message);
      alert('An error occurred while revoking the key.');
      fetchSecretKeys(); // Re-fetch to restore the state
    }
  }
};
return (
  <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#D3D3DF] mb-6">Generate New Secret Key</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF] placeholder-[#D3D3DF]/40 w-full"
        />
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as 'basic' | 'better' | 'best')}
          className="px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF] w-full"
        >
          <option value="basic">Basic Plan</option>
          <option value="better">Better Plan</option>
          <option value="best">Best Plan</option>
        </select>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF] w-full"
        />
        <Button
          onClick={generateSecretKey}
          className="flex items-center justify-center gap-2 bg-purple-900 text-white hover:bg-purple-950 w-full sm:w-auto"
        >
          <Key className="w-4 h-4" />
          Generate Key
        </Button>
      </div>
    </div>

    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#D3D3DF] flex items-center gap-2">
        <Key className="w-6 h-6" />
        Active Secret Keys
      </h2>

      <div className="space-y-4">
        {secretKeys.map((secretKey) => (
          <div
            key={secretKey._id}
            className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 flex flex-col gap-2 sm:flex-row sm:justify-between"
          >
            <div className="space-y-2 w-full">
              <h3 className="text-lg font-semibold text-[#D3D3DF]">
                {secretKey.projectName}
              </h3>
              <code className="block w-full break-words px-2 py-1 bg-[#1B1B21] rounded text-sm font-mono text-[#D3D3DF]">
                Secret Key: {secretKey.secretKey}
              </code>
              <code className="block w-full break-words text-sm font-mono text-[#D3D3DF]">
                Project ID: {secretKey.projectId}
              </code>
              <p className="text-sm text-[#D3D3DF]/60">Plan: {secretKey.plan}</p>
              <p className="text-sm text-[#D3D3DF]/60">
                Expires: {new Date(secretKey.expiryDate).toLocaleDateString()}
              </p>
           
            </div>
            <Button
              onClick={() => handleDelete(secretKey._id, secretKey.projectId)}
              variant="destructive"
              className="w-full sm:w-[100px]"
            >
              Revoke
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};