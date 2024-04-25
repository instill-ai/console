"use client";

import * as React from "react";

import { Toaster, useToast } from "@instill-ai/design-system";
import { AmplitudeProvider } from "./amplitude-client-provider";
import { ReactQueryProvider } from "./react-query-client-provider";
import { usePathname } from "next/navigation";
import {
  InstillStore,
  Nullable,
  pathnameEvaluator,
  useCreateResourceFormStore,
  useInstillStore,
  useModalStore,
  useShallow,
} from "@instill-ai/toolkit";

const selector = (store: InstillStore) => ({
  initPipelineBuilder: store.initPipelineBuilder,
  initIteratorRelatedState: store.initIteratorRelatedState,
});

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] =
    React.useState<Nullable<string>>(null);

  const { initPipelineBuilder, initIteratorRelatedState } = useInstillStore(
    useShallow(selector)
  );

  const initCreateResourceFormStore = useCreateResourceFormStore(
    (store) => store.init
  );
  const closeModal = useModalStore((store) => store.closeModal);

  const { dismiss: dismissToast } = useToast();

  React.useEffect(() => {
    // When ever user leave /builder page to what ever destination
    // we need to re-init the iterator related state
    if (pathnameEvaluator.isPipelineBuilderPage(previousPathname)) {
      initIteratorRelatedState();
    }

    // Init when navigate out of builder page, except navigate into
    // overview page
    if (
      pathnameEvaluator.isPipelineBuilderPage(previousPathname) &&
      !pathnameEvaluator.isPipelineBuilderPage(pathname) &&
      !pathnameEvaluator.isPipelineOverviewPage(pathname)
    ) {
      initPipelineBuilder();
    }

    // Init when navigate out of overview page, except navigate into
    // builder page
    if (
      pathnameEvaluator.isPipelineOverviewPage(previousPathname) &&
      !pathnameEvaluator.isPipelineOverviewPage(pathname) &&
      !pathnameEvaluator.isPipelineBuilderPage(pathname)
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
