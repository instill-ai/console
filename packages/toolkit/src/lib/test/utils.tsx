import * as React from "react";
import { render, RenderOptions } from "@testing-library/react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AmplitudeCtx } from "../amplitude";

export const queryCache = new QueryCache();
export const queryClient = new QueryClient({ queryCache });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AmplitudeCtx.Provider
      value={{ amplitudeIsInit: false, setAmplitudeIsInit: null }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AmplitudeCtx.Provider>
  );
};

export const customRender: (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => ReturnType<typeof render> = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) =>
  render(ui, { wrapper: AllTheProviders, ...options }) as ReturnType<
    typeof render
  >;

export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };
