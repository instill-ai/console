import { useEffect, useState } from "react";

const useDeleteResourceGuard = () => {
  const [disableResourceDeletion, setDisableResourceDeletion] = useState(false);

  useEffect(() => {
    const hostname = new URL(window.location.href).hostname;

    if (hostname === "demo.instill.tech") {
      setDisableResourceDeletion(true);
      return;
    }

    setDisableResourceDeletion(false);
  }, []);

  return { disableResourceDeletion };
};

export default useDeleteResourceGuard;
