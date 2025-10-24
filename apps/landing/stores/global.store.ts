import { createStore } from "@/lib/zustand";

type InitialState = {
  isLoading: boolean | "instant";
};

export const useGlobalState = createStore({
  name: "global",
  persist: true,
  storage: "local",
  state: {
    isLoading: "instant",
  } as InitialState,
  actions: (set, get) => ({
    setIsLoading: (isLoading: boolean | "instant") =>
      set((data) => {
        data.state.isLoading = isLoading;
      }),
  }),
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
