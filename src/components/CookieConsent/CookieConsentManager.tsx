import React, { useEffect, useState } from 'react';
import { useCookieConsent } from './useCookieConsent';
import { CookieSettings } from './CookieSettings';

export const CookieConsentManager: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { 
    hasConsent,
    preferences,
    updatePreferences,
    acceptAll,
    rejectAll
  } = useCookieConsent();

  if (hasConsent && !showSettings) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm border border-white/20 rounded hover:bg-white/10 transition"
              >
                Cookie Settings
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-purple-600 rounded hover:bg-purple-700 transition"
              >
                Accept All
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Reject All
              </button>
            </div>
          </div>
        ) : (
          <CookieSettings
            preferences={preferences}
            onUpdate={updatePreferences}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
};