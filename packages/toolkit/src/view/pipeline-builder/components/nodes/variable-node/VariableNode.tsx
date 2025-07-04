"use client";

import * as React from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { InstillNameInterpreter } from "instill-sdk";
import { useForm } from "react-hook-form";
import { NodeProps } from "reactflow";
import * as z from "zod";
import { useShallow } from "zustand/react/shallow";

import { Button, cn, Form, Icons } from "@instill-ai/design-system";

import {
  GeneralRecord,
  InstillStore,
  Nullable,
  onTriggerInvalidateCredits,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useInstillStore,
  usePipelineTriggerRequestForm,
  useQueryClient,
  useTriggerNamespacePipeline,
  useTriggerNamespacePipelineRelease,
  useUserNamespaces,
} from "../../../../../lib";
import {
  composeEdgesFromNodes,
  isVariableNode,
  recursiveHelpers,
} from "../../../lib";
import { TriggerNodeData } from "../../../type";
import { VerticalSortableWrapper } from "../../VerticalSortableWrapper";
import { NodeHead, NodeSortableFieldWrapper, NodeWrapper } from "../common";
import { VariableResponseNodeControlPanel } from "../control-panel";
import { triggerNodeFields } from "./VariableNodeFields";
import {
  TriggerNodeFreeForm,
  TriggerNodeFreeFormSchema,
} from "./VariableNodeFreeForm";

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
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const VariableNode = ({ data, id }: NodeProps<TriggerNodeData>) => {
  const queryClient = useQueryClient();
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
    navigationNamespaceAnchor,
  } = useInstillStore(useShallow(selector));

  const [selectedType, setSelectedType] =
    React.useState<Nullable<string>>(null);
  const [currentEditingFieldKey, setCurrentEditingFieldKey] =
    React.useState<Nullable<string>>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  const userNamespaces = useUserNamespaces();

  const form = useForm<z.infer<typeof TriggerNodeFreeFormSchema>>({
    resolver: zodResolver(TriggerNodeFreeFormSchema),
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
      title: data.fields[key]?.title,
      key,
      description: data.fields[key]?.description,
    });
    setIsEditing(true);

    let newSelectedType = data.fields[key]?.instillFormat;

    if (newSelectedType === "string" && data.fields[key]?.instillUiMultiline) {
      newSelectedType = "long_string";
    }

    if (!newSelectedType) {
      return;
    }

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
      if (isVariableNode(node)) {
        delete node.data.fields[key];

        node.data = {
          ...node.data,
        };
      }
      return node;
    });
    const newEdges = composeEdgesFromNodes(newNodes);
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
  };

  function onCreateFreeFormField(
    formData: z.infer<typeof TriggerNodeFreeFormSchema>,
  ) {
    if (!selectedType) {
      return;
    }

    if (Object.keys(data.fields).includes(formData.key)) {
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

    const targetFieldType = triggerNodeFields[selectedType];

    if (!targetFieldType) {
      return;
    }

    const field = targetFieldType.getFieldConfiguration(
      formData.title,
      formData.description,
    );

    updateRecentlyUsedStartComponentFieldTypes((prev) => {
      if (!prev.includes(selectedType)) {
        return [...prev, selectedType];
      }
      return prev;
    });

    const newNodes = nodes.map((node) => {
      if (isVariableNode(node) && field) {
        if (currentEditingFieldKey) {
          delete node.data.fields[currentEditingFieldKey];
        }

        node.data = {
          ...node.data,
          fields: {
            ...node.data.fields,
            [formData.key]: field,
          },
        };
      }
      return node;
    });
    const newEdges = composeEdgesFromNodes(newNodes);
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
    Schema: TriggerPipelineFormSchema,
    fieldItems: triggerPipelineFormFields,
    form: triggerPipelineForm,
  } = usePipelineTriggerRequestForm({
    mode: "build",
    fields: data.fields ?? null,
    onDeleteField: onDeleteFreeFormField,
    onEditField: onEditFreeFormField,
    disabledFields: pipelineIsReadOnly,
    disabledFieldControls: pipelineIsReadOnly,
    disabledReferenceHint,
  });

  const triggerPipeline = useTriggerNamespacePipeline();
  const triggerPipelineRelease = useTriggerNamespacePipelineRelease();

  async function onTriggerPipeline(
    formData: z.infer<typeof TriggerPipelineFormSchema>,
  ) {
    if (!pipelineName || !formData || !userNamespaces.isSuccess) return;

    const input = recursiveHelpers.removeUndefinedAndNullFromArray(
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(formData),
    );

    // Backend need to have the encoded JSON input. So we need to double check
    // the metadata whether this field is a semi-structured object and parse it

    const semiStructuredObjectKeys: string[] = [];

    Object.entries(data.fields).forEach(([key, value]) => {
      if (value?.instillFormat === "semi-structured/json") {
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
        triggerPipelineForm.setError(key, {
          type: "manual",
          message: "Invalid JSON format",
        });
        return;
      }
    }

    updateIsTriggeringPipeline(() => true);

    // The user can trigger different version of pipleine when they are
    // pro or enterprise users

    const instillName = InstillNameInterpreter.pipeline(pipelineName);

    if (currentVersion === "latest") {
      try {
        const targetNamespace = userNamespaces.data.find(
          (ns) => ns.id === navigationNamespaceAnchor,
        );

        const data = await triggerPipeline.mutateAsync({
          namespaceId: instillName.namespaceId,
          pipelineId: instillName.resourceId,
          accessToken,
          inputs: [parsedStructuredData],
          returnTraces: true,
          requesterUid: targetNamespace ? targetNamespace.uid : undefined,
        });

        onTriggerInvalidateCredits({
          namespaceId: targetNamespace?.id ?? null,
          namespaceIds: userNamespaces.data.map((namespace) => namespace.id),
          queryClient,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("trigger_pipeline", {
            page_url: window.location.href,
          });
        }

        updateIsTriggeringPipeline(() => false);
        updateTestModeTriggerResponse(() => data);
      } catch (error) {
        updateIsTriggeringPipeline(() => false);
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
        });
      }
    } else {
      if (!currentVersion) {
        return;
      }

      try {
        const targetNamespace = userNamespaces.data.find(
          (ns) => ns.id === navigationNamespaceAnchor,
        );

        const data = await triggerPipelineRelease.mutateAsync({
          namespaceId: instillName.namespaceId,
          pipelineId: instillName.resourceId,
          releaseId: currentVersion,
          inputs: [parsedStructuredData],
          accessToken,
          returnTraces: true,
          requesterUid: targetNamespace ? targetNamespace.uid : undefined,
        });

        onTriggerInvalidateCredits({
          namespaceId: targetNamespace?.id ?? null,
          namespaceIds: userNamespaces.data.map((namespace) => namespace.id),
          queryClient,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("trigger_pipeline", {
            page_url: window.location.href,
          });
        }

        updateIsTriggeringPipeline(() => false);
        updateTestModeTriggerResponse(() => data);
      } catch (error) {
        updateIsTriggeringPipeline(() => false);
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
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
      nodeID={id}
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
            variable
          </p>
        </div>
        <VariableResponseNodeControlPanel
          type="variable"
          nodeIsCollapsed={nodeIsCollapsed}
          setNodeIsCollapsed={setNodeIsCollapsed}
          handleToggleNote={() => setNoteIsOpen(!noteIsOpen)}
          noteIsOpen={noteIsOpen}
          disabledReferenceHint={disabledReferenceHint}
          setDisabledReferenceHint={setDisabledReferenceHint}
        />
      </NodeHead>
      {nodeIsCollapsed ? null : (
        <div className="nodrag nowheel flex flex-col">
          {isCreating || isEditing ? (
            <TriggerNodeFreeForm
              form={form}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              onCreateFreeFormField={onCreateFreeFormField}
              onCancel={onCancelFreeForm}
              isEditing={isEditing}
            />
          ) : (
            <div className="flex flex-col gap-y-3">
              <Form.Root {...triggerPipelineForm}>
                <form
                  id="variable-node-trigger-pipeline-form"
                  className="w-full"
                  onSubmit={triggerPipelineForm.handleSubmit(onTriggerPipeline)}
                >
                  <VerticalSortableWrapper
                    // we directly use the key as the id, because the key is guarded
                    // but our auto-form, it should be always present
                    items={triggerPipelineFormFields.map((e) => ({
                      key: e.key as string,
                    }))}
                    onDragEnd={(event) => {
                      const { active, over } = event;

                      if (over && active.id !== over.id) {
                        const oldIndex = triggerPipelineFormFields.findIndex(
                          (e) => e.key === active.id,
                        );
                        const newIndex = triggerPipelineFormFields.findIndex(
                          (e) => e.key === over.id,
                        );

                        const newFieldItems = arrayMove(
                          triggerPipelineFormFields,
                          oldIndex,
                          newIndex,
                        );

                        if (newFieldItems.length > 0) {
                          const newNodes = nodes.map((node) => {
                            if (isVariableNode(node)) {
                              const newFields = Object.fromEntries(
                                Object.entries(node.data.fields).map(
                                  ([key, value]) => {
                                    const newFieldIndex =
                                      newFieldItems.findIndex(
                                        (e) => e.key === key,
                                      );

                                    if (newFieldIndex !== -1) {
                                      return [
                                        key,
                                        {
                                          ...value,
                                          instillUiOrder: newFieldIndex,
                                        },
                                      ];
                                    }

                                    return [key, value];
                                  },
                                ),
                              );

                              node.data = {
                                ...node.data,
                                fields: newFields,
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
                      {triggerPipelineFormFields.map((item) => (
                        <NodeSortableFieldWrapper
                          key={item.key}
                          path={item.key as string}
                        >
                          {item}
                        </NodeSortableFieldWrapper>
                      ))}
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
                      : "stroke-semantic-accent-default",
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
