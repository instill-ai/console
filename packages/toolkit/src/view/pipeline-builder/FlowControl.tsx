import * as React from "react";
import { isAxiosError } from "axios";
import { Node, Position, ReactFlowInstance } from "reactflow";
import { useRouter } from "next/router";
import { Button, Icons, useToast } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import {
  constructPipelineRecipe,
  getBlockchainConnectorDefaultConfiguration,
  getAiConnectorDefaultConfiguration,
  generateNewNodeIdx,
  composePipelineMetadataFromNodes,
} from "./lib";
import {
  ReleasePipelineModal,
  PipelineToolkitModal,
  SelectConnectorResourceDialog,
  CreateResourceDialog,
} from "./components";
import { triggerPipelineSnippets } from "./components/triggerPipelineSnippets";
import {
  ConnectorDefinition,
  ConnectorResourceWithDefinition,
  CreateUserPipelinePayload,
  GeneralRecord,
  InstillAppEnv,
  InstillStore,
  Nullable,
  PipelineConnectorComponent,
  UpdateUserPipelinePayload,
  env,
  generateRandomReadableName,
  getInstillApiErrorMessage,
  useCreateUserPipeline,
  useInstillStore,
  useUpdateUserPipeline,
  useUser,
} from "../../lib";
import { StartNodeData } from "./type";
import { SharePipelineDialog } from "./components/SharePipelineDialog";
import { LoadingSpin } from "../../components";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  edges: store.edges,
  pipelineId: store.pipelineId,
  pipelineDescription: store.pipelineDescription,
  setPipelineUid: store.setPipelineUid,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineIsNew: store.updatePipelineIsNew,
  pipelineIsNew: store.pipelineIsNew,
  selectResourceDialogIsOpen: store.selectResourceDialogIsOpen,
  updateSelectResourceDialogIsOpen: store.updateSelectResourceDialogIsOpen,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  testModeEnabled: store.testModeEnabled,
  updateTestModeEnabled: store.updateTestModeEnabled,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

export type FlowControlProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
  reactFlowInstance: Nullable<ReactFlowInstance>;
  appEnv: InstillAppEnv;
};

