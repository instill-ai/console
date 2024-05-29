import * as React from "react";
import * as z from "zod";
import cn from "clsx";
import {
  GeneralRecord,
  InstillStore,
  Nullable,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useInstillStore,
  usePipelineTriggerRequestForm,
  useShallow,
  useTriggerUserPipeline,
  useTriggerUserPipelineRelease,
} from "../../../../lib";
import { LeftSidebarCollapsible } from "./collapsible";
import {
  composeEdgesFromNodes,
  isTriggerNode,
  recursiveHelpers,
} from "../../lib";
import {
  TriggerNodeFreeForm,
  TriggerNodeFreeFormSchema,
} from "../nodes/trigger-node/TriggerNodeFreeForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { triggerNodeFields } from "../nodes/trigger-node/triggerNodeFields";
import { Button, Form, Icons, useToast } from "@instill-ai/design-system";
import { VerticalSortableWrapper } from "../VerticalSortableWrapper";
import { arrayMove } from "@dnd-kit/sortable";
import { VariableSortableItemWrapper } from "./variable-sortable-item-wrapper";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateRecentlyUsedStartComponentFieldTypes:
    store.updateRecentlyUsedStartComponentFieldTypes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  pipelineName: store.pipelineName,
  updateIsTriggeringPipeline: store.updateIsTriggeringPipeline,
  currentVersion: store.currentVersion,
  accessToken: store.accessToken,
  updateTestModeTriggerResponse: store.updateTestModeTriggerResponse,
  pipelineVariable: store.pipelineVariable,
  updatePipelineVariable: store.updatePipelineVariable,
});

export const VariableSection = () => {
  const {
    nodes,
    updateRecentlyUsedStartComponentFieldTypes,
    updateEdges,
    updateNodes,
    updatePipelineRecipeIsDirty,
    pipelineName,
    updateIsTriggeringPipeline,
    currentVersion,
    accessToken,
    updateTestModeTriggerResponse,
    pipelineVariable,
    updatePipelineVariable,
  } = useInstillStore(useShallow(selector));
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { toast } = useToast();

  const [selectedType, setSelectedType] =
    React.useState<Nullable<string>>(null);
  const [currentEditingFieldKey, setCurrentEditingFieldKey] =
    React.useState<Nullable<string>>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  const form = useForm<z.infer<typeof TriggerNodeFreeFormSchema>>({
    resolver: zodResolver(TriggerNodeFreeFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onEditFreeFormField = (key: string) => {
    if (!pipelineVariable) return;

    setCurrentEditingFieldKey(key);
    form.reset({
      title: pipelineVariable[key].title,
      key,
      description: pipelineVariable[key].description,
    });
    setIsEditing(true);

    let newSelectedType = pipelineVariable[key].instillFormat;

    if (
      newSelectedType === "string" &&
      pipelineVariable[key].instillUiMultiline
    ) {
      newSelectedType = "long_string";
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
      if (isTriggerNode(node)) {
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
    formData: z.infer<typeof TriggerNodeFreeFormSchema>
  ) {
    if (!selectedType) {
      return;
    }

    const field = triggerNodeFields[selectedType].getFieldConfiguration(
      formData.title,
      formData.description
    );

    if (!pipelineVariable) {
      updatePipelineVariable(() => ({
        [formData.key]: field,
      }));

      return;
    }

    if (Object.keys(pipelineVariable).includes(formData.key)) {
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

    if (!triggerNodeFields[selectedType]) {
      return;
    }

    updateRecentlyUsedStartComponentFieldTypes((prev) => {
      if (!prev.includes(selectedType)) {
        return [...prev, selectedType];
      }
      return prev;
    });

    const newNodes = nodes.map((node) => {
      if (isTriggerNode(node) && field) {
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

  const [disabledReferenceHint] = React.useState(false);

  const {
    Schema: TriggerPipelineFormSchema,
    fieldItems: triggerPipelineFormFields,
    form: triggerPipelineForm,
  } = usePipelineTriggerRequestForm({
    mode: "build",
    fields: pipelineVariable ?? null,
    onDeleteField: onDeleteFreeFormField,
    onEditField: onEditFreeFormField,
    disabledReferenceHint,
  });

  const triggerUserPipeline = useTriggerUserPipeline();
  const triggerUserPipelineRelease = useTriggerUserPipelineRelease();
  async function onTriggerPipeline(
    formData: z.infer<typeof TriggerPipelineFormSchema>
  ) {
    if (!pipelineName || !formData || !pipelineVariable) return;

    const input = recursiveHelpers.removeUndefinedAndNullFromArray(
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(formData)
    );

    // Backend need to have the encoded JSON input. So we need to double check
    // the metadata whether this field is a semi-structured object and parse it

    const semiStructuredObjectKeys: string[] = [];

    Object.entries(pipelineVariable).forEach(([key, value]) => {
      if (value.instillFormat === "semi-structured/json") {
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

    if (currentVersion === "latest") {
      try {
        const data = await triggerUserPipeline.mutateAsync({
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
        const data = await triggerUserPipelineRelease.mutateAsync({
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

  return (
    <LeftSidebarCollapsible title="Variables">
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
              id="trigger-node-trigger-pipeline-form"
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
                      (e) => e.key === active.id
                    );
                    const newIndex = triggerPipelineFormFields.findIndex(
                      (e) => e.key === over.id
                    );

                    const newFieldItems = arrayMove(
                      triggerPipelineFormFields,
                      oldIndex,
                      newIndex
                    );

                    if (newFieldItems.length > 0) {
                      updatePipelineVariable((prev) => {
                        if (!prev) return null;
                        return Object.fromEntries(
                          Object.entries(prev).map(([key, value]) => {
                            const newFieldIndex = newFieldItems.findIndex(
                              (e) => e.key === key
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
                          })
                        );
                      });
                      updatePipelineRecipeIsDirty(() => true);
                    }
                  }
                }}
              >
                <div className="flex flex-col gap-y-4">
                  {triggerPipelineFormFields.map((item) => (
                    <VariableSortableItemWrapper
                      key={item.key}
                      path={item.key as string}
                    >
                      {item}
                    </VariableSortableItemWrapper>
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
            type="button"
          >
            <p className="my-auto pt-0.5">Add Field</p>
            <Icons.Plus
              className={cn(
                "my-auto h-4 w-4 stroke-semantic-accent-default",
                "stroke-semantic-accent-default"
              )}
            />
          </Button>
        </div>
      )}
    </LeftSidebarCollapsible>
  );
};
