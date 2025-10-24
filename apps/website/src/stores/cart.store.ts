import { createStore } from "@/lib/zustand";

type InitialState = {
  isOpen: boolean;
};

const state: InitialState = {
  isOpen: false,
};

export const useCartStore = createStore({
  name: "global",
  persist: true,
  storage: "local",
  state,
  actions: (set) => ({
    setOpenState: (isOpen: boolean) =>
      set((data) => {
        data.state.isOpen = isOpen;
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