export const FlowControl = (props: FlowControlProps) => {
  const { accessToken, enableQuery, reactFlowInstance, appEnv } = props;
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
    testModeEnabled,
    updateTestModeEnabled,
    updateSelectedConnectorNodeId,
    isOwner,
    currentVersion,
  } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { entity } = router.query;

  const { toast } = useToast();

  const user = useUser({
    enabled: enableQuery,
    accessToken,
  });

  const createUserPipeline = useCreateUserPipeline();
  const updateUserPipeline = useUpdateUserPipeline();

  const [isSaving, setIsSaving] = React.useState(false);
  const [isCloning, setIsCloning] = React.useState(false);

  async function handleSavePipeline() {
    if (!pipelineId) {
      return;
    }

    setIsSaving(true);

    if (!pipelineIsNew && pipelineRecipeIsDirty) {
      const payload: UpdateUserPipelinePayload = {
        name: `users/${entity}/pipelines/${pipelineId}`,
        description: pipelineDescription ?? undefined,
        recipe: constructPipelineRecipe(nodes),
        metadata: composePipelineMetadataFromNodes(nodes),
      };

      try {
        updateUserPipeline.mutateAsync({
          payload,
          accessToken,
        });

        toast({
          title: "Pipeline is saved",
          variant: "alert-success",
          size: "small",
        });

        updatePipelineRecipeIsDirty(() => false);
        updateSelectResourceDialogIsOpen(() => false);
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

    const payload: CreateUserPipelinePayload = {
      id: pipelineId,
      description: pipelineDescription ?? undefined,
      recipe: constructPipelineRecipe(nodes),
      metadata: composePipelineMetadataFromNodes(nodes),
    };

    try {
      const res = await createUserPipeline.mutateAsync({
        userName: `users/${entity}`,
        payload,
        accessToken,
      });

      setPipelineUid(res.pipeline.uid);
      updatePipelineRecipeIsDirty(() => false);
      updatePipelineIsNew(() => false);

      toast({
        title: "Successfully saved the pipeline",
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

  const codeSnippte = React.useMemo(() => {
    const input: GeneralRecord = {};

    const startNode = nodes.find(
      (e) => e.data.nodeType === "start"
    ) as Node<StartNodeData>;

    if (!startNode || !startNode.data.component.configuration.metadata) {
      return "";
    }

    for (const [key, metadata] of Object.entries(
      startNode.data.component.configuration.metadata
    )) {
      switch (metadata.instillFormat) {
        case "string": {
          input[key] = "Please put your value here";
          break;
        }
        case "array:string": {
          input[key] = [
            "Please put your first value here",
            "Please put your second value here",
            "...",
          ];
          break;
        }
        case "number": {
          input[key] = 123456;
          break;
        }
        case "array:number": {
          input[key] = [123456, 654321];
          break;
        }
        case "image": {
          input[key] = "your image base64 encoded string";
          break;
        }
        case "array:image/*": {
          input[key] = [
            "Please put your first image base64 encoded string",
            "Please put your second image base64 encoded string",
            "...",
          ];
          break;
        }
        case "audio": {
          input[key] = "Please put your audio base64 encoded string";
          break;
        }
        case "array:audio/*": {
          input[key] = [
            "Please put your first audio base64 encoded string",
            "Please put your second audio base64 encoded string",
            "...",
          ];
          break;
        }
        case "boolean": {
          input[key] = true;
          break;
        }
        case "array:boolean": {
          input[key] = [true, false];
          break;
        }
      }
    }

    const inputsString = JSON.stringify({ inputs: [input] }, null, "\t");

    let snippet =
      appEnv === "APP_ENV_CLOUD"
        ? triggerPipelineSnippets.cloud
        : triggerPipelineSnippets.core;

    const triggerEndpoint =
      currentVersion === "latest"
        ? "trigger"
        : `releases/${currentVersion}/trigger`;

    snippet = snippet
      .replace(/\{vdp-pipeline-base-url\}/g, env("NEXT_PUBLIC_API_GATEWAY_URL"))
      .replace(/\{pipeline-name\}/g, `users/${entity}/pipelines/${pipelineId}`)
      .replace(/\{input-array\}/g, inputsString)
      .replace(/\{trigger-endpoint\}/g, triggerEndpoint);

    return snippet;
  }, [nodes, pipelineId, appEnv, entity, currentVersion]);

  const canSave = React.useMemo(() => {
    if (!pipelineRecipeIsDirty) {
      return false;
    }

    if (currentVersion !== "latest") {
      return false;
    }

    return true;
  }, [currentVersion, pipelineRecipeIsDirty]);

  function constructNode(
    resource: ConnectorResourceWithDefinition | ConnectorDefinition
  ) {
    if (!reactFlowInstance) return;

    const viewport = reactFlowInstance.getViewport();
    let componentType: Nullable<PipelineConnectorComponent["type"]> = null;

    // Remove the empty node and edges that connect to empty node if it exists
    const emptyNode = nodes.find((e) => e.data.nodeType === "empty");

    let newNodes = emptyNode
      ? nodes.filter((e) => e.data.nodeType !== "empty")
      : nodes;

    const newEdges = emptyNode
      ? edges.filter((e) => {
          if (e.source === emptyNode.id || e.target === emptyNode.id) {
            return false;
          }
          return true;
        })
      : edges;

    let nodePrefix: Nullable<string> = null;
    let nodeIndex = 0;
    let configuration: Nullable<GeneralRecord> = null;

    switch (resource.type) {
      case "CONNECTOR_TYPE_AI": {
        nodePrefix = "ai";
        nodeIndex = generateNewNodeIdx(
          nodes
            .filter(
              (e) => e.data.component?.type === "COMPONENT_TYPE_CONNECTOR_AI"
            )
            .map((e) => e.id),
          "ai"
        );
        configuration =
          "configuration" in resource
            ? getAiConnectorDefaultConfiguration(
                resource.connector_definition_name
              )
            : getAiConnectorDefaultConfiguration(resource.name);
        componentType = "COMPONENT_TYPE_CONNECTOR_AI";
        break;
      }
      case "CONNECTOR_TYPE_BLOCKCHAIN": {
        nodePrefix = "blockchain";
        nodeIndex = generateNewNodeIdx(
          nodes
            .filter(
              (e) =>
                e.data.component?.type === "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN"
            )
            .map((e) => e.id),
          "blockchain"
        );
        configuration =
          "configuration" in resource
            ? getBlockchainConnectorDefaultConfiguration(
                resource.connector_definition_name
              )
            : getBlockchainConnectorDefaultConfiguration(resource.name);
        componentType = "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN";
        break;
      }
      case "CONNECTOR_TYPE_DATA": {
        nodePrefix = "data";
        nodeIndex = generateNewNodeIdx(
          nodes
            .filter(
              (e) => e.data.component?.type === "COMPONENT_TYPE_CONNECTOR_DATA"
            )
            .map((e) => e.id),
          "data"
        );
        configuration = {
          input: {},
        };
        componentType = "COMPONENT_TYPE_CONNECTOR_DATA";
        break;
      }

      case "CONNECTOR_TYPE_OPERATOR": {
        nodePrefix = "op";
        nodeIndex = generateNewNodeIdx(
          nodes
            .filter((e) => e.data.component?.type === "COMPONENT_TYPE_OPERATOR")
            .map((e) => e.id),
          "op"
        );
        configuration = {};
        componentType = "COMPONENT_TYPE_OPERATOR";
        break;
      }
    }

    const nodeID = `${nodePrefix}_${nodeIndex}`;

    if (!componentType) {
      throw new Error("Component type is not defined");
    }

    if ("configuration" in resource) {
      // Create a new array to let reactflow rerender the component
      newNodes = [
        ...newNodes,
        {
          id: nodeID,
          type: "connectorNode",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          data: {
            nodeType: "connector",
            component: {
              id: nodeID,
              resource_name: resource.name,
              resource: {
                ...resource,
                connector_definition: null,
              },
              definition_name: resource.connector_definition.name,
              configuration: configuration ? configuration : {},
              type: componentType,
              connector_definition: resource.connector_definition,
            },
            note: null,
          },
          position: reactFlowInstance.project({
            x: viewport.x,
            y: viewport.y,
          }),
        },
      ];
    } else {
      // Create a new array to let reactflow rerender the component
      newNodes = [
        ...newNodes,
        {
          id: nodeID,
          type: "connectorNode",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          data: {
            nodeType: "connector",
            component: {
              id: nodeID,
              resource_name: null,
              resource: null,
              definition_name: resource.name,
              type: componentType,
              connector_definition: resource,
              configuration: configuration ? configuration : {},
            },
            note: null,
          },
          position: reactFlowInstance.project({
            x: viewport.x,
            y: viewport.y,
          }),
        },
      ];
    }

    updatePipelineRecipeIsDirty(() => true);

    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updateSelectResourceDialogIsOpen(() => false);
  }

  return (
    <>
      <div className="absolute right-8 top-8 flex flex-row-reverse gap-x-4">
        {isOwner ? (
          <>
            <ReleasePipelineModal
              accessToken={accessToken}
              disabled={currentVersion !== "latest"}
            />
            <Button
              onClick={handleSavePipeline}
              className="gap-x-2"
              variant="secondaryGrey"
              size="lg"
              type="button"
              disabled={canSave ? isSaving : true}
            >
              Save
              {isSaving ? (
                <LoadingSpin className="!text-black" />
              ) : (
                <Icons.Save01 className="h-5 w-5 stroke-semantic-fg-primary" />
              )}
            </Button>
            <Button
              onClick={async () => {
                if (pipelineIsNew) {
                  toast({
                    title: "Pipeline is not saved",
                    description: "Please save the pipeline before testing it.",
                    variant: "alert-error",
                    size: "large",
                  });
                  return;
                }

                if (pipelineRecipeIsDirty) {
                  await handleSavePipeline();
                }

                updateTestModeEnabled((prev) => !prev);
                updateSelectedConnectorNodeId(() => null);
                updateSelectResourceDialogIsOpen(() => false);
              }}
              className="gap-x-2"
              variant="secondaryGrey"
              size="lg"
              disabled={pipelineIsNew ? true : false}
            >
              {testModeEnabled ? (
                "Stop"
              ) : (
                <>
                  Test
                  <Icons.Play className="h-5 w-5 stroke-semantic-fg-primary" />
                </>
              )}
            </Button>
            <SharePipelineDialog
              accessToken={accessToken}
              enableQuery={enableQuery}
            />
          </>
        ) : (
          <>
            <Button
              onClick={async () => {
                if (!user.isSuccess) return;

                setIsCloning(true);

                const payload: CreateUserPipelinePayload = {
                  id: generateRandomReadableName(),
                  recipe: constructPipelineRecipe(nodes, true),
                  metadata: composePipelineMetadataFromNodes(nodes),
                };

                try {
                  await createUserPipeline.mutateAsync({
                    payload,
                    accessToken,
                    userName: user.data.name,
                  });

                  setIsCloning(false);

                  await router.push(`/${user.data.id}/pipelines/${payload.id}`);

                  router.reload();

                  toast({
                    title: "Successfully cloned the pipeline",
                    variant: "alert-success",
                    size: "small",
                  });
                } catch (error) {
                  setIsCloning(false);
                  if (isAxiosError(error)) {
                    toast({
                      title: "Something went wrong when clone the pipeline",
                      description: getInstillApiErrorMessage(error),
                      variant: "alert-error",
                      size: "large",
                    });
                  } else {
                    toast({
                      title: "Something went wrong when clone the pipeline",
                      variant: "alert-error",
                      size: "large",
                    });
                  }
                }
              }}
              className="!gap-x-2"
              variant="primary"
              size="lg"
              disabled={isCloning}
            >
              {isCloning ? <LoadingSpin /> : "Clone"}
            </Button>
          </>
        )}
      </div>
      <div className="absolute left-8 top-8 flex flex-row gap-x-4">
        {isOwner ? (
          <SelectConnectorResourceDialog
            enableQuery={enableQuery}
            open={selectResourceDialogIsOpen}
            onOpenChange={(open) =>
              updateSelectResourceDialogIsOpen(() => open)
            }
            accessToken={accessToken}
            onSelect={(resource) => {
              constructNode(resource);
            }}
            disabled={currentVersion === "latest" ? false : true}
          />
        ) : null}
      </div>
      <div className="absolute bottom-8 right-8">
        <PipelineToolkitModal snippet={codeSnippte} />
      </div>
      <CreateResourceDialog
        accessToken={accessToken}
        enableQuery={enableQuery}
      />
    </>
  );
};
