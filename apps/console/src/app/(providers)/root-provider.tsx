"use client";

import * as React from "react";
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

import { AmplitudeProvider } from "./amplitude-client-provider";
import { ReactQueryProvider } from "./react-query-client-provider";

const selector = (store: InstillStore) => ({
  initPipelineBuilder: store.initPipelineBuilder,
  updateFeatureFlagChatEnabled: store.updateFeatureFlagChatEnabled,
});

export const RootProvider = ({
  children,
  featureFlagChatEnabled,
}: {
  children: React.ReactNode;
  featureFlagChatEnabled: boolean;
}) => {
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] =
    React.useState<Nullable<string>>(null);

  const { initPipelineBuilder, updateFeatureFlagChatEnabled } = useInstillStore(
    useShallow(selector),
  );

  const initCreateResourceFormStore = useCreateResourceFormStore(
    (store) => store.init,
  );

  const closeModal = useModalStore((store) => store.closeModal);

  React.useEffect(() => {
    updateFeatureFlagChatEnabled(() => featureFlagChatEnabled);
  }, [featureFlagChatEnabled, updateFeatureFlagChatEnabled]);

  React.useEffect(() => {
    // When ever user leave /editor page to what ever destination
    // we need to re-init the pipeline editor
    if (pathnameEvaluator.isPipelineBuilderPage(previousPathname)) {
      initPipelineBuilder();
    }

    // Init when navigate out of overview page, except navigate into
    // editor page
    if (
      pathnameEvaluator.isPipelineOverviewPage(previousPathname) &&
      !pathnameEvaluator.isPipelineOverviewPage(pathname) &&
      !pathnameEvaluator.isPipelineBuilderPage(pathname)
    ) {
      initPipelineBuilder();
    }

    initCreateResourceFormStore();
    closeModal();
    setPreviousPathname(pathname);
  }, [pathname]);

  return (
    <ReactQueryProvider>
      <AmplitudeProvider>{children}</AmplitudeProvider>
    </ReactQueryProvider>
  );
};
