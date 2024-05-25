import create from 'zustand';

export const usePopupStore = create((set, get) => ({
  visible: false,
  config: null,
  open(config) {
    set((store) => ({
      ...store,
      visible: true,
      config,
    }))
  },
  close() {
    const beforeClose = get().config?.beforeClose;
    const afterClose = get().config?.afterClose;
    const clear = get().clear;
    
    if (beforeClose) {
      beforeClose?.(clear);
    } else {
      clear();
    }

    afterClose?.();
  },
  clear() {
    set(store => ({
      ...store,
      visible: false,
      config: null
    }));
  },
  // overrideConfig(override) {
  //   set(store => ({
  //     ...store,
  //     config: {
  //       ...store.config,
  //       ...override,
  //     }
  //   }));
  // }
}));