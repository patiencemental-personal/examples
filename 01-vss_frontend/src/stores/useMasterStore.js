import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useMasterStore = create(
  persist(
    (set, get) => ({
      name: "Admin",
      logined: false,
      apiKey: null,
      login(newApiKey) {
        set((store) => ({
          ...store,
          logined: true,
          apiKey: newApiKey,
        }))
      },
      logout() {
        set(() => ({
          logined: false,
          apiKey: null,
        }))
      },
    }),
    {
      name: 'master-storage',
      getStorage: () => sessionStorage
    }
  )
);