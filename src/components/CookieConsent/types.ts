export interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  }
  
  export interface CookieConsentStore {
    hasConsent: boolean;
    preferences: CookiePreferences;
  }