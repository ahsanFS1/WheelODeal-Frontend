import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (token: string, secretKey: string) => {
        try {
          // Decode base64 token
          const decodedToken = atob(token);
          const user = JSON.parse(decodedToken);
          
          // Add secret key to user object if provided
          const userWithKey = secretKey ? { ...user, secretKey } : user;
          
          set({ user: userWithKey, token });
        } catch (error) {
          console.error('Error processing token:', error);
          throw new Error('Invalid authentication token');
        }
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      version: 1,
    }
  )
);