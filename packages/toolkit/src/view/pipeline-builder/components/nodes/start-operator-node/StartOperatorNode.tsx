"use client";

import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import { NodeProps } from "reactflow";
import { Button, Form, Icons, useToast } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { StartNodeData } from "../../../type";
import { composeEdgesFromComponents, recursiveHelpers } from "../../../lib";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useStartOperatorTriggerPipelineForm,
  useTriggerUserPipeline,
  useTriggerUserPipelineRelease,
  toastInstillError,
  GeneralRecord,
  sendAmplitudeData,
  useAmplitudeCtx,
} from "../../../../../lib";
import {
  StartOperatorNodeFreeForm,
  StartOperatorFreeFormSchema,
} from "./StartOperatorNodeFreeForm";

import { arrayMove } from "@dnd-kit/sortable";
import { StartEndOperatorControlPanel } from "../control-panel";
import { NodeHead, NodeSortableFieldWrapper, NodeWrapper } from "../common";
import { VerticalSortableWrapper } from "../../VerticalSortableWrapper";
import { isStartComponent } from "../../../lib/checkComponentType";
import { StartComponentFields } from "./StartComponentFields";

export const CreateStartOperatorInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  key: z.string().min(1, { message: "Key is required" }),
});

const selector = (store: InstillStore) => ({
  pipelineIsNew: store.pipelineIsNew,
  pipelineName: store.pipelineName,
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateTestModeTriggerResponse: store.updateTestModeTriggerResponse,
  accessToken: store.accessToken,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateIsTriggeringPipeline: store.updateIsTriggeringPipeline,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  collapseAllNodes: store.collapseAllNodes,
  updateRecentlyUsedStartComponentFieldTypes:
    store.updateRecentlyUsedStartComponentFieldTypes,
});

