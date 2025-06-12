import { SonnerToaster } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../lib";

const selector = (store: InstillStore) => ({
  leftSidebarOpen: store.leftSidebarOpen,
});

export const SonnerToasterWithPosition = () => {
  const { leftSidebarOpen } = useInstillStore(useShallow(selector));

  return (
    <SonnerToaster
      position="bottom-left"
      offset={{
        left: leftSidebarOpen
          ? "calc(var(--table-left-sidebar-width) + 16px)"
          : "32px",
      }}
    />
  );
};
