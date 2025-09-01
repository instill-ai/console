"use client";

import * as React from "react";
import {
  InstillJSONSchema,
  isComponentErrorUpdatedEvent,
  isComponentInputUpdatedEvent,
  isComponentOutputUpdatedEvent,
  isComponentStatusUpdatedEvent,
  isPipelineErrorUpdatedEvent,
  isPipelineOutputUpdatedEvent,
  isPipelineStatusUpdatedEvent,
  PipelineRunOnEventMap,
  PipelineStreamStatus,
  PipelineVariableFieldMap,
} from "instill-sdk";
import * as z from "zod";

import { Form } from "@instill-ai/design-system";

import {
  DefaultEditorViewIDs,
  GeneralRecord,
  InstillStore,
  isArtifactRelatedInstillFormat,
  isValidURL,
  Nullable,
  toastInstillError,
  useInstillStore,
  usePipelineTriggerRequestForm,
  useRouteInfo,
  useShallow,
  useStreamingTriggerUserPipeline,
  useStreamingTriggerUserPipelineRelease,
  useUserNamespaces,
} from "../../../lib";
import {
  useGetNamespaceObjectDownloadURL,
  useGetNamespaceObjectUploadURL,
  useUploadAndGetDownloadNamespaceObjectURL,
  useUploadNamespaceObject,
} from "../../../lib/react-query-service";
import {
  getReferencesFromString,
  recursiveHelpers,
} from "../../pipeline-builder";
import { useAutonomousEditorRecipeUpdater } from "../lib";
import { EventField, listenWithType } from "./EventField";
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

export type VariableConnectToRunOnEvent = {
  listens: listenWithType[];
  key: string;
  title: string;
};

