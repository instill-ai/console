"use client";

import * as React from "react";
import {
  isComponentErrorUpdatedEvent,
  isComponentInputUpdatedEvent,
  isComponentOutputUpdatedEvent,
  isComponentStatusUpdatedEvent,
  isPipelineErrorUpdatedEvent,
  isPipelineOutputUpdatedEvent,
  isPipelineStatusUpdatedEvent,
  PipelineVariableFieldMap,
} from "instill-sdk";
import * as z from "zod";

import { Form, useToast } from "@instill-ai/design-system";

import {
  DefaultEditorViewIDs,
  GeneralRecord,
  InstillStore,
  Nullable,
  useInstillStore,
  usePipelineTriggerRequestForm,
  useRouteInfo,
  useShallow,
  useStreamingTriggerUserPipeline,
  useStreamingTriggerUserPipelineRelease,
  useUserNamespaces,
} from "../../../lib";
import { recursiveHelpers } from "../../pipeline-builder";
import { useAutonomousEditorRecipeUpdater } from "../lib";
import { parseEventReadableStream } from "./parseEventReadableStream";

const selector = (store: InstillStore) => ({
  isTriggeringPipeline: store.isTriggeringPipeline,
  updateIsTriggeringPipeline: store.updateIsTriggeringPipeline,
  accessToken: store.accessToken,
  updateTriggerPipelineStreamMap: store.updateTriggerPipelineStreamMap,
  updateEditorMultiScreenModel: store.updateEditorMultiScreenModel,
  currentVersion: store.currentVersion,
  hasUnsavedRecipe: store.hasUnsavedRecipe,
});

