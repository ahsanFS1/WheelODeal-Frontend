import React from 'react';
import { CookiePreferences } from './types';

interface CookieSettingsProps {
  preferences: CookiePreferences;
  onUpdate: (preferences: CookiePreferences) => void;
  onClose: () => void;
}

export const CookieSettings: React.FC<CookieSettingsProps> = ({
  preferences,
  onUpdate,
  onClose,
}) => {
  const handleToggle = (key: keyof CookiePreferences) => {
    onUpdate({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Cookie Settings</h2>
        <button
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Save & Close
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Necessary</h3>
            <p className="text-sm text-gray-400">Required for the website to function properly</p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={true}
              disabled
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Analytics</h3>
            <p className="text-sm text-gray-400">Help us improve our website</p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={() => handleToggle('analytics')}
              className="sr-only peer"
            />
            <div 
              className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 cursor-pointer"
              onClick={() => handleToggle('analytics')}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Marketing</h3>
            <p className="text-sm text-gray-400">Personalized advertisements</p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={() => handleToggle('marketing')}
              className="sr-only peer"
            />
            <div 
              className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 cursor-pointer"
              onClick={() => handleToggle('marketing')}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};