export const Input = ({
  fields,
  on,
  outputSchema,
}: {
  fields: Nullable<PipelineVariableFieldMap>;
  on: Nullable<PipelineRunOnEventMap>;
  outputSchema: Nullable<InstillJSONSchema>;
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
  const getNamespaceObjectUploadURL = useGetNamespaceObjectUploadURL();
  const uploadNamespaceObject = useUploadNamespaceObject();
  const getNamespaceObjectDownloadURL = useGetNamespaceObjectDownloadURL();
  const triggerPipelineRelease = useStreamingTriggerUserPipelineRelease();
  const autonomousRecipeUpdater = useAutonomousEditorRecipeUpdater();

  const uploadAndGetDownloadNamespaceObjectURL =
    useUploadAndGetDownloadNamespaceObjectURL();

  const onStreamTriggerPipeline = React.useCallback(
    async (formData: z.infer<typeof Schema>) => {
      if (
        !formData ||
        !fields ||
        !routeInfo.isSuccess ||
        !routeInfo.data.namespaceId ||
        !routeInfo.data.resourceId ||
        !userNamespaces.isSuccess ||
        !accessToken
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

      // Save the recipe if there has unsaved changes
      if (hasUnsavedRecipe) {
        try {
          await autonomousRecipeUpdater();
        } catch (error) {
          console.error("Failed to update pipeline:", error);

          toastInstillError({
            title: "Failed to save pipeline",
            description: "An error occurred while saving the pipeline.",
          });
        }
      }

      forceStopTriggerPipelineStream.current = false;
      updateIsTriggeringPipeline(() => true);

      // Initialize the trigger pipeline stream map
      updateTriggerPipelineStreamMap(() => null);

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

      // For every type of file related fields, we need to upload the file to the artifact
      const uploadedToArtifactKeys: string[] = [];

      Object.entries(fields).forEach(([key, value]) => {
        if (
          value?.instillFormat === "semi-structured/json" ||
          value?.instillFormat === "array:semi-structured/json" ||
          value?.instillFormat === "json" ||
          value?.instillFormat === "array:json"
        ) {
          semiStructuredObjectKeys.push(key);
        }

        if (isArtifactRelatedInstillFormat(value?.instillFormat)) {
          uploadedToArtifactKeys.push(key);
        }
      });

      const parsedStructuredData: GeneralRecord = formData;

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
      // This only happens when the user is on the recipe editor page
      const targetNamespace = userNamespaces.data.find(
        (ns) => ns.id === routeInfo.data.namespaceId,
      );

      // The data comes from the form is either File or URL for these file related fields
      // like image, video, audio, file
      for (const key of uploadedToArtifactKeys) {
        const targetValue = parsedStructuredData[key];
        if (!targetValue) {
          continue;
        }

        if (Array.isArray(targetValue)) {
          const uploadURLs: string[] = [];

          for (const item of targetValue) {
            if (isValidURL(item)) {
              uploadURLs.push(item);
              continue;
            }

            const downloadURL = await uploadAndGetDownloadNamespaceObjectURL({
              namespaceId: routeInfo.data.namespaceId,
              accessToken,
              object: item,
            });

            if (downloadURL) {
              uploadURLs.push(downloadURL.downloadUrl);
            }
          }

          parsedStructuredData[key] = uploadURLs;
        } else {
          if (isValidURL(targetValue)) {
            parsedStructuredData[key] = targetValue;
            continue;
          }
          const downloadURL = await uploadAndGetDownloadNamespaceObjectURL({
            namespaceId: routeInfo.data.namespaceId,
            accessToken,
            object: targetValue,
          });

          if (downloadURL) {
            parsedStructuredData[key] = downloadURL.downloadUrl;
          }
        }
      }

      const input = recursiveHelpers.removeUndefinedAndNullFromArray(
        recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
          parsedStructuredData,
        ),
      );

      const downloadedFromArtifactKeys: string[] = [];

      if (outputSchema && outputSchema.properties) {
        Object.entries(outputSchema.properties).forEach(([key, value]) => {
          if (isArtifactRelatedInstillFormat(value?.instillFormat)) {
            downloadedFromArtifactKeys.push(key);
          }
        });
      }

      try {
        let response: Response;
        if (currentVersion !== "latest" && currentVersion) {
          response = await triggerPipelineRelease.mutateAsync({
            namespaceId: routeInfo.data.namespaceId,
            pipelineId: routeInfo.data.resourceId,
            releaseId: currentVersion,
            accessToken,
            inputs: [input],
            returnTraces: true,
            requesterUid: targetNamespace ? targetNamespace.uid : undefined,
          });
        } else {
          response = await triggerPipeline.mutateAsync({
            namespaceId: routeInfo.data.namespaceId,
            pipelineId: routeInfo.data.resourceId,
            accessToken,
            inputs: [input],
            returnTraces: true,
            requesterUid: targetNamespace ? targetNamespace.uid : undefined,
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

                const newComponent: GeneralRecord = {};
                let newPipelineOutput: GeneralRecord = {};
                let newPipelineStatus: PipelineStreamStatus | undefined;

                for (const event of events) {
                  if (isPipelineStatusUpdatedEvent(event)) {
                    newPipelineStatus = event.data.status;
                  }

                  if (isPipelineOutputUpdatedEvent(event)) {
                    newPipelineOutput = event.data.output;

                    // Temp disable since the blob download URL's auth is currently
                    // disabled and is controlled by the expiration date
                    // for (const key of downloadedFromArtifactKeys) {
                    //   const targetValue = newPipelineOutput[key];

                    //   if (!targetValue) {
                    //     continue;
                    //   }

                    //   if (Array.isArray(targetValue)) {
                    //     const downloadedArtifacts: string[] = [];
                    //     for (const item of targetValue) {
                    //       if (
                    //         isValidURL(item) &&
                    //         isDownloadableArtifactBlobURL(item)
                    //       ) {
                    //         const response =
                    //           await downloadNamespaceObject.mutateAsync({
                    //             payload: {
                    //               downloadUrl: item,
                    //             },
                    //             accessToken,
                    //           });

                    //         if (!response.ok) {
                    //           continue;
                    //         }

                    //         const blob = await response.blob();
                    //         const url = URL.createObjectURL(blob);
                    //         downloadedArtifacts.push(url);
                    //       }
                    //     }
                    //     newPipelineOutput[key] = downloadedArtifacts;
                    //   } else {
                    //     if (
                    //       isValidURL(targetValue) &&
                    //       isDownloadableArtifactBlobURL(targetValue)
                    //     ) {
                    //       const response =
                    //         await downloadNamespaceObject.mutateAsync({
                    //           payload: {
                    //             downloadUrl: targetValue,
                    //           },
                    //           accessToken,
                    //         });

                    //       if (!response.ok) {
                    //         continue;
                    //       }

                    //       const blob = await response.blob();
                    //       const url = URL.createObjectURL(blob);
                    //       newPipelineOutput[key] = url;
                    //     }
                    //   }
                    // }
                  }

                  if (isComponentStatusUpdatedEvent(event)) {
                    newComponent[event.data.componentID] = {
                      status: event.data.status,
                    };
                  }

                  if (isComponentOutputUpdatedEvent(event)) {
                    newComponent[event.data.componentID] = {
                      output: event.data.output,
                      status: event.data.status,
                    };
                  }

                  if (isComponentErrorUpdatedEvent(event)) {
                    newComponent[event.data.componentID] = {
                      status: event.data.status,
                      error: event.data.error,
                    };
                  }

                  if (isComponentInputUpdatedEvent(event)) {
                    newComponent[event.data.componentID] = {
                      input: event.data.input,
                      status: event.data.status,
                    };
                  }

                  if (isPipelineErrorUpdatedEvent(event)) {
                    if (event.data.status.errored) {
                      updateIsTriggeringPipeline(() => false);

                      toastInstillError({
                        title: "Something went wrong when trigger the pipeline",
                        description: event.data.error?.message ?? undefined,
                      });
                    }
                  }
                }

                updateTriggerPipelineStreamMap((prev) => {
                  // We need to merge the old component with the new component
                  const mergedComponent: GeneralRecord = prev?.component ?? {};

                  for (const [key, value] of Object.entries(newComponent)) {
                    if (mergedComponent[key]) {
                      mergedComponent[key] =
                        newPipelineStatus?.completed === true
                          ? {
                              ...mergedComponent[key],
                              ...value,
                              status: {
                                ...mergedComponent[key].status,
                                completed: true,
                              },
                            }
                          : {
                              ...mergedComponent[key],
                              ...value,
                            };
                    } else {
                      mergedComponent[key] =
                        newPipelineStatus?.completed === true
                          ? {
                              ...value,
                              status: {
                                ...value.status,
                                completed: true,
                              },
                            }
                          : value;
                    }
                  }

                  return {
                    ...prev,
                    component: mergedComponent,
                    pipeline: newPipelineStatus
                      ? {
                          ...prev?.pipeline,
                          status: newPipelineStatus,
                          output: {
                            ...prev?.pipeline?.output,
                            ...newPipelineOutput,
                          },
                        }
                      : {
                          ...prev?.pipeline,
                          output: {
                            ...prev?.pipeline?.output,
                            ...newPipelineOutput,
                          },
                        },
                  };
                });
              }
            }
          }
        } finally {
          streamReader.releaseLock();
        }
      } catch (error) {
        console.error(error);

        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          description: "An error occurred while triggering the pipeline.",
        });

        return;
      } finally {
        updateIsTriggeringPipeline(() => false);
      }
    },
    [
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
      triggerPipelineRelease,
      autonomousRecipeUpdater,
      getNamespaceObjectUploadURL,
      uploadNamespaceObject,
      getNamespaceObjectDownloadURL,
      hasUnsavedRecipe,
      outputSchema,
    ],
  );

  const variablesConnectToRunOnEvent = React.useMemo(() => {
    if (!on || !fields) {
      return [];
    }

    const variablesConnectToRunOnEvent: VariableConnectToRunOnEvent[] = [];

    Object.entries(fields).forEach(([key, value]) => {
      if (!value) {
        return;
      }

      if (value.listen) {
        const listensWithType: listenWithType[] = [];

        for (const listenItem of value.listen) {
          const reference = getReferencesFromString(listenItem)[0];
          if (!reference) {
            continue;
          }

          // The referenceValue will looks like ${on.slack-0.message.text}
          const referenceValueFrag =
            reference.referenceValue.withoutCurlyBraces.split(".");
          const eventKey = referenceValueFrag[1];
          const eventType = eventKey ? on[eventKey] : undefined;

          if (eventType) {
            listensWithType.push({
              reference: listenItem,
              type: eventType.type,
            });
          }
        }

        variablesConnectToRunOnEvent.push({
          listens: listensWithType,
          key,
          title: value.title,
        });
      }
    });

    return variablesConnectToRunOnEvent;
  }, [on, fields]);

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
          <div className="flex flex-col gap-y-4">
            {variablesConnectToRunOnEvent.map((variable) => (
              <EventField
                title={variable.title ?? variable.key}
                key={variable.key}
                listensWithType={variable.listens}
              />
            ))}
            {fieldItems}
          </div>
        </form>
      </Form.Root>
    </div>
  );
};
