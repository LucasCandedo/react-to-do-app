import { useEffect, useState } from "react";

export function useKeyboardOpen() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return;

    const handleResize = () => {
      setKeyboardOpen(viewport.height < window.innerHeight * 0.75);
    };

    viewport.addEventListener("resize", handleResize);

    return () => {
      viewport.removeEventListener("resize", handleResize);
    };
  }, []);

  return keyboardOpen;
}
