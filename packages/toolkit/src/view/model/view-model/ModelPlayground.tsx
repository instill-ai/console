"use client";

import type { Model, ModelState, Operation } from "instill-sdk";
import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

import {
  Button,
  Form,
  Icons,
  Nullable,
  TabMenu,
} from "@instill-ai/design-system";

import {
  CodeBlock,
  LoadingSpin,
  ModelSectionHeader,
} from "../../../components";
import { defaultCodeSnippetStyles } from "../../../constant";
import {
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useAuthenticatedUser,
  useComponentOutputFields,
  useInstillForm,
  useInstillStore,
  useNamespaceModelVersionOperationResult,
  useNavigateBackAfterLogin,
  useQueryClient,
  useRouteInfo,
  useShallow,
  useTriggerAsyncNamespaceModelVersion,
  useUserNamespaces,
} from "../../../lib";
import { recursiveHelpers } from "../../pipeline-builder";
import { getStatusMessage, OPERATION_POLL_TIMEOUT } from "./constants";

export type ModelOutputActiveView = "preview" | "json";

export type ModelPlaygroundProps = {
  model?: Model;
  modelState: Nullable<ModelState>;
  onRun: () => void;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

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
  targetNamespace: null,
};

export const ModelPlayground = ({
  model,
  modelState,
  onRun,
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
    targetNamespace: Nullable<string>;
  }>(defaultCurrentOperationIdPollingData);
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [isModelRunInProgress, setIsModelRunInProgress] = React.useState(true);
  const [outputActiveView, setOutputActiveView] =
    React.useState<ModelOutputActiveView>("preview");
  const [modelRunResult, setModelRunResult] = React.useState<Record<
    string,
    unknown
  > | null>(null);
  const [inputFromExistingResult, setInputFromExistingResult] =
    React.useState<Record<
      string,
      unknown
      // Stupid hack, because the model name field needs to use the models' name
    > | null>({ data: { model: model?.id } });
  const [existingTriggerState, setExistingTriggerState] =
    React.useState<Nullable<Operation>>(null);
  const { accessToken, enabledQuery, navigationNamespaceAnchor } =
    useInstillStore(useShallow(selector));

  const navigateBackAfterLogin = useNavigateBackAfterLogin();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const userNamespaces = useUserNamespaces();

  const targetNamespace = React.useMemo(() => {
    if (!userNamespaces.isSuccess || !navigationNamespaceAnchor) {
      return null;
    }

    return userNamespaces.data.find(
      (namespace) => namespace.id === navigationNamespaceAnchor,
    );
  }, [
    userNamespaces.isSuccess,
    userNamespaces.data,
    navigationNamespaceAnchor,
  ]);

  const isModelTriggerable = React.useMemo(() => {
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

  const existingModelTriggerResult = useNamespaceModelVersionOperationResult({
    accessToken,
    modelId: model?.id || null,
    namespaceId: routeInfo.data.namespaceId,
    versionId: activeVersion,
    view: "VIEW_FULL",
    enabled:
      !!activeVersion &&
      enabledQuery &&
      userNamespaces.isSuccess &&
      routeInfo.isSuccess,
    requesterId: targetNamespace ? targetNamespace.id : null,
  });

  const pollForResponse = React.useCallback(async () => {
    // If the polling is already running, stop
    if (currentOperationIdPollingData.current.timeoutRunning) {
      return;
    }

    // If the data that is being polled is rendered, stop and reset polling running state
    if (currentOperationIdPollingData.current.isRendered) {
      currentOperationIdPollingData.current = {
        ...currentOperationIdPollingData.current,
        timeoutRunning: false,
      };

      return;
    }

    // Set the polling running state to active before making the request and
    // launching the timeout
    currentOperationIdPollingData.current = {
      ...currentOperationIdPollingData.current,
      timeoutRunning: true,
    };

    await queryClient.invalidateQueries({
      queryKey: ["models", "operation", model?.name],
    });

    existingModelTriggerResult.refetch();

    setTimeout(() => {
      // Resetting the polling running state so it can proceed on the next call
      currentOperationIdPollingData.current = {
        ...currentOperationIdPollingData.current,
        timeoutRunning: false,
      };

      pollForResponse();
    }, OPERATION_POLL_TIMEOUT);
  }, [model?.name, queryClient, existingModelTriggerResult]);

  const resetStatesAndCurrentOperationIdPollingData = () => {
    currentOperationIdPollingData.current =
      defaultCurrentOperationIdPollingData;
    setExistingTriggerState(null);
    setInputFromExistingResult(null);
    setModelRunResult(null);
  };

  React.useEffect(() => {
    if (
      activeVersion !== currentOperationIdPollingData.current.modelVersion ||
      targetNamespace !== currentOperationIdPollingData.current.targetNamespace
    ) {
      resetStatesAndCurrentOperationIdPollingData();
    }
  }, [activeVersion, targetNamespace]);

  React.useEffect(() => {
    if (
      !accessToken ||
      (existingModelTriggerResult.isSuccess &&
        !currentOperationIdPollingData.current.name &&
        !existingModelTriggerResult.data.operation) ||
      existingModelTriggerResult.data?.operation?.error
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

    if (existingModelTriggerResult.data.operation.error) {
      currentOperationIdPollingData.current = {
        ...currentOperationIdPollingData.current,
        timeoutRunning: false,
        isRendered: false,
      };

      toastInstillError({
        title: "Something went wrong when triggering the model",
        description: existingModelTriggerResult.data.operation.error.message,
      });

      return;
    }

    if (!existingModelTriggerResult.data?.operation?.done) {
      pollForResponse();
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
    // "toast" update doesn't matter here
    // and the "pollForResponse" mainly uses ref and a couple of methods that
    // don't depend on the state of the data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    existingTriggerState,
    existingModelTriggerResult.isSuccess,
    existingModelTriggerResult.data,
    accessToken,
  ]);

  React.useEffect(() => {
    if (!existingTriggerState || !model) {
      return;
    }

    if (!existingTriggerState.done) {
      pollForResponse();
    } else {
      if (!currentOperationIdPollingData.current.isRendered) {
        currentOperationIdPollingData.current = {
          ...currentOperationIdPollingData.current,
          isRendered: true,
        };

        if (existingTriggerState.response?.request.taskInputs[0]) {
          const input = existingTriggerState.response?.request.taskInputs[0];
          setInputFromExistingResult(convertValuesToString(input));
        }

        if (existingTriggerState.response?.response.taskOutputs[0]) {
          const output = existingTriggerState.response?.response.taskOutputs[0];
          setModelRunResult(output);
        }

        setIsModelRunInProgress(false);
        onRun();
      }
    }

    if (!currentOperationIdPollingData.current.name) {
      // Updating the polling data based on the current `existingTriggerState`
      // data so the `pollForResponse` can react accordingly
      currentOperationIdPollingData.current = {
        ...defaultCurrentOperationIdPollingData,
        isRendered: existingTriggerState.done,
        name: existingTriggerState.name,
        modelVersion: existingTriggerState.response?.request.version || null,
        targetNamespace: targetNamespace?.id || null,
      };
    }
    // this effect should not depend on "pollForResponse"
    // "onRun" is provided as props and its state doesn't matter here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingTriggerState, model]);

  const triggerModel = useTriggerAsyncNamespaceModelVersion();

  async function onRunModel(
    formData: Record<string, unknown> /* z.infer<typeof Schema> */,
  ) {
    if (!model || !model.name || !userNamespaces.isSuccess) return;

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

    const targetNamespace = userNamespaces.data.find(
      (namespace) => namespace.id === navigationNamespaceAnchor,
    );

    if (!targetNamespace || !routeInfo.data.namespaceId || !activeVersion) {
      return;
    }

    try {
      const data = await triggerModel.mutateAsync({
        modelId: model.id,
        namespaceId: routeInfo.data.namespaceId,
        accessToken,
        taskInputs: [input],
        requesterId: targetNamespace ? targetNamespace.id : undefined,
        versionId: activeVersion,
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
      onRun();
    } catch (error) {
      setIsModelRunInProgress(false);

      toastInstillError({
        title: "Something went wrong when triggering the model",
        error,
      });
    }
  }

  const playgroundModelTriggerFormID = "model-details-page-trigger-model-form";

  const componentOutputFields = useComponentOutputFields({
    mode: "demo",
    schema: model?.outputSchema || {},
    data: modelRunResult || null,
    forceFormatted: true,
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
