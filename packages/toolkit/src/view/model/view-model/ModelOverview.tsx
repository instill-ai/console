import {
  Button,
  Form,
  Icons,
  Nullable,
  TabMenu,
  useToast,
} from "@instill-ai/design-system";
import {
  GeneralRecord,
  InstillStore,
  Model,
  ModelState,
  ModelTask,
  type ModelTriggerResult,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useComponentOutputFields,
  useInstillForm,
  useInstillStore,
  useLastModelTriggerResult,
  useShallow,
  useTriggerUserModelAsync,
  convertSentenceToCamelCase,
  useQueryClient,
} from "../../../lib";
import { ModelReadme } from "./ModelReadme";
import { z } from "zod";
import { CodeBlock, LoadingSpin } from "../../../components";
import { useEffect, useMemo, useState } from "react";
import { ModelSectionHeader } from "./SectionHeader";
import { recursiveHelpers } from "../../pipeline-builder";
import { defaultCodeSnippetStyles } from "../../../constant";
import * as React from "react";
import Image from "next/image";
import { OPERATION_POLL_TIMEOUT } from "./constants";

export type ModelOutputActiveView = "preview" | "json";

export type ModelOverviewProps = {
  model?: Model;
  modelState: Nullable<ModelState>;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

const convertTaskNameToPayloadPropName = (taskName?: ModelTask) =>
  taskName
    ? convertSentenceToCamelCase(
        // This removes "TASK_" and replaces "_" with a space. The first
        // argument has and OR operator for matching both substrings. The second
        // argument is a function with a condition.
        taskName.replace(/TASK_|_/g, (d) => (d === "TASK_" ? "" : " ")),
      )
    : null;

const convertValuesToString = (props: Record<string, unknown>) => {
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
};

export const ModelOverview = ({ model, modelState }: ModelOverviewProps) => {
  const queryClient = useQueryClient();
  const currentOperationIdPollingData = React.useRef<{
    name: string | null;
    timeoutRunning: boolean;
    isRendered: boolean;
  }>({ name: null, timeoutRunning: false, isRendered: false });
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
  > | null>(null);
  const [existingTriggerState, setExistingTriggerState] =
    useState<ModelTriggerResult["operation"]>(null);
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const isModelTriggerable = useMemo(() => {
    return model && modelState
      ? model.permission.canTrigger &&
          !isModelRunInProgress &&
          !["STATE_UNSPECIFIED", "STATE_ERROR"].includes(modelState)
      : false;
  }, [modelState, model, isModelRunInProgress]);

  const { form, fields, ValidatorSchema } = useInstillForm(
    model?.inputSchema || null,
    inputFromExistingResult,
    {
      disabledAll: !isModelTriggerable,
    },
  );

  const existingModelTriggerResult = useLastModelTriggerResult({
    accessToken,
    modelName: model?.name || null,
    fullView: true,
    enabled: enabledQuery,
  });

  const pollForResponse = React.useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["models", "operation", model?.name],
    });

    existingModelTriggerResult.refetch();
  }, [existingModelTriggerResult.refetch]);

  useEffect(() => {
    if (
      existingModelTriggerResult.isSuccess &&
      !currentOperationIdPollingData.current.name &&
      !existingModelTriggerResult.data.operation
    ) {
      setIsModelRunInProgress(false);
    }

    if (
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
  }, [existingModelTriggerResult.isSuccess, existingModelTriggerResult.data]);

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
            existingTriggerState.response.request.taskInputs[0][taskPropName],
          ),
        );
        setModelRunResult(
          existingTriggerState.response.response.taskOutputs[0][taskPropName],
        );

        setIsModelRunInProgress(false);
      }
    }

    if (!currentOperationIdPollingData.current.name) {
      currentOperationIdPollingData.current = {
        ...defaultCurrentOperationIdPollingData,
        name: existingTriggerState.name,
      };
    }
  }, [existingTriggerState]);

  const triggerModel = useTriggerUserModelAsync();

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
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(parsedData),
    );

    const parsedStructuredData: GeneralRecord = input;

    try {
      const data = await triggerModel.mutateAsync({
        modelName: model.name,
        accessToken,
        payload: {
          taskInputs: [
            {
              [taskPropName]: parsedStructuredData,
            },
          ],
        },
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("trigger_model");
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

  const overviewModelTriggerFormID = "model-details-page-trigger-model-form";

  const componentOutputFields = useComponentOutputFields({
    mode: "demo",
    schema: model?.outputSchema || {},
    data: modelRunResult || null,
  });

  return (
    <div className="flex flex-col gap-y-9">
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
              id={overviewModelTriggerFormID}
              className="w-full"
              onSubmit={form.handleSubmit(onRunModel)}
            >
              <div className="mb-5 flex flex-col gap-y-5">{fields}</div>
              <div className="flex flex-row-reverse">
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
              </div>
            </form>
          </Form.Root>
        </div>
        <div className="flex w-1/2 flex-col pb-6 pl-6">
          <ModelSectionHeader className="mb-3">Output</ModelSectionHeader>
          {isModelRunInProgress ? (
            <LoadingSpin className="!m-0 !text-semantic-fg-secondary" />
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
      {model?.permission.canEdit || model?.readme ? (
        <React.Fragment>
          <ModelSectionHeader className="mb-5">Readme</ModelSectionHeader>
          <ModelReadme model={model} />
        </React.Fragment>
      ) : null}
    </div>
  );
};
