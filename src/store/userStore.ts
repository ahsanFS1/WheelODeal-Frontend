import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SpinHistory {
  ip: string;
  timestamp: number;
}

interface UserStore {
  spinHistory: SpinHistory[];
  addSpin: (ip: string) => void;
  canSpin: (ip: string) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      spinHistory: [],
      addSpin: (ip: string) => {
        set((state) => ({
          spinHistory: [...state.spinHistory, { ip, timestamp: Date.now() }]
        }));
      },
      canSpin: (ip: string) => {
        const history = get().spinHistory;
        const lastSpin = history.find(h => h.ip === ip);
        if (!lastSpin) return true;
        
        const hoursSinceLastSpin = (Date.now() - lastSpin.timestamp) / (1000 * 60 * 60);
        return hoursSinceLastSpin >= 48;
      }
    }),
    {
      name: 'user-storage'
    }
  )
);