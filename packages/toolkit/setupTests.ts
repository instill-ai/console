import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

/**
 * JSDOM doesn't implement scrollIntoView, releasePointerCapture, hasPointerCapture
 * so we need to mock our own implementation
 * https://github.com/radix-ui/primitives/issues/1822
 * https://github.com/jsdom/jsdom/pull/2666
 * https://github.com/joaom00/radix-select-vitest/blob/main/src/Select.test.tsx
 */
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

afterEach(() => {
  cleanup();
});
