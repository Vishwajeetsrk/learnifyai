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
    // Disable on small screens (mobile/tablet) instead of purely touch
    // This allows touch-enabled laptops to still see the cursor
    const checkTouch = () => {
      setIsTouchDevice(window.innerWidth <= 768);
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
