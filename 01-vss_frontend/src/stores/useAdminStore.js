import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(
  persist(
    (set, get) => ({
      logined: false,
      login() {
        set((store) => ({
          // ...store,
          logined: true,
        }))
      },
      logout() {
        set((store) => ({
          logined: false,
          competition_id: null,
          apiKey: null,
          name: null
        }))
      },
      competition_id: null,
      setCompetitionId: (id) => set({ competition_id: id }),
      apiKey: null,
      setAPIKey: (newAPIKey) => set({ apiKey: newAPIKey }),
      name: null,
      setName: (newName) => set({ name: newName }),
    }),
    {
      name: 'admin-storage',
      getStorage: () => sessionStorage
    }
  )
);