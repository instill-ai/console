import { NextRouter } from "next/router";
import * as React from "react";

export type UseNavigationObserverProps = {
  router: NextRouter;
  shouldStopNavigation: boolean;
  onStopNavigate?: () => void;
  onNavigate?: () => void;
};

const errorMessage =
  "Route change abort due to unsaved changes, please ignore this error";

const rejectionHandler = (event: PromiseRejectionEvent) => {
  if (event.reason === errorMessage) {
    event.preventDefault();
  }
};

export function useNavigationObserver({
  router,
  shouldStopNavigation,
  onNavigate,
  onStopNavigate,
}: UseNavigationObserverProps) {
  const currentPath = router.asPath;
  const nextPath = React.useRef("");
  const navigationConfirmed = React.useRef(false);

  const killRouterEvent = React.useCallback(() => {
    router.events.emit("routeChangeError", "", "", { shallow: false });
    throw errorMessage;
  }, [router]);

  React.useEffect(() => {
    navigationConfirmed.current = false;

    const onRouteChange = (url: string) => {
      if (currentPath !== url && !shouldStopNavigation) {
        // if the user clicked on the browser back button then the url displayed in the browser gets incorrectly updated
        // This is needed to restore the correct url.
        // note: history.pushState does not trigger a page reload
        // window.history.pushState(null, "", router.basePath + currentPath);
        if (onNavigate) {
          onNavigate();
        }
      }

      if (
        shouldStopNavigation &&
        url !== currentPath &&
        !navigationConfirmed.current
      ) {
        // removing the basePath from the url as it will be added by the router
        nextPath.current = url.replace(router.basePath, "");

        if (onStopNavigate) {
          onStopNavigate();
        }

        killRouterEvent();
      }
    };

    router.events.on("routeChangeStart", onRouteChange);
    window.addEventListener("unhandledrejection", rejectionHandler);

    return () => {
      router.events.off("routeChangeStart", onRouteChange);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, [
    currentPath,
    killRouterEvent,
    onStopNavigate,
    router.basePath,
    router.events,
    shouldStopNavigation,
    onNavigate,
  ]);

  const confirmNavigation = () => {
    navigationConfirmed.current = true;
    router.push(nextPath.current);
  };

  return { confirmNavigation };
}
