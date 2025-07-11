"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import cn from "clsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useShallow } from "zustand/react/shallow";

import { Form, Icons, Tooltip } from "@instill-ai/design-system";

import { AutoresizeInputWrapper } from "../../../../../components";
import { InstillErrors } from "../../../../../constant";
import {
  InstillStore,
  toastInstillError,
  toastInstillSuccess,
  useInstillStore,
} from "../../../../../lib";
import { validateInstillResourceID } from "../../../../../server";
import {
  composeEdgesFromNodes,
  isGeneralNode,
  isIteratorNode,
} from "../../../lib";

const NodeIDEditorSchema = z.object({
  nodeID: z.string().nullable().optional(),
});

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
});

export const NodeIDEditor = ({ currentNodeID }: { currentNodeID: string }) => {
  const nodeIDInputRef = React.useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof NodeIDEditorSchema>>({
    resolver: zodResolver(NodeIDEditorSchema),
    mode: "onBlur",
    defaultValues: {
      nodeID: currentNodeID,
    },
  });

  const {
    nodes,
    updateEdges,
    updateNodes,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    updatePipelineRecipeIsDirty,
    pipelineIsReadOnly,
  } = useInstillStore(useShallow(selector));

  const { reset } = form;

  React.useEffect(() => {
    reset({
      nodeID: currentNodeID,
    });
  }, [currentNodeID, reset]);

  const handleSubmit = React.useCallback(
    function handleSubmit() {
      form.handleSubmit((formData) => {
        const newID = formData.nodeID;

        if (!newID || newID === "") {
          form.reset({
            nodeID: currentNodeID,
          });
          return;
        }

        if (newID) {
          if (newID === currentNodeID) {
            return;
          }

          if (!validateInstillResourceID(newID)) {
            toastInstillError({
              title: InstillErrors.ResourceIDInvalidError,
            });

            form.reset({
              nodeID: currentNodeID,
            });
            return;
          }

          const existingNodeID = nodes.map((node) => node.id);

          if (existingNodeID.includes(newID)) {
            toastInstillError({
              title: "Component ID already exists",
            });

            form.reset({
              nodeID: currentNodeID,
            });
            return;
          }

          const newNodes = nodes.map((node) => {
            if (node.id === currentNodeID) {
              if (isGeneralNode(node) || isIteratorNode(node)) {
                return {
                  ...node,
                  id: newID,
                  data: {
                    ...node.data,
                    id: newID,
                  },
                };
              }
            }
            return node;
          });
          const newEdges = composeEdgesFromNodes(newNodes);
          updateNodes(() => newNodes);
          updateEdges(() => newEdges);

          if (selectedConnectorNodeId === currentNodeID) {
            updateSelectedConnectorNodeId(() => newID);
          }

          toastInstillSuccess({
            title: "Successfully update node's name",
          });

          updatePipelineRecipeIsDirty(() => true);
        }
      })();
    },
    [
      currentNodeID,
      form,
      nodes,
      updateEdges,
      updateNodes,
      updatePipelineRecipeIsDirty,
      selectedConnectorNodeId,
      updateSelectedConnectorNodeId,
    ],
  );

  return (
    <div className="nodrag nowheel flex flex-row">
      <Form.Root {...form}>
        <form className="my-auto flex">
          <Form.Field
            control={form.control}
            name="nodeID"
            render={({ field }) => {
              const textStyle =
                "text-semantic-fg-secondary product-body-text-4-medium";

              return (
                <AutoresizeInputWrapper
                  value={field.value ?? ""}
                  className="h-8 min-w-[36px] max-w-[150px]"
                  placeholderClassname={cn(textStyle, "p-1")}
                >
                  <input
                    {...field}
                    className={cn(
                      "!absolute !bottom-0 !left-0 !right-0 !top-0 bg-transparent p-1 focus:!ring-1 focus:!ring-semantic-accent-default",
                      textStyle,
                    )}
                    ref={nodeIDInputRef}
                    value={field.value ?? ""}
                    type="text"
                    autoComplete="off"
                    disabled={pipelineIsReadOnly}
                    onBlur={() => handleSubmit()}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                      // Disable enter key to prevent default form submit behavior
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit();
                      }
                    }}
                  />
                </AutoresizeInputWrapper>
              );
            }}
          />
        </form>
      </Form.Root>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span className="flex" tabIndex={0}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nodeIDInputRef.current?.focus();
                }}
                type="button"
              >
                <Icons.Edit03 className="h-4 w-4 stroke-semantic-fg-primary" />
              </button>
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold"
            >
              Edit the component ID
              <Tooltip.Arrow
                className="fill-semantic-bg-primary"
                offset={10}
                width={9}
                height={6}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};
