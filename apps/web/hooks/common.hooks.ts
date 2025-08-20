import React from "react";

export function useMergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return React.useCallback(
    (value: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = value;
        }
      });
    },
    [refs]
  );
}
