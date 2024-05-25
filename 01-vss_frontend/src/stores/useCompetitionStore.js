import create from 'zustand';
import { persist } from 'zustand/middleware';

const MENU_INFO_INDEX = 0;

const useCompetitionStore = create(
  persist(
    (set, get) => ({
      info: [{
        "competition_index": "",
        "event_category": "",
        "event_name": "",
        "place": "",
        "price": "",
        "recruit_start_date": "",
        "recruit_end_date": "",
        "event_start_time": "",
        "event_end_time": "",
        "body": "",
        "poster": "",
        "rulebook": ""
      }],
      changeInfo: (newInfo) => set({ info: newInfo }),
      menuIndex: MENU_INFO_INDEX,
      changeMenuIndex: (newMenuIndex) => set({menuIndex: newMenuIndex})
    }),
    {
      name: 'Competition Information', // unique name
      getStorage: () => sessionStorage // (optional) by default, 'localStorage' is used
    }
  )
  );

  export default useCompetitionStore;