import * as React from "react";
import { Nullable } from "../type";

export type RefSize = {
  width: number;
  height: number;
};

export function useRefSize(
  ref: React.RefObject<HTMLElement>
): Nullable<RefSize> {
  const [refSize, setRefSize] = React.useState<Nullable<RefSize>>(null);
  const observerRef = React.useRef<ResizeObserver | null>(null);

  React.useEffect(() => {
    observerRef.current = new ResizeObserver((entries) => {
      setRefSize({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      });
    });

    if (!ref.current) return;

    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref]);

  return refSize;
}
