import {
  Button,
  Form,
  Icons,
  LinkButton,
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
} from "../../../lib";
import { ModelReadme } from "./ModelReadme";
import { z } from "zod";
import { CodeBlock, LoadingSpin } from "../../../components";
import { useEffect, useMemo, useState } from "react";
import { ModelSectionHeader } from "./SectionHeader";
import { recursiveHelpers } from "../../pipeline-builder";
import { defaultCodeSnippetStyles } from "../../../constant";
import React from "react";
import Image from "next/image";

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
  taskName ? taskName.replace("TASK_", "").toLowerCase() : null;

const convertValuesToString = (props: Record<string, unknown>) => {
  const convertedProps: Record<string, string> = {};

  for (const key in props) {
    if (typeof props[key] !== "string" && props[key] !== null) {
      convertedProps[key] = JSON.stringify(props[key]);
    } else {
      convertedProps[key] = props[key] as string;
    }
  }

  return convertedProps;
};

export const ModelOverview = ({ model, modelState }: ModelOverviewProps) => {
  const { toast, dismiss } = useToast();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [isModelRunInProgress, setIsModelRunInProgress] = useState(false);
  const [outputActiveView, setOutputActiveView] =
    useState<ModelOutputActiveView>("preview");
  const taskPropName = useMemo(
    () => convertTaskNameToPayloadPropName(model?.task),
    [model]
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
  const [showFullTriggerResult, setShowFullTriggerResult] = useState(false);
  const [existingTriggerToastShowed, setExistingTriggerToastShowed] =
    useState(false);
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const isModelTriggerable = useMemo(() => {
    return model && modelState
      ? model.permission.can_trigger &&
          !isModelRunInProgress &&
          !["STATE_UNSPECIFIED", "STATE_ERROR"].includes(modelState)
      : false;
  }, [modelState, model, isModelRunInProgress]);

  const { form, fields, ValidatorSchema } = useInstillForm(
    model?.input_schema || null,
    inputFromExistingResult,
    {
      disabledAll: !isModelTriggerable,
    }
  );

  const existingModelTriggerResult = useLastModelTriggerResult({
    accessToken,
    modelName: model?.name || null,
    fullView: showFullTriggerResult,
    enabled:
      enabledQuery && (!existingTriggerState || existingTriggerState.done),
  });

  useEffect(() => {
    if (!existingModelTriggerResult.data?.operation || !model) {
      return;
    }

    if (
      !existingTriggerState ||
      existingTriggerState.done !==
        existingModelTriggerResult.data.operation.done ||
      (!existingTriggerState.response &&
        existingModelTriggerResult.data.operation.response)
    ) {
      setExistingTriggerState(existingModelTriggerResult.data.operation);
      setIsModelRunInProgress(false);
    }

    if (
      !existingModelTriggerResult.data.operation.done &&
      !isModelRunInProgress
    ) {
      setIsModelRunInProgress(true);
    } else if (!existingTriggerState?.response && !existingTriggerToastShowed) {
      setExistingTriggerToastShowed(true);
      toast({
        id: "fetch-existing-model-trigger-result",
        variant: "notification-info",
        title: "Run result ready",
        size: "large",
        description: "You can view it or do another run.",
        action: (
          <div className="flex flex-row gap-x-4">
            <LinkButton
              onClick={() => {
                dismiss("fetch-existing-model-trigger-result");
              }}
              variant="secondary"
              size="md"
            >
              Dismiss
            </LinkButton>
            <LinkButton
              onClick={() => {
                dismiss("fetch-existing-model-trigger-result");
                setIsModelRunInProgress(true);
                setShowFullTriggerResult(true);
              }}
              variant="primary"
              size="md"
              className="mr-auto"
            >
              View
            </LinkButton>
          </div>
        ),
        duration: 30000,
      });
    }

    if (
      existingTriggerState?.response &&
      !inputFromExistingResult &&
      !modelRunResult
    ) {
      const taskPropName = convertTaskNameToPayloadPropName(
        model.task
      ) as string;

      setInputFromExistingResult(
        convertValuesToString(
          existingTriggerState.response.request.task_inputs[0][taskPropName]
        )
      );
      setModelRunResult(
        existingTriggerState.response.response.task_outputs[0][taskPropName]
      );
    }
  }, [
    existingModelTriggerResult,
    existingTriggerState,
    toast,
    existingTriggerToastShowed,
    dismiss,
    isModelRunInProgress,
    model,
    modelRunResult,
    inputFromExistingResult,
  ]);

  const triggerModel = useTriggerUserModelAsync();

  async function onRunModel(
    formData: Record<string, unknown> /* z.infer<typeof Schema> */
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
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(parsedData)
    );

    const parsedStructuredData: GeneralRecord = input;

    try {
      const data = await triggerModel.mutateAsync({
        modelName: model.name,
        accessToken,
        payload: {
          task_inputs: [
            {
              [taskPropName]: parsedStructuredData,
            },
          ],
        },
      });

      toast({
        variant: "notification-success",
        title: "Model was triggered",
        size: "large",
        description:
          "Come back later or reload the page to see if the run result is ready.",
        action: (
          <div className="flex flex-row gap-x-4">
            <LinkButton
              onClick={() => {
                dismiss();
              }}
              variant="secondary"
              size="md"
            >
              Dismiss
            </LinkButton>
            <LinkButton
              onClick={() => {
                window.location.reload();
              }}
              variant="primary"
              size="md"
            >
              Reload
            </LinkButton>
          </div>
        ),
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("trigger_model");
      }

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
    schema: model?.output_schema || {},
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
      {model?.permission.can_edit || model?.readme ? (
        <React.Fragment>
          <ModelSectionHeader className="mb-5">Readme</ModelSectionHeader>
          <ModelReadme model={model} />
        </React.Fragment>
      ) : null}
    </div>
  );
};
