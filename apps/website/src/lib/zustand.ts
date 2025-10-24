import { create } from "zustand";
import {
  devtools,
  persist,
  createJSONStorage,
  PersistOptions,
  combine,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type NextStateOrUpdater<T> = (
  nextStateOrUpdater:
    | { state: T }
    | Partial<{ state: T }>
    | ((state: { state: T }) => void),
  shouldReplace?: false
) => void;

type StoreOptions<T, A> = {
  name: string;
  persist?: boolean;
  // default is local
  storage?: "local" | "session";
  state: T;
  enableDevTools?: boolean;
  actions: (set: NextStateOrUpdater<T>, get: () => { state: T }) => A;
  partialize?: (state: T) => Partial<T>;
};

const DEV_TOOLS = true;

export function createStore<T extends object, A extends object>(
  options: StoreOptions<T, A>
) {
  type Combine = { state: T; actions: A };
  const {
    name,
    persist: shouldPersist = false,
    storage = "local",
    state,
    enableDevTools = DEV_TOOLS,
  } = options;

  const immerCombine = immer<Combine>(
    combine({ state }, (set, get) => ({
      actions: options.actions(set as NextStateOrUpdater<T>, get),
    }))
  );

  if (shouldPersist) {
    const persistConfig: PersistOptions<Combine, Partial<T>> = {
      name,
      storage: createJSONStorage(() =>
        storage === "local" ? localStorage : sessionStorage
      ),
      merge: (persistedState, currentState) => {
        console.log({ persistedState, currentState });
        if (persistedState) {
          return {
            ...currentState,
            state: {
              ...currentState.state,
              ...persistedState,
            },
          };
        } else return currentState;
      },

      partialize: (s) =>
        options.partialize ? options.partialize(s.state) : s.state,
      // only persist state, not actions
    };

    const persistFun = persist(immerCombine, persistConfig);

    return create<Combine>()(
      devtools(persistFun, { name, enabled: enableDevTools })
    );
  }

  return create<Combine>()(
    devtools(immerCombine, { name, enabled: enableDevTools })
  );
}
