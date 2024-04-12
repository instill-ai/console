"use client";

import * as React from "react";

import { Toaster, useToast } from "@instill-ai/design-system";
import { AmplitudeProvider } from "./amplitude-client-provider";
import { ReactQueryProvider } from "./react-query-client-provider";
import { usePathname } from "next/navigation";
import {
  Nullable,
  useCreateResourceFormStore,
  useInstillStore,
  useModalStore,
} from "@instill-ai/toolkit";

function isPipelineBuilderPage(path: Nullable<string>) {
  if (
    path &&
    path.split("/")[2] === "pipelines" &&
    path.split("/")[4] === "builder"
  ) {
    return true;
  }
  return false;
}

function isPipelineOverviewPage(path: Nullable<string>) {
  if (path && path.split("/")[2] === "pipelines" && path.split("/")[3]) {
    return true;
  }
  return false;
}

export const RootRender = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] =
    React.useState<Nullable<string>>(null);
  const initPipelineBuilder = useInstillStore(
    (store) => store.initPipelineBuilder
  );
  const initCreateResourceFormStore = useCreateResourceFormStore(
    (store) => store.init
  );
  const closeModal = useModalStore((store) => store.closeModal);

  const { dismiss: dismissToast } = useToast();

  React.useEffect(() => {
    console.log(pathname);

    // Init when navigate out of builder page, except navigate into
    // overview page
    if (
      isPipelineBuilderPage(previousPathname) &&
      !isPipelineBuilderPage(pathname) &&
      !isPipelineOverviewPage(pathname)
    ) {
      initPipelineBuilder();
    }

    // Init when navigate out of overview page, except navigate into
    // builder page
    if (
      isPipelineOverviewPage(previousPathname) &&
      !isPipelineOverviewPage(pathname) &&
      !isPipelineBuilderPage(pathname)
    ) {
      initPipelineBuilder();
    }

    initCreateResourceFormStore();
    closeModal();
    dismissToast();
    setPreviousPathname(pathname);
  }, [pathname]);

  return (
    <ReactQueryProvider>
      <AmplitudeProvider>
        {children}
        <Toaster additionalViewPortClassName="!top-[var(--topbar-height)]" />
      </AmplitudeProvider>
    </ReactQueryProvider>
  );
};
