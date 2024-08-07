import * as React from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";

import { AmplitudeCtx } from "../amplitude";

export const queryCache = new QueryCache();
export const queryClient = new QueryClient({ queryCache });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AmplitudeCtx.Provider
      value={{
        amplitudeIsInit: false,
        setAmplitudeIsInit: null,
        userBlockCookieUsage: false,
        setUserBlockCookieUsage: null,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AmplitudeCtx.Provider>
  );
};

export const customRender: (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => ReturnType<typeof render> = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) =>
  render(ui, { wrapper: AllTheProviders, ...options }) as ReturnType<
    typeof render
  >;

export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };

//
//
//

/**
 * react-testing-library has special rule for userevent.type/keyboard
 * We need to escape the { with {{
 * ref: https://testing-library.com/docs/user-event/keyboard
 * @param value Instill reference value like ${user.name}
 * @returns escaped value like ${{user.name}
 */
export const getEscapedReferenceValueForReactTestingLibrary = (
  value: string,
) => {
  return "${{" + value.replace("${", "").replace("}", "") + "}";
};
