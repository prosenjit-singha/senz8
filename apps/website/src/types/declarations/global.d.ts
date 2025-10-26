// types/global.d.ts
import { LenisRef } from "lenis/react";

declare global {
  interface Window {
    lenisRef?: React.RefObject<LenisRef | null>;
  }
}

// Make it a module to avoid global scope issues
export {};
