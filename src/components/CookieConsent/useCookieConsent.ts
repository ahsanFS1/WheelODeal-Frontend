import { useState, useEffect } from 'react';
import { CookiePreferences, CookieConsentStore } from './types';

const CONSENT_KEY = 'cookie_consent';

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true
  analytics: false,
  marketing: false,
};

export const useCookieConsent = () => {
  const [consentStore, setConsentStore] = useState<CookieConsentStore>(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored
      ? JSON.parse(stored)
      : { hasConsent: false, preferences: defaultPreferences };
  });

  const saveConsent = (store: CookieConsentStore) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(store));
    setConsentStore(store);
  };

  const updatePreferences = (newPreferences: CookiePreferences) => {
    const updatedStore = {
      hasConsent: true,
      preferences: { ...newPreferences, necessary: true },
    };
    saveConsent(updatedStore);
  };

  const acceptAll = () => {
    const allAccepted = {
      hasConsent: true,
      preferences: {
        necessary: true,
        analytics: true,
        marketing: true,
      },
    };
    saveConsent(allAccepted);
  };

  const rejectAll = () => {
    const allRejected = {
      hasConsent: true,
      preferences: {
        necessary: true,
        analytics: false,
        marketing: false,
      },
    };
    saveConsent(allRejected);
  };

  return {
    hasConsent: consentStore.hasConsent,
    preferences: consentStore.preferences,
    updatePreferences,
    acceptAll,
    rejectAll,
  };
};