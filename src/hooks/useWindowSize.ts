import { Nullable } from "@/types/general";
import { useState, useEffect } from "react";

export type WindowSize = {
  width: number;
  height: number;
};

export const useWindowSize = (): Nullable<WindowSize> => {
  const [windowSize, setWindowSize] = useState<Nullable<WindowSize>>(null);

  const getWindowSize = (): { width: number; height: number } => {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    return {
      width,
      height,
    };
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setWindowSize(getWindowSize());
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
