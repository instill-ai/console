"use client";

import { useShallow } from "zustand/react/shallow";
import * as React from "react";
import { ReactFlowInstance } from "reactflow";

import {
  BackToLatestVersionTopBar,
  IteratorEditor,
  RemainingCreditCTA,
} from "./components";

import { InstillStore, Nullable, useInstillStore } from "../../lib";
import { PipelineBuilderCanvas } from "./components/PipelineBuilderCanvas";
import { env } from "../../server";
import { Button } from "@instill-ai/design-system";

const selector = (store: InstillStore) => ({
  isEditingIterator: store.isEditingIterator,
  updateLeftSidebarIsOpen: store.updateLeftSidebarIsOpen,
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

    const { isEditingIterator, updateLeftSidebarIsOpen } = useInstillStore(
      useShallow(selector)
    );

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
          {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <RemainingCreditCTA ctaTargetHref="/subscribe" />
            </div>
          ) : null}
          <Button
            onClick={() => {
              updateLeftSidebarIsOpen((prev) => !prev);
            }}
            className="!absolute !left-8 !top-8 !h-8 !w-8 !p-0"
            variant="tertiaryColour"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 11H12.5M17.5 15H12.5M17.5 7H12.5M9 3L9 21M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>
    );
  },
);

Flow.displayName = "Flow";
