import { useMemo } from "react";

const useDeleteResourceGuard = () => {
  const disable = useMemo(() => {
    const hostname = new URL(window.location.href).hostname;

    if (hostname === "demo.instill.tech") {
      return true;
    }

    return false;
  }, [window.location.href]);

  return { disable };
};

export default useDeleteResourceGuard;
