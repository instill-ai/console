import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { render } from "@testing-library/react";

/**
 * This function will create NextRouter mock object
 * 
 * @param router - Additional router info
 * @returns 
 */

export function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    back: jest.fn(),
    beforePopState: jest.fn(),

    // This one fixed Error: Uncaught [TypeError: Cannot read property 'catch' of undefined]
    // ref: https://github.com/vercel/next.js/issues/16864#issuecomment-734333738

    prefetch: jest.fn().mockResolvedValue(undefined),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    isPreview: false,
    ...router,
  };
}

/**
 *  This function will render desired ui component using testing-library render method. 
 * @param ui - desired rendered component
 * @param router - Additional router info
 * @returns 
 * 
 * - renderer - When testing component's changed, It's better to change the props by ourself, 
 * this function can be used to update props of the rendered component.
 * - others returned variables are documented in testing-library's documents.
 * - You can add whatever used context here to render it when testing.
 * @link https://testing-library.com/docs/react-testing-library/api/#render
 */

export function renderWithContext(
  ui: React.ReactElement,
  router: Partial<NextRouter>
) {
  const { rerender, ...result } = render(
    <RouterContext.Provider value={createMockRouter({ ...router })}>
      {ui}
    </RouterContext.Provider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <RouterContext.Provider value={createMockRouter({ ...router })}>
          {rerenderUi}
        </RouterContext.Provider>
      ),
  };
}
