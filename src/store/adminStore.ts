import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SecretKey } from '../types';

interface AdminState {
  isSetup: boolean;
  credentials: {
    username: string;
    password: string;
  } | null;
  secretKeys: SecretKey[];
  setCredentials: (creds: AdminState['credentials']) => void;
  addSecretKey: (key: SecretKey) => void;
  removeSecretKey: (key: string) => void;
  reset: () => void;
}

const initialState = {
  isSetup: false,
  credentials: null,
  secretKeys: [],
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      ...initialState,
      setCredentials: (credentials) => set({ credentials, isSetup: true }),
      addSecretKey: (key) => set((state) => ({ 
        secretKeys: [...state.secretKeys, key] 
      })),
      removeSecretKey: (keyToRemove) => set((state) => ({ 
        secretKeys: state.secretKeys.filter(k => k.key !== keyToRemove) 
      })),
      reset: () => set(initialState),
    }),
    {
      name: 'admin-storage',
    }
  )
);