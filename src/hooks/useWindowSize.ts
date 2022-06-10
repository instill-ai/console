import { Nullable } from "@/types/general";
import { useState, useEffect } from "react";

export type WindowSize = {
  width: number;
  height: number;
};

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

const useWindowSize = (): Nullable<WindowSize> => {
  const [windowDimensions, setWindowDimensions] =
    useState<Nullable<WindowSize>>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setWindowDimensions(getWindowSize());
    const handleResize = () => {
      setWindowDimensions(getWindowSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getWindowSize]);

  return windowDimensions;
};

export default useWindowSize;
