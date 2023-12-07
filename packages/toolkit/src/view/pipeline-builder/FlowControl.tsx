import cn from "clsx";
import * as React from "react";
import { isAxiosError } from "axios";
import { Node, Position, ReactFlowInstance } from "reactflow";
import { useRouter } from "next/router";
import { Button, Icons, Menubar, useToast } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import {
  constructPipelineRecipe,
  composePipelineMetadataFromNodes,
  transformConnectorDefinitionIDToComponentIDPrefix,
  generateNewComponentIndex,
} from "./lib";
import {
  PublishPipelineDialog,
  PipelineToolkitModal,
  SelectPipelineComponentDefinitionDialog,
  CreateResourceDialog,
  SharePipelineDialog,
  ReleaseMenu,
} from "./components";
import { triggerPipelineSnippets } from "./components/triggerPipelineSnippets";
import {
  ConnectorDefinition,
  ConnectorWithDefinition,
  CreateUserPipelinePayload,
  GeneralRecord,
  InstillAppEnv,
  InstillStore,
  Nullable,
  OperatorDefinition,
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
  testModeEnabled: store.testModeEnabled,
  updateTestModeEnabled: store.updateTestModeEnabled,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
  isTriggeringPipeline: store.isTriggeringPipeline,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
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
    isOwner,
    currentVersion,
    isTriggeringPipeline,
    updateDialogSharePipelineIsOpen,
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
  const [toolKitIsOpen, setToolKitIsOpen] = React.useState(false);
  const [releaseDialogIsOpen, setReleaseDialogIsOpen] = React.useState(false);
  const [selectedMenu, setSelectedMenu] =
    React.useState<Nullable<string>>(null);
  const [isReleasing, setIsReleasing] = React.useState(false);

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
        case "image/*": {
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
        case "audio/*": {
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
    resource: ConnectorWithDefinition | ConnectorDefinition | OperatorDefinition
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

    // Construct the default component ID prefix. For example, if the definition
    // is `connector-definitions/instill_ai`, the prefix will be `instill_ai`
    let nodePrefix: Nullable<string> = null;

    if ("connector_definition" in resource) {
      nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
        resource.connector_definition.id
      );
    } else {
      nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
        resource.id
      );
    }

    // Generate a new component index
    const nodeIndex = generateNewComponentIndex(
      nodes.map((e) => e.id),
      nodePrefix
    );

    const nodeID = `${nodePrefix}_${nodeIndex}`;

    let configuration: Nullable<GeneralRecord> = null;

    // Process the connectors
    if ("type" in resource) {
      switch (resource.type) {
        case "CONNECTOR_TYPE_AI": {
          configuration = {};
          componentType = "COMPONENT_TYPE_CONNECTOR_AI";
          break;
        }
        case "CONNECTOR_TYPE_BLOCKCHAIN": {
          configuration = {};
          componentType = "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN";
          break;
        }
        case "CONNECTOR_TYPE_DATA": {
          configuration = {};
          componentType = "COMPONENT_TYPE_CONNECTOR_DATA";
          break;
        }
      }

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
    } else {
      // Process the operators
      newNodes = [
        ...newNodes,
        {
          id: nodeID,
          type: "operatorNode",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          data: {
            nodeType: "operator",
            component: {
              id: nodeID,
              resource_name: null,
              resource: null,
              definition_name: resource.name,
              type: "COMPONENT_TYPE_OPERATOR",
              operator_definition: resource,
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
    <React.Fragment>
      <div className="absolute right-8 top-8 flex h-10 flex-row-reverse gap-x-4">
        {isOwner ? (
          <React.Fragment>
            <Menubar.Root
              // We don't want to trigger menu open state when user click
              // on the menu item
              value={selectedMenu ?? ""}
              onValueChange={(value) => {
                if (isReleasing) {
                  return;
                }

                setSelectedMenu(value);
              }}
            >
              <Menubar.Menu>
                <Menubar.Trigger
                  className={cn(
                    "flex cursor-pointer flex-row gap-x-2",
                    pipelineRecipeIsDirty
                      ? "text-[#bfbfbf]"
                      : "!text-semantic-accent-default hover:!bg-semantic-accent-bg"
                  )}
                  value="play"
                  type="submit"
                  form="start-operator-trigger-pipeline-form"
                  disabled={pipelineRecipeIsDirty}
                  onClick={async (e) => {
                    if (pipelineRecipeIsDirty) {
                      await handleSavePipeline();
                      e.preventDefault();
                    }
                  }}
                >
                  Run
                  {isTriggeringPipeline ? (
                    <LoadingSpin className="my-auto !text-semantic-accent-default" />
                  ) : (
                    <Icons.PlayCircle
                      className={cn(
                        "my-auto h-4 w-4",
                        pipelineRecipeIsDirty
                          ? "stroke-[#bfbfbf]"
                          : "stroke-semantic-accent-default"
                      )}
                    />
                  )}
                </Menubar.Trigger>
              </Menubar.Menu>
              <Menubar.Menu>
                <Menubar.Trigger
                  className="flex cursor-pointer flex-row gap-x-2"
                  value="toolkit"
                  onClick={() => setToolKitIsOpen((prev) => !prev)}
                >
                  Toolkit
                  <Icons.CodeSquare02 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                </Menubar.Trigger>
              </Menubar.Menu>
              <Menubar.Menu>
                <Menubar.Trigger
                  className="flex cursor-pointer flex-row gap-x-2"
                  value="save"
                  onClick={handleSavePipeline}
                  disabled={canSave ? isSaving : true}
                >
                  Save
                  {isSaving ? (
                    <LoadingSpin className="!text-black" />
                  ) : (
                    <Icons.Save01
                      className={cn(
                        "h-4 w-4",
                        pipelineRecipeIsDirty
                          ? "stroke-semantic-fg-primary"
                          : "stroke-[#bfbfbf]"
                      )}
                    />
                  )}
                </Menubar.Trigger>
              </Menubar.Menu>
              <Menubar.Menu>
                <Menubar.Trigger
                  className="flex cursor-pointer flex-row gap-x-2"
                  value="share"
                  onClick={() =>
                    updateDialogSharePipelineIsOpen((prev) => !prev)
                  }
                >
                  Share
                  <Icons.Share07 className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                </Menubar.Trigger>
              </Menubar.Menu>
              <Menubar.Menu>
                <Menubar.Trigger
                  className={cn(
                    "flex cursor-pointer flex-row gap-x-2",
                    pipelineRecipeIsDirty
                      ? ""
                      : "!bg-semantic-accent-default !text-semantic-fg-on-default hover:!bg-semantic-accent-hover active:!bg-semantic-accent-pressed"
                  )}
                  value="release"
                  disabled={pipelineRecipeIsDirty}
                >
                  Release
                  <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-on-default" />
                </Menubar.Trigger>
                <Menubar.Portal>
                  <Menubar.Content
                    className="w-[392px] rounded-[12px] p-6"
                    align="end"
                  >
                    <ReleaseMenu
                      isReleasing={isReleasing}
                      setIsReleasing={setIsReleasing}
                      onRelease={() => {
                        setSelectedMenu("");
                      }}
                    />
                  </Menubar.Content>
                </Menubar.Portal>
              </Menubar.Menu>
            </Menubar.Root>
          </React.Fragment>
        ) : (
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
        )}
      </div>
      <div className="absolute left-8 top-8 flex flex-row">
        {isOwner ? (
          <SelectPipelineComponentDefinitionDialog
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
      <PipelineToolkitModal
        snippet={codeSnippte}
        isOpen={toolKitIsOpen}
        setIsOpen={setToolKitIsOpen}
      />
      <SharePipelineDialog />
      <CreateResourceDialog
        accessToken={accessToken}
        enableQuery={enableQuery}
      />
      <PublishPipelineDialog />
    </React.Fragment>
  );
};
