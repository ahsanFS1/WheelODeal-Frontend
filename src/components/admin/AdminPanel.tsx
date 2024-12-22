import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { Settings, Key, LogOut } from 'lucide-react';
import { SecretKeyManager } from './SecretKeyManager';
import { LandingPageEditor } from './LandingPageEditor';
import { toast } from 'sonner';
import { AccessibilityMenu } from '../AccessibilityMenu';




interface Props {
  onLogout: () => void; // Callback after successful login
}

export const AdminPanel: React.FC<Props> = ({onLogout}) => {
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('keys');
 
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-[#121218]">
      <AccessibilityMenu/>
      <header className="bg-[#1B1B21] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#D3D3DF] flex items-center gap-2">
            <Settings className="w-8 h-8 text-[#C33AFF]" />
            Admin Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-[#C33AFF] text-[#D3D3DF] hover:bg-[#C33AFF]/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex space-x-4 border-b border-[#C33AFF]/20 mb-8">
            <Tabs.Trigger
              value="keys"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Secret Keys
            </Tabs.Trigger>
            <Tabs.Trigger
              value="landing"
              className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
            >
              Landing Page
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="keys" className="outline-none">
            <SecretKeyManager />
          </Tabs.Content>

          <Tabs.Content value="landing" className="outline-none">
            <LandingPageEditor />
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
};