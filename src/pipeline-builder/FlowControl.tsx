import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";
import { v4 as uuidv4 } from "uuid";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { Button, Icons, useToast } from "@instill-ai/design-system";
import {
  CreatePipelinePayload,
  ImageWithFallback,
  Nullable,
  UpdatePipelinePayload,
  getInstillApiErrorMessage,
  useActivatePipeline,
  useConnectorDefinitions,
  useConnectorResources,
  useCreatePipeline,
  useDeActivatePipeline,
  usePipeline,
  useRenamePipeline,
  useUpdatePipeline,
  useWatchPipeline,
} from "@instill-ai/toolkit";
import { constructPipelineRecipe } from "./constructPipelineRecipe";
import { useState } from "react";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { SelectConnectorResourceDialog } from "./SelectConnectorResourceDialog";
import { Position, ReactFlowInstance } from "reactflow";
import { PipelineConnectorComponent } from "./type";
import { getBlockchainConnectorDefaultConfiguration } from "./getBlockchainConnectorDefaultConfiguration";
import { getAiConnectorDefaultConfiguration } from "./getAiConnectorDefaultConfiguration";
import { createGraphLayout } from "./createGraphLayout";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  pipelineId: state.pipelineId,
  pipelineDescription: state.pipelineDescription,
  setPipelineUid: state.setPipelineUid,
  pipelineRecipeIsDirty: state.pipelineRecipeIsDirty,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  updatePipelineIsNew: state.updatePipelineIsNew,
  pipelineIsNew: state.pipelineIsNew,
  selectResourceDialogIsOpen: state.selectResourceDialogIsOpen,
  updateSelectResourceDialogIsOpen: state.updateSelectResourceDialogIsOpen,
});

export type FlowControlProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
  reactFlowInstance: Nullable<ReactFlowInstance>;
};

/**
 * FlowControl is a component that handles the crucial action of pipeline like
 * - Save pipeline
 * - Activate pipeline
 * - Deactivate pipeline
 */

