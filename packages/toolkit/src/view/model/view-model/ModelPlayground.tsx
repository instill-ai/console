"use client";

import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Operation } from "instill-sdk";
import { z } from "zod";

import {
  Button,
  Form,
  Icons,
  Nullable,
  TabMenu,
  useToast,
} from "@instill-ai/design-system";

import {
  CodeBlock,
  LoadingSpin,
  ModelSectionHeader,
} from "../../../components";
import { defaultCodeSnippetStyles } from "../../../constant";
import {
  convertSentenceToCamelCase,
  InstillStore,
  Model,
  ModelState,
  ModelTask,
  onTriggerInvalidateCredits,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useAuthenticatedUser,
  useComponentOutputFields,
  useInstillForm,
  useInstillStore,
  useModelVersionTriggerResult,
  useNavigateBackAfterLogin,
  useQueryClient,
  useRouteInfo,
  useShallow,
  useTriggerUserModelVersionAsync,
  useUserNamespaces,
} from "../../../lib";
import { recursiveHelpers } from "../../pipeline-builder";
import { getStatusMessage, OPERATION_POLL_TIMEOUT } from "./constants";

export type ModelOutputActiveView = "preview" | "json";

export type ModelPlaygroundProps = {
  model?: Model;
  modelState: Nullable<ModelState>;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const convertTaskNameToPayloadPropName = (taskName?: ModelTask) =>
  taskName
    ? convertSentenceToCamelCase(
        // This removes "TASK_" and replaces "_" with a space. The first
        // argument has and OR operator for matching both substrings. The second
        // argument is a function with a condition.
        taskName.replace(/TASK_|_/g, (d) => (d === "TASK_" ? "" : " ")),
      )
    : null;

export const convertValuesToString = (props: Record<string, unknown>) => {
  const convertedProps: Record<string, unknown> = {};

  for (const key in props) {
    if (typeof props[key] === "number") {
      convertedProps[key] = JSON.stringify(props[key]);
    } else {
      convertedProps[key] = props[key] as string;
    }
  }

  return convertedProps;
};

const defaultCurrentOperationIdPollingData = {
  name: null,
  timeoutRunning: false,
  isRendered: false,
  modelVersion: null,
};

export const ModelPlayground = ({
  model,
  modelState,
}: ModelPlaygroundProps) => {
  const routeInfo = useRouteInfo();
  const searchParams = useSearchParams();
  const activeVersion = searchParams.get("version");
  const queryClient = useQueryClient();
  // This ref is used here to store the currently active operation id. It's in
  // ref so we don't have to worry about stale data. As soon as we update the
  // ref, it has new value and the very next render cycle will already have
  // the fresh data.
  const currentOperationIdPollingData = React.useRef<{
    name: Nullable<string>;
    timeoutRunning: boolean;
    isRendered: boolean;
    modelVersion: Nullable<string>;
  }>({
    name: null,
    timeoutRunning: false,
    isRendered: false,
    modelVersion: null,
  });
  const { toast } = useToast();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [isModelRunInProgress, setIsModelRunInProgress] = useState(true);
  const [outputActiveView, setOutputActiveView] =
    useState<ModelOutputActiveView>("preview");
  const taskPropName = useMemo(
    () => convertTaskNameToPayloadPropName(model?.task),
    [model],
  );
  const [modelRunResult, setModelRunResult] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [inputFromExistingResult, setInputFromExistingResult] = useState<Record<
    string,
    unknown
    // Stupid hack, because the model name field needs to use the models' name
  > | null>({ data: { model: model?.id } });
  const [existingTriggerState, setExistingTriggerState] =
    useState<Nullable<Operation>>(null);
  const { accessToken, enabledQuery, navigationNamespaceAnchor } =
    useInstillStore(useShallow(selector));

  const navigateBackAfterLogin = useNavigateBackAfterLogin();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const namespaces = useUserNamespaces();

  const isModelTriggerable = useMemo(() => {
    return accessToken && model && modelState
      ? model.permission.canTrigger &&
          !isModelRunInProgress &&
          !["STATE_UNSPECIFIED", "STATE_ERROR"].includes(modelState)
      : false;
  }, [modelState, model, isModelRunInProgress, accessToken]);

  const { form, fields, ValidatorSchema } = useInstillForm(
    model?.inputSchema || null,
    inputFromExistingResult,
    {
      disabledAll: !isModelTriggerable,
      stringifyDefaultValue: false,
    },
  );

  const existingModelTriggerResult = useModelVersionTriggerResult({
    accessToken,
    modelId: model?.id || null,
    userId: routeInfo.data.namespaceId,
    versionId: activeVersion,
    view: "VIEW_FULL",
    enabled: !!activeVersion && enabledQuery,
  });

  const pollForResponse = React.useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["models", "operation", model?.name],
    });

    existingModelTriggerResult.refetch();
  }, [model?.name, queryClient, existingModelTriggerResult]);

  useEffect(() => {
    if (activeVersion !== currentOperationIdPollingData.current.modelVersion) {
      currentOperationIdPollingData.current =
        defaultCurrentOperationIdPollingData;
      setExistingTriggerState(null);
      setInputFromExistingResult(null);
      setModelRunResult(null);
    }
  }, [activeVersion]);

  useEffect(() => {
    if (
      !accessToken ||
      (existingModelTriggerResult.isSuccess &&
        !currentOperationIdPollingData.current.name &&
        !existingModelTriggerResult.data.operation)
    ) {
      setIsModelRunInProgress(false);
    }

    if (
      !accessToken ||
      !existingModelTriggerResult.isSuccess ||
      !existingModelTriggerResult.data.operation ||
      (currentOperationIdPollingData.current.name &&
        existingModelTriggerResult.data?.operation?.name !==
          currentOperationIdPollingData.current.name)
    ) {
      return;
    }

    if (!existingModelTriggerResult.data?.operation?.done) {
      if (!currentOperationIdPollingData.current.timeoutRunning) {
        currentOperationIdPollingData.current = {
          ...currentOperationIdPollingData.current,
          timeoutRunning: true,
        };

        setTimeout(() => {
          currentOperationIdPollingData.current = {
            ...currentOperationIdPollingData.current,
            timeoutRunning: false,
          };

          pollForResponse();
        }, OPERATION_POLL_TIMEOUT);
      }
    } else {
      if (
        existingTriggerState?.done !==
          existingModelTriggerResult.data.operation.done &&
        (!currentOperationIdPollingData.current.name ||
          existingModelTriggerResult.data.operation.name ===
            currentOperationIdPollingData.current.name)
      ) {
        setExistingTriggerState(existingModelTriggerResult.data.operation);
      }
    }
  }, [
    existingTriggerState,
    existingModelTriggerResult.isSuccess,
    existingModelTriggerResult.data,
    accessToken,
    pollForResponse,
  ]);

  useEffect(() => {
    if (!existingTriggerState || !model) {
      return;
    }

    if (!existingTriggerState.done) {
      if (!currentOperationIdPollingData.current.timeoutRunning) {
        pollForResponse();
      }
    } else {
      if (!currentOperationIdPollingData.current.isRendered) {
        currentOperationIdPollingData.current = {
          ...currentOperationIdPollingData.current,
          isRendered: true,
        };

        const taskPropName = convertTaskNameToPayloadPropName(
          model.task,
        ) as string;

        setInputFromExistingResult(
          convertValuesToString(
            existingTriggerState.response?.request.taskInputs[0]?.[
              taskPropName
            ],
          ),
        );
        setModelRunResult(
          existingTriggerState.response?.response.taskOutputs[0]?.[
            taskPropName
          ],
        );

        setIsModelRunInProgress(false);
      }
    }

    if (!currentOperationIdPollingData.current.name) {
      currentOperationIdPollingData.current = {
        ...defaultCurrentOperationIdPollingData,
        name: existingTriggerState.name,
        modelVersion: existingTriggerState.response?.request.version || null,
      };
    }
  }, [existingTriggerState, model, pollForResponse]);

  const triggerModel = useTriggerUserModelVersionAsync();

  async function onRunModel(
    formData: Record<string, unknown> /* z.infer<typeof Schema> */,
  ) {
    if (!model || !model.name || !taskPropName) return;

    let parsedData;

    try {
      parsedData = ValidatorSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err);
      }

      return;
    }

    setIsModelRunInProgress(true);

    const input = recursiveHelpers.removeUndefinedAndNullFromArray(
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
        recursiveHelpers.parseToNum(parsedData),
      ),
    );

    const targetNamespace = namespaces.find(
      (namespace) => namespace.id === navigationNamespaceAnchor,
    );

    if (!targetNamespace || !routeInfo.data.namespaceId) {
      return;
    }

    try {
      const data = await triggerModel.mutateAsync({
        modelId: model.id,
        userId: routeInfo.data.namespaceId,
        accessToken,
        payload: {
          taskInputs: [input],
        },
        requesterUid: targetNamespace ? targetNamespace.uid : undefined,
        versionId: activeVersion,
      });

      onTriggerInvalidateCredits({
        ownerName: targetNamespace.name ?? null,
        namespaceNames: namespaces.map((namespace) => namespace.name),
        queryClient,
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("trigger_model", {
          page_url: window.location.href,
        });
      }

      currentOperationIdPollingData.current = {
        ...defaultCurrentOperationIdPollingData,
        name: data.operation.name,
      };

      setExistingTriggerState(data.operation);
    } catch (error) {
      setIsModelRunInProgress(false);

      toastInstillError({
        title: "Something went wrong when triggering the model",
        error,
        toast,
      });
    }
  }

  const playgroundModelTriggerFormID = "model-details-page-trigger-model-form";

  const componentOutputFields = useComponentOutputFields({
    mode: "demo",
    schema: model?.outputSchema || {},
    data: modelRunResult || null,
  });

  return (
    <div className="flex flex-row">
      <div className="flex w-1/2 flex-col border-r border-semantic-bg-line pb-6 pr-6">
        <ModelSectionHeader className="mb-3">Input</ModelSectionHeader>
        <TabMenu.Root
          value={"form"}
          onValueChange={() => null}
          disabledDeSelect={true}
          className="pointer-events-none mb-3 border-b border-semantic-bg-line"
        >
          <TabMenu.Item value="form">
            <span className="text-sm text-semantic-accent-default">Form</span>
          </TabMenu.Item>
        </TabMenu.Root>
        <Form.Root {...form}>
          <form
            id={playgroundModelTriggerFormID}
            className="w-full"
            onSubmit={form.handleSubmit(onRunModel)}
          >
            <div className="mb-5 flex flex-col gap-y-5">{fields}</div>
            <div className="flex flex-row-reverse">
              {me.isSuccess ? (
                <Button
                  disabled={!isModelTriggerable || isModelRunInProgress}
                  type="submit"
                  size="md"
                  variant="secondaryColour"
                >
                  Run
                  {isModelRunInProgress ? (
                    <LoadingSpin className="ml-2 !h-4 !w-4 !text-semantic-accent-hover" />
                  ) : (
                    <Icons.Play className="ml-2 h-4 w-4 stroke-semantic-accent-hover" />
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    navigateBackAfterLogin();
                  }}
                  className="!h-8 !normal-case"
                  variant="secondaryColour"
                  size="md"
                >
                  Log in to Run
                </Button>
              )}
            </div>
          </form>
        </Form.Root>
      </div>
      <div className="flex w-1/2 flex-col pb-6 pl-6">
        <ModelSectionHeader className="mb-3">Output</ModelSectionHeader>
        {isModelRunInProgress ? (
          <div className="flex flex-col items-center justify-center">
            <LoadingSpin className="!text-semantic-accent-hover !mb-10 !w-20 !h-20" />
            <p className="text-semantic-fg-primary product-headings-heading-2 mb-2">
              Running
            </p>
            <div className="text-center product-body-text-2-regular">
              {getStatusMessage(modelState, model?.hardware || "CPU")}
            </div>
          </div>
        ) : modelRunResult ? (
          <React.Fragment>
            <TabMenu.Root
              value={outputActiveView}
              onValueChange={(value: Nullable<string>) =>
                setOutputActiveView(value as ModelOutputActiveView)
              }
              disabledDeSelect={true}
              className="mb-3 border-b border-semantic-bg-line"
            >
              <TabMenu.Item
                value="preview"
                className="hover:!text-semantic-accent-default data-[selected=true]:!text-semantic-accent-default"
              >
                <span className="text-sm">Preview</span>
              </TabMenu.Item>
              <TabMenu.Item
                value="json"
                className="hover:!text-semantic-accent-default data-[selected=true]:!text-semantic-accent-default"
              >
                <span className="text-sm">JSON</span>
              </TabMenu.Item>
            </TabMenu.Root>
            {outputActiveView === "preview" ? (
              <div className="flex flex-col gap-y-2">
                {componentOutputFields}
              </div>
            ) : (
              <CodeBlock
                codeString={JSON.stringify(modelRunResult, null, 2)}
                wrapLongLines={true}
                language="json"
                customStyle={defaultCodeSnippetStyles}
                className="!h-auto !flex-none"
              />
            )}
          </React.Fragment>
        ) : (
          <div className="flex flex-row items-center justify-center gap-x-4 pt-24">
            <Image
              src="/images/models/no-result.svg"
              width={41}
              height={40}
              alt="Square shapes"
            />
            <p className="font-mono text-sm italic text-semantic-fg-disabled">
              Execute the model to view the results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
