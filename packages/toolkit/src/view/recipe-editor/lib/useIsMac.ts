"use client";

import * as React from "react";

export function useIsMac() {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    setIsMac(navigator.userAgent.includes("Macintosh"));
  }, []);

  return isMac;
}