export const Input = ({
  fields,
  pipelineName,
}: {
  pipelineName: Nullable<string>;
  fields: Nullable<PipelineVariableFieldMap>;
}) => {
  const {
    isTriggeringPipeline,
    updateIsTriggeringPipeline,
    accessToken,
    updateTriggerPipelineStreamMap,
    updateEditorMultiScreenModel,
    currentVersion,
    hasUnsavedRecipe,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();
  const forceStopTriggerPipelineStream = React.useRef(false);

  const { Schema, fieldItems, form } = usePipelineTriggerRequestForm({
    mode: "build",
    fields: fields,
    onDeleteField: () => {},
    onEditField: () => {},
    disabledFieldControls: true,
    disabledReferenceHint: true,
    forceStringMultiline: true,
  });

  const routeInfo = useRouteInfo();
  const userNamespaces = useUserNamespaces();
  const triggerPipeline = useStreamingTriggerUserPipeline();
  const triggerPipelineRelease = useStreamingTriggerUserPipelineRelease();
  const autonomousRecipeUpdater = useAutonomousEditorRecipeUpdater();
  const onStreamTriggerPipeline = React.useCallback(
    async (formData: z.infer<typeof Schema>) => {
      if (
        !pipelineName ||
        !formData ||
        !fields ||
        !routeInfo.isSuccess ||
        !userNamespaces.isSuccess
      ) {
        return;
      }

      if (isTriggeringPipeline) {
        forceStopTriggerPipelineStream.current = true;
        updateIsTriggeringPipeline(() => false);
        updateTriggerPipelineStreamMap((prev) => ({
          component: {},
          pipeline: {
            status: {
              completed: false,
              started: false,
              errored: false,
              skipped: false,
            },
            output: prev?.pipeline?.output ? prev.pipeline.output : {},
          },
        }));
        return;
      }

      // Save the recipe is there has unsaved changes
      if (hasUnsavedRecipe) {
        try {
          await autonomousRecipeUpdater();
        } catch (error) {
          console.error("Failed to update pipeline:", error);
          toast({
            title: "Failed to save pipeline",
            description: "An error occurred while saving the pipeline.",
            variant: "alert-error",
          });
        }
      }

      forceStopTriggerPipelineStream.current = false;
      updateIsTriggeringPipeline(() => true);

      // Initialize the trigger pipeline stream map
      updateTriggerPipelineStreamMap(() => null);

      const input = recursiveHelpers.removeUndefinedAndNullFromArray(
        recursiveHelpers.replaceNullAndEmptyStringWithUndefined(formData),
      );

      updateEditorMultiScreenModel((prev) => ({
        ...prev,
        bottomRight: {
          ...prev.bottomRight,
          currentViewId: DefaultEditorViewIDs.MAIN_OUTPUT,
        },
      }));

      // Backend need to have the encoded JSON input. So we need to double check
      // the metadata whether this field is a semi-structured object and parse it

      const semiStructuredObjectKeys: string[] = [];

      Object.entries(fields).forEach(([key, value]) => {
        if (
          value?.instillFormat === "semi-structured/json" ||
          value?.instillFormat === "array:semi-structured/json" ||
          value?.instillFormat === "json" ||
          value?.instillFormat === "array:json"
        ) {
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
          form.setError(key, {
            type: "manual",
            message: "Invalid JSON format",
          });
          return;
        }
      }

      // We use the current route namespace as the requester namespace
      const tartgetNamespace = userNamespaces.data.find(
        (ns) => ns.id === routeInfo.data.namespaceId,
      );

      try {
        let response: Response;
        if (currentVersion !== "latest") {
          response = await triggerPipelineRelease.mutateAsync({
            namespacePipelineReleaseName: `${pipelineName}/releases/${currentVersion}`,
            accessToken,
            inputs: [parsedStructuredData],
            returnTraces: true,
            requesterUid: tartgetNamespace ? tartgetNamespace.uid : undefined,
          });
        } else {
          response = await triggerPipeline.mutateAsync({
            namespacePipelineName: pipelineName,
            accessToken,
            inputs: [parsedStructuredData],
            returnTraces: true,
            requesterUid: tartgetNamespace ? tartgetNamespace.uid : undefined,
          });
        }

        if (!response || !response.body) {
          return;
        }

        // Read the stream
        const reader = response.body.getReader();
        const stream = new ReadableStream({
          async start(controller) {
            // We need this while loop to keep reading the stream
            /* eslint-disable-next-line no-constant-condition */
            while (true) {
              const { done, value } = await reader.read();
              if (done || forceStopTriggerPipelineStream.current) {
                break;
              }
              controller.enqueue(value);
            }
            controller.close();
            reader.releaseLock();
          },
        });

        const streamReader = stream.getReader();
        let buffer = "";

        // Parse the stream
        try {
          // We need this while loop to keep reading the stream
          /* eslint-disable-next-line no-constant-condition */
          while (true) {
            const { done, value } = await streamReader.read();
            if (done) {
              break;
            }
            // Append the new chunk to the buffer
            buffer += new TextDecoder().decode(value);

            // Split the buffer into complete events
            const eventStrings = buffer.split("\n\n");

            // The last element might be incomplete, so we keep it in the buffer
            buffer = eventStrings.pop() || "";

            for (const eventString of eventStrings) {
              if (eventString.trim()) {
                const events = parseEventReadableStream(eventString);

                updateTriggerPipelineStreamMap((prev) => {
                  let newTriggerPipelineStreamMap = prev;
                  for (const event of events) {
                    if (isPipelineStatusUpdatedEvent(event)) {
                      newTriggerPipelineStreamMap = {
                        pipeline: {
                          ...newTriggerPipelineStreamMap?.pipeline,
                          status: event.data.status,
                        },
                        component: newTriggerPipelineStreamMap?.component
                          ? newTriggerPipelineStreamMap.component
                          : {},
                      };
                    }

                    if (isPipelineOutputUpdatedEvent(event)) {
                      newTriggerPipelineStreamMap = {
                        pipeline: {
                          ...newTriggerPipelineStreamMap?.pipeline,
                          output: event.data.output,
                        },
                        component: newTriggerPipelineStreamMap?.component
                          ? newTriggerPipelineStreamMap.component
                          : {},
                      };
                    }

                    if (isComponentStatusUpdatedEvent(event)) {
                      const targetComponent =
                        newTriggerPipelineStreamMap?.component?.[
                          event.data.componentID
                        ];

                      newTriggerPipelineStreamMap = {
                        pipeline: newTriggerPipelineStreamMap?.pipeline,
                        component: {
                          ...newTriggerPipelineStreamMap?.component,
                          [event.data.componentID]: {
                            ...targetComponent,
                            status: event.data.status,
                          },
                        },
                      };
                    }

                    if (isComponentOutputUpdatedEvent(event)) {
                      const targetComponent =
                        newTriggerPipelineStreamMap?.component?.[
                          event.data.componentID
                        ];

                      newTriggerPipelineStreamMap = {
                        pipeline: newTriggerPipelineStreamMap?.pipeline,
                        component: {
                          ...newTriggerPipelineStreamMap?.component,
                          [event.data.componentID]: {
                            ...targetComponent,
                            output: event.data.output,
                            status: event.data.status,
                          },
                        },
                      };
                    }

                    if (isComponentErrorUpdatedEvent(event)) {
                      const targetComponent =
                        newTriggerPipelineStreamMap?.component?.[
                          event.data.componentID
                        ];

                      newTriggerPipelineStreamMap = {
                        pipeline: newTriggerPipelineStreamMap?.pipeline,
                        component: {
                          ...newTriggerPipelineStreamMap?.component,
                          [event.data.componentID]: {
                            ...targetComponent,
                            error: event.data.error,
                            status: event.data.status,
                          },
                        },
                      };
                    }

                    if (isComponentInputUpdatedEvent(event)) {
                      const targetComponent =
                        newTriggerPipelineStreamMap?.component?.[
                          event.data.componentID
                        ];

                      newTriggerPipelineStreamMap = {
                        pipeline: newTriggerPipelineStreamMap?.pipeline,
                        component: {
                          ...newTriggerPipelineStreamMap?.component,
                          [event.data.componentID]: {
                            ...targetComponent,
                            input: event.data.input,
                            status: event.data.status,
                          },
                        },
                      };
                    }
                  }

                  return newTriggerPipelineStreamMap;
                });

                for (const event of events) {
                  if (isPipelineStatusUpdatedEvent(event)) {
                    if (event.data.status.completed) {
                      updateIsTriggeringPipeline(() => false);

                      // update all the component status to be completed
                      updateTriggerPipelineStreamMap((prev) => {
                        if (!prev || !prev.component) {
                          return prev;
                        }

                        const newComponent: GeneralRecord = {};

                        Object.entries(prev.component).forEach(
                          ([key, value]) => {
                            if (value && value.status) {
                              if (value.status.errored) {
                                newComponent[key] = value;
                              } else {
                                newComponent[key] = {
                                  ...value,
                                  status: {
                                    ...value.status,
                                    completed: true,
                                  },
                                };
                              }
                            }
                          },
                        );

                        const newTriggerPipelineStreamMap = {
                          ...prev,
                          component: newComponent,
                        };

                        return newTriggerPipelineStreamMap;
                      });
                    }
                  }

                  if (isPipelineErrorUpdatedEvent(event)) {
                    if (event.data.status.errored) {
                      updateIsTriggeringPipeline(() => false);
                      toast({
                        title: "Something went wrong when trigger the pipeline",
                        variant: "alert-error",
                        size: "large",
                        description: event.data.error?.message ?? undefined,
                        duration: 15000,
                      });
                    }
                  }
                }
              }
            }
          }
        } finally {
          streamReader.releaseLock();
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Something went wrong when trigger the pipeline",
          variant: "alert-error",
          size: "small",
          duration: 15000,
        });
        return;
      } finally {
        updateIsTriggeringPipeline(() => false);
      }
    },
    [
      pipelineName,
      fields,
      form,
      triggerPipeline,
      isTriggeringPipeline,
      updateIsTriggeringPipeline,
      updateTriggerPipelineStreamMap,
      userNamespaces.isSuccess,
      userNamespaces.data,
      accessToken,
      forceStopTriggerPipelineStream,
      updateEditorMultiScreenModel,
      routeInfo.data,
      routeInfo.isSuccess,
      currentVersion,
      toast,
      triggerPipelineRelease,
    ],
  );

  return (
    <div className="flex flex-col w-full">
      <h3 className="py-2 product-body-text-1-semibold text-semantic-fg-primary">
        Input
      </h3>
      <div className="flex w-full flex-row border-b border-semantic-bg-line mb-3 box-border">
        <p
          className="font-fans text-sm border-b-[2px] py-1 pb-2 border-semantic-accent-default"
          style={{ color: "#5F6D86" }}
        >
          Form
        </p>
      </div>
      <Form.Root {...form}>
        <form
          id="variable-node-trigger-pipeline-form"
          className="w-full"
          onSubmit={form.handleSubmit(onStreamTriggerPipeline)}
        >
          <div className="flex flex-col gap-y-4">{fieldItems}</div>
        </form>
      </Form.Root>
    </div>
  );
};
