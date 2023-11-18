import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import { NodeProps, Position } from "reactflow";
import { PipelineComponentReference, StartNodeData } from "../../type";
import { Button, Form, Icons, useToast } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import {
  composeEdgesFromReferences,
  extractReferencesFromConfiguration,
  recursiveRemoveUndefinedAndNullFromArray,
  recursiveReplaceNullAndEmptyStringWithUndefined,
} from "../../lib";
import { CustomHandle } from "../CustomHandle";
import {
  InstillStore,
  Nullable,
  StartOperatorInput,
  StartOperatorInputType,
  StartOperatorMetadata,
  useInstillStore,
  useStartOperatorFreeForm,
  useTriggerUserPipeline,
  useTriggerUserPipelineRelease,
} from "../../../../lib";
import {
  StartOperatorNodeFreeForm,
  StartOperatorFreeFormSchema,
} from "./StartOperatorNodeFreeForm";
import { LoadingSpin } from "../../../../components";
import { toastInstillError } from "../../../../lib/toastInstillError";
import { NodeWrapper } from "../NodeWrapper";
import { NodeHead } from "../NodeHead";
import { StartEndOperatorControlPanel } from "../StartEndOperatorControlPanel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pickSelectedTypeFromInstillFormat } from "./pickSelectedTypeFromInstillFormat";
import { VerticalSortableWrapper } from "../VerticalSortableWrapper";
import { arrayMove } from "@dnd-kit/sortable";

export const CreateStartOperatorInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  key: z.string().min(1, { message: "Key is required" }),
});

