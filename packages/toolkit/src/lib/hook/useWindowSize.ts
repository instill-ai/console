import { Nullable } from "../type";
import * as React from "react";

export type WindowSize = {
  width: number;
  height: number;
};

export function useWindowSize(): Nullable<WindowSize> {
  const [windowSize, setWindowSize] =
    React.useState<Nullable<WindowSize>>(null);

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

  React.useEffect(() => {
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
}
