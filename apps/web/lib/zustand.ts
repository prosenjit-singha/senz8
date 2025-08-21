import { create } from "zustand";
import {
  devtools,
  persist,
  createJSONStorage,
  PersistOptions,
  combine,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type StoreOptions<T, A> = {
  name: string;
  persist?: boolean;
  // default is local
  storage?: "local" | "session";
  state: T;
  enableDevTools?: boolean;
  actions: (
    set: (
      nextStateOrUpdater:
        | { state: T }
        | Partial<{ state: T }>
        | ((state: { state: T }) => void),
      shouldReplace?: false
    ) => void,
    get: () => { state: T }
  ) => A;
};

const DEV_TOOLS = true;

export function createStore<T extends {}, A extends {}>(
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

  const immerCombine = immer(
    // @ts-ignore
    combine({ state }, (set, get) => ({
      actions: options.actions(set as any, get),
    }))
  );

  if (shouldPersist) {
    const persistConfig: PersistOptions<Combine, { state: T }> = {
      name,
      storage: createJSONStorage(() =>
        storage === "local" ? localStorage : sessionStorage
      ),
      partialize: (s) => ({ state: s.state }), // only persist state, not actions
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
