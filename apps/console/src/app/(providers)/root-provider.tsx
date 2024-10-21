"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Toaster, useToast } from "@instill-ai/design-system";
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
  updateFeatureFlagWebhookEnabled: store.updateFeatureFlagWebhookEnabled,
  updateFeatureFlagApplicationEnabled:
    store.updateFeatureFlagApplicationEnabled,
});

export const RootProvider = ({
  children,
  featureFlagWebhookEnabled,
  featureFlagApplicationEnabled,
}: {
  children: React.ReactNode;
  featureFlagWebhookEnabled: boolean;
  featureFlagApplicationEnabled: boolean;
}) => {
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] =
    React.useState<Nullable<string>>(null);

  const {
    initPipelineBuilder,
    updateFeatureFlagWebhookEnabled,
    updateFeatureFlagApplicationEnabled,
  } = useInstillStore(useShallow(selector));

  const initCreateResourceFormStore = useCreateResourceFormStore(
    (store) => store.init,
  );

  const closeModal = useModalStore((store) => store.closeModal);

  const { dismiss: dismissToast } = useToast();

  React.useEffect(() => {
    updateFeatureFlagWebhookEnabled(() => featureFlagWebhookEnabled);
  }, [featureFlagWebhookEnabled, updateFeatureFlagWebhookEnabled]);

  React.useEffect(() => {
    updateFeatureFlagApplicationEnabled(() => featureFlagApplicationEnabled);
  }, [featureFlagApplicationEnabled, updateFeatureFlagApplicationEnabled]);

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
    dismissToast();
    setPreviousPathname(pathname);
  }, [pathname]);

  return (
    <ReactQueryProvider>
      <AmplitudeProvider>
        {children}
        <Toaster
          additionalViewPortClassName={
            pathnameEvaluator.isPipelineBuilderPage(pathname)
              ? "!top-[var(--topbar-controller-height)]"
              : "!top-[calc(var(--topbar-controller-height)+var(--topbar-nav-height))]"
          }
        />
      </AmplitudeProvider>
    </ReactQueryProvider>
  );
};
