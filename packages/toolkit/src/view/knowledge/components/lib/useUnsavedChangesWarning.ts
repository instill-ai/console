import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useUnsavedChangesWarning = () => {
  const [showUnsavedChangesWarning, setShowUnsavedChangesWarning] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (showUnsavedChangesWarning) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleRouteChange = () => {
      if (showUnsavedChangesWarning) {
        if (
          window.confirm(
            "You have unsaved changes. Are you sure you want to leave?",
          )
        ) {
          setShowUnsavedChangesWarning(false);
        } else {
          router.events.emit("routeChangeError");
          throw "routeChange aborted.";
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [showUnsavedChangesWarning, router]);

  return { showUnsavedChangesWarning, setShowUnsavedChangesWarning };
};
