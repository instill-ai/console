"use client";

import { Toaster } from "@instill-ai/design-system";
import { AmplitudeProvider } from "./amplitude-client-provider";
import { ReactQueryProvider } from "./react-query-client-provider";
import { ReactQueryDevtools } from "@instill-ai/toolkit";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AmplitudeProvider>
      <ReactQueryProvider>
        <main>{children}</main>
        <div id="modal-root" />
        <Toaster additionalViewPortClassName="!top-[var(--topbar-height)]" />
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>
    </AmplitudeProvider>
  );
};