export const StartOperatorNode = ({ data }: NodeProps<StartNodeData>) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [noteIsOpen, setNoteIsOpen] = React.useState<boolean>(false);
  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);

  const {
    pipelineName,
    nodes,
    updateNodes,
    updateEdges,
    updateTestModeTriggerResponse,
    accessToken,
    isOwner,
    currentVersion,
    updatePipelineRecipeIsDirty,
    updateIsTriggeringPipeline,
    pipelineIsReadOnly,
    collapseAllNodes,
    updateRecentlyUsedStartComponentFieldTypes,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const [selectedType, setSelectedType] =
    React.useState<Nullable<string>>(null);
  const [currentEditingFieldKey, setCurrentEditingFieldKey] =
    React.useState<Nullable<string>>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  const form = useForm<z.infer<typeof StartOperatorFreeFormSchema>>({
    resolver: zodResolver(StartOperatorFreeFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  React.useEffect(() => {
    setNodeIsCollapsed(collapseAllNodes);
  }, [collapseAllNodes]);

  // When edit field, the input key is already the auto generated key
  const onEditFreeFormField = (key: string) => {
    setCurrentEditingFieldKey(key);
    form.reset({
      title: data.start_component.fields[key].title,
      key,
      description: data.start_component.fields[key].description,
    });
    setIsEditing(true);

    const newSelectedType = data.start_component.fields[key].instill_format;

    setSelectedType(newSelectedType);

    updateRecentlyUsedStartComponentFieldTypes((prev) => {
      if (!prev.includes(newSelectedType)) {
        return [...prev, newSelectedType];
      }
      return prev;
    });
  };

  // When delete field, the input key is already the auto generated key
  const onDeleteFreeFormField = (key: string) => {
    const newNodes = nodes.map((node) => {
      if (isStartComponent(node.data)) {
        delete node.data.start_component.fields[key];

        node.data = {
          ...node.data,
        };
      }
      return node;
    });
    const newEdges = composeEdgesFromComponents(
      newNodes.map((node) => node.data)
    );
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
  };

  function onCreateFreeFormField(
    formData: z.infer<typeof StartOperatorFreeFormSchema>
  ) {
    if (!selectedType) {
      return;
    }

    if (Object.keys(data.start_component.fields).includes(formData.key)) {
      if (isEditing) {
        if (formData.key !== currentEditingFieldKey) {
          form.setError("key", {
            type: "manual",
            message: "Key already exists",
          });
          return;
        }
      } else {
        form.setError("key", {
          type: "manual",
          message: "Key already exists",
        });
        return;
      }
    }

    if (!StartComponentFields[selectedType]) {
      return;
    }

    const field = StartComponentFields[selectedType].getFieldConfiguration(
      formData.title,
      formData.description
    );

    updateRecentlyUsedStartComponentFieldTypes((prev) => {
      if (!prev.includes(selectedType)) {
        return [...prev, selectedType];
      }
      return prev;
    });

    const newNodes = nodes.map((node) => {
      if (isStartComponent(node.data) && field) {
        if (currentEditingFieldKey) {
          delete node.data.start_component.fields[currentEditingFieldKey];
        }

        node.data = {
          ...node.data,
          start_component: {
            fields: {
              ...node.data.start_component.fields,
              [formData.key]: field,
            },
          },
        };
      }
      return node;
    });
    const newEdges = composeEdgesFromComponents(
      newNodes.map((node) => node.data)
    );
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    setIsCreating(false);
    setIsEditing(false);
    setSelectedType(null);
    setCurrentEditingFieldKey(null);
    updatePipelineRecipeIsDirty(() => true);
    form.reset({
      title: "",
      description: "",
    });
  }

  function onCancelFreeForm() {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedType(null);
    setCurrentEditingFieldKey(null);
    form.reset({
      title: "",
      description: "",
    });
  }

  const [disabledReferenceHint, setDisabledReferenceHint] =
    React.useState(false);

  const {
    Schema: StartOperatorTriggerPipelineFormSchema,
    fieldItems: startOperatorTriggerPipelineFormfieldItems,
    form: startOperatorTriggerPipelineForm,
  } = useStartOperatorTriggerPipelineForm({
    mode: "build",
    fields: data.start_component.fields ?? null,
    onDeleteField: onDeleteFreeFormField,
    onEditField: onEditFreeFormField,
    disabledFields: pipelineIsReadOnly,
    disabledFieldControls: pipelineIsReadOnly,
    disabledReferenceHint,
  });

  const useTriggerPipeline = useTriggerUserPipeline();
  const useTriggerPipelineRelease = useTriggerUserPipelineRelease();

  async function onTriggerPipeline(
    formData: z.infer<typeof StartOperatorTriggerPipelineFormSchema>
  ) {
    if (!pipelineName || !formData) return;

    const input = recursiveHelpers.removeUndefinedAndNullFromArray(
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(formData)
    );

    // Backend need to have the encoded JSON input. So we need to double check
    // the metadata whether this field is a semi-structured object and parse it

    const semiStructuredObjectKeys: string[] = [];

    Object.entries(data.start_component.fields).forEach(([key, value]) => {
      if (value.instill_format === "semi-structured/json") {
        semiStructuredObjectKeys.push(key);
      }
    });

    const parsedStructuredData: GeneralRecord = input;

    for (const key of semiStructuredObjectKeys) {
      if (!formData[key]) {
        continue;
      }

      try {
        const parsed = JSON.parse(formData[key]);
        parsedStructuredData[key] = parsed;
      } catch (err) {
        console.error(err);
        startOperatorTriggerPipelineForm.setError(key, {
          type: "manual",
          message: "Invalid JSON format",
        });
        return;
      }
    }

    updateIsTriggeringPipeline(() => true);

    // The user can trigger different version of pipleine when they are
    // pro or enterprise users

    if (currentVersion === "latest") {
      try {
        const data = await useTriggerPipeline.mutateAsync({
          pipelineName,
          accessToken,
          payload: {
            inputs: [parsedStructuredData],
          },
          returnTraces: true,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("trigger_pipeline");
        }

        updateIsTriggeringPipeline(() => false);
        updateTestModeTriggerResponse(() => data);
      } catch (error) {
        updateIsTriggeringPipeline(() => false);
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
            inputs: [parsedStructuredData],
          },
          accessToken,
          returnTraces: true,
        });

        updateIsTriggeringPipeline(() => false);
        updateTestModeTriggerResponse(() => data);
      } catch (error) {
        updateIsTriggeringPipeline(() => false);
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
          toast,
        });
      }
    }
  }

  let disabledAddFieldButton = false;

  if (pipelineIsReadOnly) {
    disabledAddFieldButton = true;
  } else {
    if (!isOwner) {
      disabledAddFieldButton = true;
    } else {
      if (currentVersion !== "latest") {
        disabledAddFieldButton = true;
      }
    }
  }

  return (
    <NodeWrapper
      nodeData={data}
      noteIsOpen={noteIsOpen}
      disabledTargetHandler={true}
    >
      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-2">
          <div className="my-auto flex h-6 w-6 rounded bg-semantic-bg-line">
            <Icons.Lightning01 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
          </div>
          <p className="my-auto py-2 text-semantic-fg-secondary product-body-text-4-medium">
            start
          </p>
        </div>
        <StartEndOperatorControlPanel
          type="start"
          nodeIsCollapsed={nodeIsCollapsed}
          setNodeIsCollapsed={setNodeIsCollapsed}
          handleToggleNote={() => setNoteIsOpen(!noteIsOpen)}
          noteIsOpen={noteIsOpen}
          componentTypeName="Start"
          disabledReferenceHint={disabledReferenceHint}
          setDisabledReferenceHint={setDisabledReferenceHint}
        />
      </NodeHead>
      {nodeIsCollapsed ? null : (
        <div className="nodrag nowheel flex flex-col">
          {isCreating || isEditing ? (
            <StartOperatorNodeFreeForm
              form={form}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              onCreateFreeFormField={onCreateFreeFormField}
              onCancel={onCancelFreeForm}
              isEditing={isEditing}
            />
          ) : (
            <div className="flex flex-col gap-y-3">
              <Form.Root {...startOperatorTriggerPipelineForm}>
                <form
                  id="start-operator-trigger-pipeline-form"
                  className="w-full"
                  onSubmit={startOperatorTriggerPipelineForm.handleSubmit(
                    onTriggerPipeline
                  )}
                >
                  <VerticalSortableWrapper
                    // we directly use the key as the id, because the key is guarded
                    // but our auto-form, it should be always present
                    items={startOperatorTriggerPipelineFormfieldItems.map(
                      (e) => ({
                        key: e.key as string,
                      })
                    )}
                    onDragEnd={(event) => {
                      const { active, over } = event;

                      if (over && active.id !== over.id) {
                        const oldIndex =
                          startOperatorTriggerPipelineFormfieldItems.findIndex(
                            (e) => e.key === active.id
                          );
                        const newIndex =
                          startOperatorTriggerPipelineFormfieldItems.findIndex(
                            (e) => e.key === over.id
                          );

                        const newFieldItems = arrayMove(
                          startOperatorTriggerPipelineFormfieldItems,
                          oldIndex,
                          newIndex
                        );

                        if (newFieldItems.length > 0) {
                          const newNodes = nodes.map((node) => {
                            if (isStartComponent(node.data)) {
                              const newFields = Object.fromEntries(
                                Object.entries(
                                  node.data.start_component.fields
                                ).map(([key, value]) => {
                                  const newFieldIndex = newFieldItems.findIndex(
                                    (e) => e.key === key
                                  );

                                  if (newFieldIndex !== -1) {
                                    return [
                                      key,
                                      {
                                        ...value,
                                        instill_ui_order: newFieldIndex,
                                      },
                                    ];
                                  }

                                  return [key, value];
                                })
                              );

                              node.data = {
                                ...node.data,
                                start_component: {
                                  fields: newFields,
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
                      {startOperatorTriggerPipelineFormfieldItems.map(
                        (item) => (
                          <NodeSortableFieldWrapper
                            key={item.key}
                            path={item.key as string}
                          >
                            {item}
                          </NodeSortableFieldWrapper>
                        )
                      )}
                    </div>
                  </VerticalSortableWrapper>
                </form>
              </Form.Root>
              <Button
                className="flex w-full flex-1 gap-x-2"
                variant="tertiaryColour"
                onClick={() => {
                  // Set the default selected type to string
                  setSelectedType("string");
                  setIsCreating(true);
                }}
                disabled={disabledAddFieldButton}
                type="button"
              >
                <p className="my-auto pt-0.5">Add Field</p>
                <Icons.Plus
                  className={cn(
                    "my-auto h-4 w-4 stroke-semantic-accent-default",
                    disabledAddFieldButton
                      ? "stroke-semantic-fg-secondary"
                      : "stroke-semantic-accent-default"
                  )}
                />
              </Button>
            </div>
          )}
        </div>
      )}
    </NodeWrapper>
  );
};
