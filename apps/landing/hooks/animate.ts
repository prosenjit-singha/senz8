"use client";
import { useState, useEffect } from "react";
import { animate, AnimationOptions } from "motion/react";

type UseFramerMotionOptions = {
  shouldAnimate?: boolean;
  animationConfig?: AnimationOptions;
};

export function useFramerMotion<T extends Record<string, number>>(
  targetValues: T,
  { shouldAnimate = true, animationConfig }: UseFramerMotionOptions = {}
): T {
  const [values, setValues] = useState<T>({ ...targetValues });

  useEffect(() => {
    if (!shouldAnimate) {
      // Directly update without animation
      setValues({ ...targetValues });
      return;
    }

    // Animate each property individually
    const controls = Object.keys(targetValues).map((key) => {
      const k = key as keyof T;
      return animate(values[k], targetValues[k], {
        ...animationConfig,
        onUpdate: (v) => {
          setValues((prev) => ({ ...prev, [k]: v }));
        },
      });
    });

    // Cleanup in case props change mid-animation
    return () => controls.forEach((c) => c.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValues, shouldAnimate, JSON.stringify(animationConfig)]);

  return values;
}
