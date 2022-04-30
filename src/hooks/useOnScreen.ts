/**
 * Solution idea from
 * https://stackoverflow.com/a/67826055
 */

import { useEffect, useState, useRef, RefObject } from "react";

export const useOnScreen = (ref: RefObject<HTMLElement>) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      setIsOnScreen(entry.isIntersecting)
    );
  }, []);

  useEffect(() => {
    if (!ref.current || !observerRef.current) return;
    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref]);

  return isOnScreen;
};