export const FlowControl = (props: FlowControlProps) => {
  const { accessToken, enableQuery, reactFlowInstance } = props;
  const router = useRouter();
  const {
    nodes,
    edges,
    pipelineId,
    pipelineDescription,
    setPipelineUid,
    updateNodes,
    updateEdges,
    pipelineRecipeIsDirty,
    updatePipelineRecipeIsDirty,
    updatePipelineIsNew,
    pipelineIsNew,
    selectResourceDialogIsOpen,
    updateSelectResourceDialogIsOpen,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const { toast } = useToast();
  const { id } = router.query;

  const aiDefinitions = useConnectorDefinitions({
    connectorResourceType: "CONNECTOR_TYPE_AI",
    accessToken: null,
    enabled: true,
  });

  const allConnectorResource = useConnectorResources({
    connectorResourceType: null,
    enabled: true,
    accessToken: null,
  });

  const blockchainDefinitions = useConnectorDefinitions({
    connectorResourceType: "CONNECTOR_TYPE_BLOCKCHAIN",
    accessToken: null,
    enabled: true,
  });

  const dataDefinitions = useConnectorDefinitions({
    connectorResourceType: "CONNECTOR_TYPE_DATA",
    accessToken: null,
    enabled: true,
  });

  const pipeline = usePipeline({
    pipelineName: `pipelines/${id}`,
    accessToken,
    enabled: !!id && enableQuery && !pipelineIsNew,
  });

  const pipelineWatchState = useWatchPipeline({
    pipelineName: `pipelines/${id}`,
    accessToken,
    enabled: !!id && !pipelineIsNew && pipeline.isSuccess && enableQuery,
  });

  const updatePipeline = useUpdatePipeline();
  const createPipeline = useCreatePipeline();
  const activatePipeline = useActivatePipeline();
  const deactivatePipeline = useDeActivatePipeline();
  const renamePipeline = useRenamePipeline();

  const [isHandlingConnection, setIsHandlingConnection] = useState(false);

  async function handleTogglePipeline() {
    if (!pipeline.isSuccess || !pipelineWatchState.isSuccess) return;

    setIsHandlingConnection(true);

    if (
      pipelineWatchState.data.state === "STATE_ACTIVE" ||
      pipelineWatchState.data.state === "STATE_ERROR"
    ) {
      try {
        await deactivatePipeline.mutateAsync({
          pipelineName: `pipelines/${pipelineId}`,
          accessToken,
        });

        toast({
          title: "Successfully deativated the pipeline",
          variant: "alert-success",
          size: "small",
        });
        setIsHandlingConnection(false);

        updateEdges((edges) => {
          return edges.map((edge) => ({
            ...edge,
            animated: false,
          }));
        });

        // When user deactivate the pipeline we help them update the pipeline recipe
        if (pipelineRecipeIsDirty) {
          await handleSavePipeline();
        }
      } catch (error) {
        setIsHandlingConnection(false);
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when deactivated the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when deactivated the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
      }
    } else {
      // If the user changed the pipeline's name we need to update the
      // pipeline's name first

      if (pipelineId !== pipeline.data.id) {
        await handleRenamePipeline();
      }

      try {
        // If the user had changed the recipe, we will first save the pipeline
        // then activate the pipeline.

        if (pipelineRecipeIsDirty) {
          await handleSavePipeline();
        }

        await activatePipeline.mutateAsync({
          pipelineName: `pipelines/${pipelineId}`,
          accessToken,
        });

        toast({
          title: "Successfully activated the pipeline",
          variant: "alert-success",
          size: "small",
        });
        setIsHandlingConnection(false);

        updateEdges((edges) => {
          return edges.map((edge) => ({
            ...edge,
            animated: true,
          }));
        });
      } catch (error) {
        setIsHandlingConnection(false);
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when activated the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when activated the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
      }
    }
  }

  const [isSaving, setIsSaving] = useState(false);

  async function handleSavePipeline() {
    if (!pipelineId) {
      toast({
        title: "Pipeline ID not set",
        description:
          "The pipeline ID should be set before saving the pipeline.",
        variant: "alert-error",
        size: "large",
      });
      return;
    }

    setIsSaving(true);

    if (pipeline.isSuccess) {
      // We need to rename the pipeline if the user changed the pipeline's name
      if (pipelineId !== pipeline.data.id) {
        await handleRenamePipeline();
      }

      const payload: UpdatePipelinePayload = {
        name: `pipelines/${pipelineId}`,
        description: pipelineDescription ?? undefined,
        // recipe: constructPipelineRecipe(nodes, edges),
      };

      try {
        await updatePipeline.mutateAsync({
          payload,
          accessToken,
        });
        toast({
          title: "Pipeline is saved",
          variant: "alert-success",
          size: "small",
        });
        updatePipelineRecipeIsDirty(() => false);
      } catch (error) {
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when save the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when save the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
      }
      setIsSaving(false);
      return;
    }

    // If the user haven't created the pipeline yet, we will create the pipeline

    const payload: CreatePipelinePayload = {
      id: pipelineId,
      description: pipelineDescription ?? undefined,
      recipe: constructPipelineRecipe(nodes, edges),
    };

    try {
      const res = await createPipeline.mutateAsync({
        payload,
        accessToken,
      });

      setPipelineUid(res.pipeline.uid);

      router.push(`/pipelines/${pipelineId}`, undefined, {
        shallow: true,
      });

      updatePipelineIsNew(() => false);

      toast({
        title: "Successfully created the pipeline",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Something went wrong when save the pipeline",
          description: getInstillApiErrorMessage(error),
          variant: "alert-error",
          size: "large",
        });
      } else {
        toast({
          title: "Something went wrong when save the pipeline",
          variant: "alert-error",
          size: "large",
        });
      }
    }

    setIsSaving(false);
  }

  async function handleRenamePipeline() {
    if (!pipelineId || !pipeline.isSuccess) {
      return;
    }

    try {
      await renamePipeline.mutateAsync({
        payload: {
          pipelineId: pipeline.data.id,
          newPipelineId: pipelineId,
        },
        accessToken,
      });

      router.push(`/pipelines/${pipelineId}`, undefined, {
        shallow: true,
      });

      toast({
        title: "Sussessfully renamed the pipeline",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Something went wrong when rename the pipeline",
          description: getInstillApiErrorMessage(error),
          variant: "alert-error",
          size: "large",
        });
      } else {
        toast({
          title: "Something went wrong when rename the pipeline",
          variant: "alert-error",
          description: "Please try again later",
          size: "large",
        });
      }
    }
  }

  return (
    <>
      <div className="absolute right-8 top-8 flex flex-row-reverse gap-x-4">
        <Button
          onClick={handleTogglePipeline}
          className="gap-x-2"
          variant="primary"
          size="lg"
          disabled={
            pipeline.isSuccess && pipelineWatchState.isSuccess ? false : true
          }
        >
          {pipelineWatchState.isSuccess ? (
            pipelineWatchState.data.state === "STATE_ACTIVE" ||
            pipelineWatchState.data.state === "STATE_ERROR" ? (
              <>
                <span>Unpublish</span>
                {isHandlingConnection ? (
                  <svg
                    className="m-auto h-4 w-4 animate-spin text-white"
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
                ) : (
                  <Icons.Stop className="h-4 w-4 fill-semantic-fg-on-default stroke-semantic-fg-on-default group-disabled:fill-semantic-fg-disabled group-disabled:stroke-semantic-fg-disabled" />
                )}
              </>
            ) : (
              <>
                <span>Publish</span>
                {isHandlingConnection ? (
                  <svg
                    className="m-auto h-4 w-4 animate-spin text-white"
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
                ) : (
                  <Icons.Play className="h-4 w-4 fill-semantic-fg-on-default stroke-semantic-fg-on-default group-disabled:fill-semantic-fg-disabled group-disabled:stroke-semantic-fg-disabled" />
                )}
              </>
            )
          ) : (
            "Disabled"
          )}
        </Button>
        <Button
          onClick={handleSavePipeline}
          className="gap-x-2"
          variant="secondaryGrey"
          size="lg"
        >
          Save
          {isSaving ? (
            <svg
              className="m-auto h-4 w-4 animate-spin text-semantic-fg-secondary"
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
          ) : (
            <Icons.Save01 className="h-5 w-5 stroke-semantic-fg-primary" />
          )}
        </Button>
      </div>
      <div className="absolute left-8 top-8 flex flex-row gap-x-4">
        <SelectConnectorResourceDialog
          open={selectResourceDialogIsOpen}
          onOpenChange={(open) => updateSelectResourceDialogIsOpen(() => open)}
        >
          <div className="flex flex-col">
            <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
              <p className="mx-auto product-body-text-1-semibold">
                Existing Resource
              </p>
            </div>
            <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-5">
              {allConnectorResource.isSuccess
                ? allConnectorResource.data.map((connectorResource) => (
                    <SelectConnectorResourceDialog.Item
                      key={connectorResource.id}
                      onClick={() => {
                        if (!reactFlowInstance) return;

                        const viewport = reactFlowInstance.getViewport();

                        const randomName = uniqueNamesGenerator({
                          dictionaries: [adjectives, colors, animals],
                          separator: "-",
                        });

                        let componentType: Nullable<
                          PipelineConnectorComponent["type"]
                        > = null;

                        let configuration: Nullable<Record<string, any>> = null;

                        // Remove the empty node and edges that connect to empty node if it exists
                        const emptyNode = nodes.find(
                          (e) => e.data.nodeType === "empty"
                        );

                        const newNodes = emptyNode
                          ? nodes.filter((e) => e.data.nodeType !== "empty")
                          : nodes;

                        const newEdges = emptyNode
                          ? edges.filter((e) => {
                              if (
                                e.source === emptyNode.id ||
                                e.target === emptyNode.id
                              ) {
                                return false;
                              }
                              return true;
                            })
                          : edges;

                        switch (connectorResource.connector_type) {
                          case "CONNECTOR_TYPE_AI":
                            componentType = "COMPONENT_TYPE_CONNECTOR_AI";
                            configuration = getAiConnectorDefaultConfiguration(
                              connectorResource.connector_definition_name
                            );
                            break;
                          case "CONNECTOR_TYPE_BLOCKCHAIN":
                            componentType =
                              "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN";
                            configuration =
                              getBlockchainConnectorDefaultConfiguration(
                                connectorResource.connector_definition_name
                              );
                            break;
                          case "CONNECTOR_TYPE_DATA":
                            componentType = "COMPONENT_TYPE_CONNECTOR_DATA";
                            break;
                          case "CONNECTOR_TYPE_OPERATOR":
                            componentType = "COMPONENT_TYPE_OPERATOR";
                            break;
                        }

                        if (!componentType) return;

                        newNodes.push({
                          id: randomName,
                          type: "connectorNode",
                          sourcePosition: Position.Left,
                          targetPosition: Position.Right,
                          data: {
                            nodeType: "connector",
                            component: {
                              id: randomName,
                              resource_name: connectorResource.name,
                              resource_detail: {
                                ...connectorResource,
                                connector_definition: null,
                              },
                              definition_name:
                                connectorResource.connector_definition.name,
                              configuration: configuration ? configuration : {},
                              type: componentType,
                              definition_detail:
                                connectorResource.connector_definition,
                            },
                          },
                          position: reactFlowInstance.project({
                            x: viewport.x,
                            y: viewport.y,
                          }),
                        });

                        newEdges.push(
                          ...[
                            {
                              id: uuidv4(),
                              source: "start",
                              target: randomName,
                              type: "customEdge",
                            },
                            {
                              id: uuidv4(),
                              source: randomName,
                              target: "end",
                              type: "customEdge",
                            },
                          ]
                        );

                        createGraphLayout(newNodes, newEdges)
                          .then((graphData) => {
                            updateNodes(() => graphData.nodes);
                            updateEdges(() => graphData.edges);
                            updateSelectResourceDialogIsOpen(() => false);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    >
                      <ImageWithFallback
                        src={`/icons/${connectorResource.connector_definition.vendor}/${connectorResource.connector_definition.icon}`}
                        width={32}
                        height={32}
                        alt={`${connectorResource.connector_definition.title}-icon`}
                        fallbackImg={
                          <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                        }
                      />
                      <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                        {connectorResource.id}
                      </p>
                    </SelectConnectorResourceDialog.Item>
                  ))
                : null}
            </div>
            <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
              <p className="mx-auto product-body-text-1-semibold">
                New Resource
              </p>
            </div>
            <div className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
              AI
            </div>
            <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-5">
              {aiDefinitions.isSuccess
                ? aiDefinitions.data.map((definition) => (
                    <SelectConnectorResourceDialog.Item key={definition.id}>
                      <ImageWithFallback
                        src={`/icons/${definition.vendor}/${definition.icon}`}
                        width={32}
                        height={32}
                        alt={`${definition.title}-icon`}
                        fallbackImg={
                          <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                        }
                      />
                      <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                        {definition.title}
                      </p>
                    </SelectConnectorResourceDialog.Item>
                  ))
                : null}
            </div>
            <div className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
              Blockchain
            </div>
            <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-5">
              {blockchainDefinitions.isSuccess
                ? blockchainDefinitions.data.map((definition) => (
                    <SelectConnectorResourceDialog.Item key={definition.id}>
                      <ImageWithFallback
                        src={`/icons/${definition.vendor}/${definition.icon}`}
                        width={32}
                        height={32}
                        alt={`${definition.title}-icon`}
                        fallbackImg={
                          <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                        }
                      />
                      <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                        {definition.title}
                      </p>
                    </SelectConnectorResourceDialog.Item>
                  ))
                : null}
            </div>
            <div className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
              Data
            </div>
            <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-5">
              {dataDefinitions.isSuccess
                ? dataDefinitions.data.map((definition) => (
                    <SelectConnectorResourceDialog.Item key={definition.id}>
                      <ImageWithFallback
                        src={`/icons/${definition.vendor}/${definition.icon}`}
                        width={32}
                        height={32}
                        alt={`${definition.title}-icon`}
                        fallbackImg={
                          <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                        }
                      />
                      <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                        {definition.title}
                      </p>
                    </SelectConnectorResourceDialog.Item>
                  ))
                : null}
            </div>
          </div>
        </SelectConnectorResourceDialog>
      </div>
    </>
  );
};
