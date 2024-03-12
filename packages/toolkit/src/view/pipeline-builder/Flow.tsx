"use client";

import { useShallow } from "zustand/react/shallow";
import * as React from "react";
import { ReactFlowInstance } from "reactflow";

import { BackToLatestVersionTopBar, IteratorEditor } from "./components";

import { InstillStore, Nullable, useInstillStore } from "../../lib";
import { PipelineBuilderCanvas } from "./components/PipelineBuilderCanvas";

const selector = (store: InstillStore) => ({
  isEditingIterator: store.isEditingIterator,
});

export type FlowProps = {
  reactFlowInstance: Nullable<ReactFlowInstance>;
  setReactFlowInstance: React.Dispatch<
    React.SetStateAction<Nullable<ReactFlowInstance>>
  >;
  isLoading: boolean;
  isError: boolean;
};

export const Flow = React.forwardRef<HTMLDivElement, FlowProps>(
  (props, ref) => {
    const { reactFlowInstance, setReactFlowInstance, isLoading } = props;

    const { isEditingIterator } = useInstillStore(useShallow(selector));

    return (
      <div className="relative flex flex-1 flex-col">
        <BackToLatestVersionTopBar />
        <div className="relative flex h-full w-full flex-1">
          <div ref={ref} className="h-full w-full flex-1">
            {isEditingIterator ? (
              <IteratorEditor
                reactFlowInstance={reactFlowInstance}
                setReactFlowInstance={setReactFlowInstance}
              />
            ) : (
              <PipelineBuilderCanvas
                setReactFlowInstance={setReactFlowInstance}
              />
            )}
          </div>
          {isLoading ? (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-semantic-bg-secondary">
              <div className="flex h-20 w-20 rounded bg-semantic-bg-primary">
                <svg
                  className="m-auto h-6 w-6 animate-spin text-semantic-fg-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

Flow.displayName = "Flow";
