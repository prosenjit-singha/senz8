"use client";

import gsap from "gsap";
import { LenisRef, ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { cancelFrame, frame } from "motion";

const SmoothScrollProvider = ({
  children,
}: {
  children?: React.ReactNode | React.ReactNode[];
}) => {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function updateGSAP(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    function updateMotion(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(updateMotion, true);

    gsap.ticker.add(updateGSAP);

    return () => {
      gsap.ticker.remove(updateGSAP);
      cancelFrame(updateMotion);
    };
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollProvider;
