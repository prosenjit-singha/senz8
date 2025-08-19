import { create, StateCreator } from "zustand";
import {
  devtools,
  persist,
  createJSONStorage,
  PersistOptions,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type StoreOptions<T extends {}, A extends {}> = {
  name: string;
  persist?: boolean;
  storage?: "local" | "session";
  // initializer: (
  //   set: (state: { state: T; actions: A }) => void,
  //   get: () => { state: T; actions: A }
  // ) => {
  //   state: T;
  //   actions: A;
  // };
  state: T;
  actions: (
    set: (
      nextStateOrUpdater:
        | {
            state: T;
            actions: A;
          }
        | Partial<{
            state: T;
            actions: A;
          }>
        | ((state: { state: T; actions: A }) => void),
      shouldReplace?: false
    ) => void,
    get: () => { state: T; actions: A }
  ) => A;
};

export const createStore = <T extends {}, A extends {}>({
  name,
  persist: shouldPersist = false,
  storage = "local",
  state,
  actions,
}: StoreOptions<T, A>) => {
  type CombineState = { state: T; actions: A };

  // Apply persistence middleware
  if (shouldPersist) {
    const persistConfig: PersistOptions<CombineState> = {
      name,
      storage: createJSONStorage(() =>
        storage === "local" ? localStorage : sessionStorage
      ),
    };
    return create<{ state: T; actions: A }>()(
      devtools(
        persist(
          immer((set, get) => {
            return {
              state,
              actions: actions(set, get),
            };
          }),
          persistConfig
        ),
        { name }
      )
    );
  }

  return create<{ state: T; actions: A }>()(
    devtools(
      immer((set, get) => {
        return {
          state,
          actions: actions(set, get),
        };
      }),
      { name }
    )
  );
};
