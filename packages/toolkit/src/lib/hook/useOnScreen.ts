/**
 * Solution idea from
 * https://stackoverflow.com/a/67826055
 */

import * as React from "react";

export const useOnScreen = (ref: React.RefObject<HTMLElement>) => {
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const [isOnScreen, setIsOnScreen] = React.useState(false);

  React.useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      setIsOnScreen(entry.isIntersecting)
    );
  }, []);

  React.useEffect(() => {
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
