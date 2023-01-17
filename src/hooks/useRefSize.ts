import { Nullable } from "@/types/general";
import { RefObject, useEffect, useRef, useState } from "react";

export type RefSize = {
  width: number;
  height: number;
};

export const useRefSize = (ref: RefObject<HTMLElement>): Nullable<RefSize> => {
  const [refSize, setRefSize] = useState<Nullable<RefSize>>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
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
};
