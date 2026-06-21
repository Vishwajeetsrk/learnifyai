import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type CursorVariant = 
  | "default" 
  | "text" 
  | "button" 
  | "hidden" 
  | "magnetic" 
  | "grab" 
  | "grabbing" 
  | "loading"
  | "none"; // none means completely disabled (e.g. over monaco editor)

interface CursorContextType {
  variant: CursorVariant;
  setVariant: (variant: CursorVariant) => void;
  isTouchDevice: boolean;
  activeElement: HTMLElement | null;
  setActiveElement: (el: HTMLElement | null) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // More reliable touch detection - check for touch support AND small screen
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      // Only disable on actual touch-only devices (mobile/tablet), not touch-enabled laptops
      setIsTouchDevice(hasTouch && isSmallScreen);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  return (
    <CursorContext.Provider value={{ variant, setVariant, isTouchDevice, activeElement, setActiveElement }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
}
