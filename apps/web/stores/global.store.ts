import { createStore } from "@/lib/zustand";

type InitialState = {
  isLoading: boolean;
};

type Actions = {
  setIsLoading: (isLoading: boolean) => void;
};

type Func = (props: { state: number }) => void;

const func = (fu: Func) => {};

export const useGlobalState = createStore<InitialState, Actions>({
  name: "global",
  persist: true,
  storage: "local",
  state: {
    isLoading: false,
  },
  actions: (set, get) => ({
    setIsLoading: (isLoading: boolean) => {
      set((data) => {});
    },
  }),
});
