import * as React from "react";

export async function isNoContent(
  url: string,
  signal?: AbortSignal,
): Promise<boolean> {
  const response = await fetch(url, { method: "GET", signal });
  return response.status === 204;
}

export function useCheckNoContent(
  src: string | null | undefined,
): (signal?: AbortSignal) => Promise<boolean> {
  const abortControllerRef = React.useRef<AbortController | null>(null);

  return React.useCallback(
    async (signal?: AbortSignal) => {
      // Abort any previous request when src changes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!src) return false;

      // Create new controller for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Use provided signal or the created controller's signal
      const effectiveSignal = signal || controller.signal;

      try {
        return await isNoContent(src, effectiveSignal);
      } catch {
        return false;
      }
    },
    [src],
  );
}
