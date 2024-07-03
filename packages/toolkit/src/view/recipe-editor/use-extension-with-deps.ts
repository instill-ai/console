"use client";

/**
 * Ref: https://thetrevorharmon.com/blog/codemirror-and-react/
 */
import * as React from "react";
import { EditorView } from "@codemirror/view";
import { Compartment, Extension } from "@uiw/react-codemirror";

export function useExtensionWithDependency(
  view: EditorView | null,
  extensionFactory: () => Extension,

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  deps: any[],
) {
  const compartment = React.useMemo(() => new Compartment(), []);
  const extension = React.useMemo(
    () => compartment.of(extensionFactory()),
    deps,
  );

  React.useEffect(() => {
    if (view) {
      view.dispatch({
        effects: compartment.reconfigure(extensionFactory()),
      });
    }
  }, deps);

  return extension;
}
