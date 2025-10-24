import { createStore } from "@/lib/zustand";

type InitialState = {
  isNavMenuOpen: boolean;
};

const state: InitialState = {
  isNavMenuOpen: false,
};

export const useGlobalStore = createStore({
  name: "global",
  persist: true,
  storage: "local",
  state,
  actions: (set) => ({
    setIsNavMenuOpen: (isNavMenuOpen: boolean) =>
      set((data) => {
        data.state.isNavMenuOpen = isNavMenuOpen;
      }),
  }),
  partialize(state) {
    return {};
  },
});

/**
  Notes
  Debugging a Slices pattern based store
  addBear: () =>
    set(
      (state) => ({ bears: state.bears + 1 }),
      undefined,
      'jungle:bear/addBear',
    ),
 */