const selector = (store: InstillStore) => ({
  pipelineIsNew: store.pipelineIsNew,
  pipelineName: store.pipelineName,
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  edges: store.edges,
  updateEdges: store.updateEdges,
  testModeEnabled: store.testModeEnabled,
  updateTestModeTriggerResponse: store.updateTestModeTriggerResponse,
  accessToken: store.accessToken,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export const StartOperatorNode = ({ data, id }: NodeProps<StartNodeData>) => {
  const [isTriggering, setIsTriggering] = React.useState(false);
  const [noteIsOpen, setNoteIsOpen] = React.useState<boolean>(false);
  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);

  const {
    pipelineName,
    nodes,
    updateNodes,
    edges,
    updateEdges,
    testModeEnabled,
    updateTestModeTriggerResponse,
    accessToken,
    isOwner,
    currentVersion,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const [selectedType, setSelectedType] =
    React.useState<Nullable<StartOperatorInputType>>(null);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);
  const [inputTypeIsArray, setInputTypeIsArray] = React.useState(false);

  const form = useForm<z.infer<typeof StartOperatorFreeFormSchema>>({
    resolver: zodResolver(StartOperatorFreeFormSchema),
  });

  const onEditFreeFormField = (key: string) => {
    if (!data.component.configuration.metadata) return;
    setPrevFieldKey(key);
    form.reset({
      title: data.component.configuration.metadata[key].title,
      key: key,
    });
    setEnableEdit(true);
    setInputTypeIsArray(
      data.component.configuration.metadata[key].type === "array"
    );

    setSelectedType(
      pickSelectedTypeFromInstillFormat(
        data.component.configuration.metadata[key].instillFormat
      )
    );
  };

  const onDeleteFreeFormField = (key: string) => {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "start") {
        if (node.data.component.configuration.metadata) {
          delete node.data.component.configuration.metadata[key];
        }

        node.data = {
          ...node.data,
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: PipelineComponentReference[] = [];

    newNodes.forEach((node) => {
      if (node.data.component?.configuration) {
        allReferences.push(
          ...extractReferencesFromConfiguration(
            node.data.component?.configuration,
            node.id
          )
        );
      }
    });

    const newEdges = composeEdgesFromReferences(allReferences, newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
  };

  const onCreateFreeFormField = (
    formData: z.infer<typeof StartOperatorFreeFormSchema>
  ) => {
    if (!selectedType) return;
    let configuraton: Nullable<StartOperatorInput> = null;

    if (inputTypeIsArray) {
      switch (selectedType) {
        case "string": {
          configuraton = {
            type: "array",
            items: {
              type: "string",
            },
            instillFormat: "array:string",
            title: formData.title,
          };
          break;
        }
        case "audio/*": {
          configuraton = {
            type: "array",
            items: {
              type: "string",
            },
            instillFormat: "array:audio/*",
            title: formData.title,
          };
          break;
        }
        case "boolean": {
          configuraton = {
            type: "array",
            items: {
              type: "boolean",
            },
            instillFormat: "array:boolean",
            title: formData.title,
          };
          break;
        }
        case "image/*": {
          configuraton = {
            type: "array",
            items: {
              type: "string",
            },
            instillFormat: "array:image/*",
            title: formData.title,
          };
          break;
        }
        case "number": {
          configuraton = {
            type: "array",
            items: {
              type: "number",
            },
            instillFormat: "array:number",
            title: formData.title,
          };
          break;
        }
      }
    } else {
      switch (selectedType) {
        case "string": {
          configuraton = {
            type: "string",
            instillFormat: "string",
            title: formData.title,
          };
          break;
        }
        case "audio/*": {
          configuraton = {
            type: "string",
            instillFormat: "audio/*",
            title: formData.title,
          };
          break;
        }
        case "boolean": {
          configuraton = {
            type: "boolean",
            instillFormat: "boolean",
            title: formData.title,
          };
          break;
        }
        case "image/*": {
          configuraton = {
            type: "string",
            instillFormat: "image/*",
            title: formData.title,
          };
          break;
        }
        case "number": {
          configuraton = {
            type: "number",
            instillFormat: "number",
            title: formData.title,
          };
          break;
        }
      }
    }

    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "start" && configuraton) {
        if (prevFieldKey && node.data.component.configuration.metadata) {
          delete node.data.component.configuration.metadata[prevFieldKey];
        }

        node.data = {
          ...node.data,
          component: {
            ...node.data.component,
            configuration: {
              ...node.data.component.configuration,
              metadata: {
                ...node.data.component.configuration.metadata,
                [formData.key]: configuraton,
              },
            },
          },
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: PipelineComponentReference[] = [];

    newNodes.forEach((node) => {
      if (node.data.component?.configuration) {
        allReferences.push(
          ...extractReferencesFromConfiguration(
            node.data.component?.configuration,
            node.id
          )
        );
      }
    });

    const newEdges = composeEdgesFromReferences(allReferences, newNodes);
    updateEdges(() => newEdges);

    setEnableEdit(false);
    setSelectedType(null);
    setPrevFieldKey(null);
    setInputTypeIsArray(false);
    updatePipelineRecipeIsDirty(() => true);
    form.reset({
      title: "",
      key: "",
    });
  };

  function onCancelFreeForm() {
    setEnableEdit((prev) => !prev);
    setSelectedType(null);
    setPrevFieldKey(null);
    form.reset({
      title: "",
      key: "",
    });
    setInputTypeIsArray(false);
  }
  const {
    Schema: StartOperatorTestModeInputSchema,
    fieldItems: startOperatorTestModeInputfieldItems,
    form: startOperatorTestModeInputForm,
  } = useStartOperatorFreeForm({
    data,
    onDeleteField: onDeleteFreeFormField,
    onEditField: onEditFreeFormField,
  });

  React.useEffect(() => {
    if (!testModeEnabled) {
      setIsTriggering(false);
    }
    updateTestModeTriggerResponse(() => null);
    startOperatorTestModeInputForm.reset();
  }, [
    testModeEnabled,
    startOperatorTestModeInputForm,
    updateTestModeTriggerResponse,
  ]);

  const [enableEdit, setEnableEdit] = React.useState(false);
  const useTriggerPipeline = useTriggerUserPipeline();
  const useTriggerPipelineRelease = useTriggerUserPipelineRelease();

  async function onTriggerPipeline(
    data: z.infer<typeof StartOperatorTestModeInputSchema>
  ) {
    if (!pipelineName) return;

    const input = recursiveRemoveUndefinedAndNullFromArray(
      recursiveReplaceNullAndEmptyStringWithUndefined(data)
    );

    setIsTriggering(true);

    if (currentVersion === "latest") {
      try {
        const data = await useTriggerPipeline.mutateAsync({
          pipelineName,
          accessToken,
          payload: {
            inputs: [input],
          },
          returnTraces: true,
        });

        setIsTriggering(false);
        updateTestModeTriggerResponse(() => data);
      } catch (error) {
        setIsTriggering(false);
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
          toast,
        });
      }
    } else {
      try {
        const data = await useTriggerPipelineRelease.mutateAsync({
          pipelineReleaseName: `${pipelineName}/releases/${currentVersion}`,
          payload: {
            inputs: [input],
          },
          accessToken,
          returnTraces: true,
        });

        setIsTriggering(false);
        updateTestModeTriggerResponse(() => data);
      } catch (error) {
        setIsTriggering(false);
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
          toast,
        });
      }
    }
  }

  const hasSourceEdges = React.useMemo(() => {
    return edges.some((edge) => edge.source === id);
  }, [edges, id]);

  return (
    <NodeWrapper
      nodeType={data.nodeType}
      id={id}
      note={data.note}
      noteIsOpen={noteIsOpen}
    >
      <div className="relative flex w-[var(--pipeline-builder-node-available-width)] flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg">
        <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
          <div className="mr-auto flex flex-row gap-x-2">
            <div className="my-auto flex h-6 w-6 rounded bg-semantic-bg-line">
              <Icons.Box className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
            </div>
            <p className="my-auto py-2 text-semantic-fg-secondary product-body-text-4-medium">
              start
            </p>
          </div>
          <StartEndOperatorControlPanel
            nodeIsCollapsed={nodeIsCollapsed}
            setNodeIsCollapsed={setNodeIsCollapsed}
            handleToggleNote={() => setNoteIsOpen(!noteIsOpen)}
            noteIsOpen={noteIsOpen}
            componentTypeName="Start"
          />
        </NodeHead>
        <div className="flex flex-col">
          {enableEdit ? (
            <StartOperatorNodeFreeForm
              form={form}
              inputTypeIsArray={inputTypeIsArray}
              setInputTypeIsArray={setInputTypeIsArray}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              onCreateFreeFormField={onCreateFreeFormField}
              onCancel={onCancelFreeForm}
            />
          ) : (
            <div className="flex flex-col gap-y-3">
              <Form.Root {...startOperatorTestModeInputForm}>
                <form
                  className="w-full"
                  onSubmit={startOperatorTestModeInputForm.handleSubmit(
                    onTriggerPipeline
                  )}
                >
                  <VerticalSortableWrapper
                    items={startOperatorTestModeInputfieldItems.map((e) => ({
                      key: e.key,
                    }))}
                    onDragEnd={(event) => {
                      const { active, over } = event;

                      if (over && active.id !== over.id) {
                        let newFieldItems =
                          startOperatorTestModeInputfieldItems;

                        const oldIndex =
                          startOperatorTestModeInputfieldItems.findIndex(
                            (e) => e.key === active.id
                          );
                        const newIndex =
                          startOperatorTestModeInputfieldItems.findIndex(
                            (e) => e.key === over.id
                          );

                        newFieldItems = arrayMove(
                          startOperatorTestModeInputfieldItems,
                          oldIndex,
                          newIndex
                        );

                        if (newFieldItems.length > 0) {
                          const newMetadata: Record<
                            string,
                            StartOperatorInput
                          > = {};

                          newFieldItems.forEach((item, index) => {
                            if (data.component.configuration.metadata) {
                              newMetadata[item.key] = {
                                ...data.component.configuration.metadata[
                                  item.key
                                ],
                                instillUiOrder: index,
                              };
                            }
                          });

                          const newNodes = nodes.map((node) => {
                            if (node.data.nodeType === "start") {
                              node.data = {
                                ...node.data,
                                component: {
                                  ...node.data.component,
                                  configuration: {
                                    ...node.data.component.configuration,
                                    metadata: newMetadata,
                                  },
                                },
                              };
                            }
                            return node;
                          });

                          updateNodes(() => newNodes);
                          updatePipelineRecipeIsDirty(() => true);
                        }
                      }
                    }}
                  >
                    <div className="flex flex-col gap-y-4">
                      {startOperatorTestModeInputfieldItems.map(
                        (field) => field.component
                      )}
                    </div>
                  </VerticalSortableWrapper>
                  <div className="absolute left-[6px] top-0 -translate-y-[calc(100%+2px)]">
                    <Button
                      type="submit"
                      variant="secondaryGrey"
                      size="lg"
                      className="gap-x-2"
                      disabled={isTriggering}
                    >
                      Run
                      {isTriggering ? (
                        <LoadingSpin className="!text-semantic-fg-secondary" />
                      ) : (
                        <Icons.Play className="h-4 w-4 stroke-semantic-fg-primary" />
                      )}
                    </Button>
                  </div>
                </form>
              </Form.Root>
              <Button
                className="flex w-full flex-1"
                variant="tertiaryColour"
                onClick={() => setEnableEdit(!enableEdit)}
                disabled={
                  isOwner ? (currentVersion === "latest" ? false : true) : true
                }
                type="button"
              >
                <p className="my-auto">Add Field</p>
                <Icons.Plus
                  className={cn(
                    "my-auto h-4 w-4 stroke-semantic-accent-default",
                    currentVersion === "latest"
                      ? "stroke-semantic-accent-default"
                      : "stroke-semantic-fg-secondary"
                  )}
                />
              </Button>
            </div>
          )}
        </div>
      </div>
      <CustomHandle
        className={hasSourceEdges ? "" : "!opacity-0"}
        type="source"
        position={Position.Right}
        id={id}
      />
    </NodeWrapper>
  );
};
