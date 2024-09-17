"use client";

import * as React from "react";

export function useIsMac() {
  const isMac = React.useMemo(() => {
    console.log("navigator.userAgent", navigator.userAgent);
    return navigator.userAgent.includes("Macintosh");
  }, []);

  return isMac;
}
