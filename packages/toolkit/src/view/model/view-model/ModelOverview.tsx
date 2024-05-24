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
  ModelTask,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useComponentOutputFields,
  useInstillForm,
  useInstillStore,
  useShallow,
  useTriggerUserModel,
} from "../../../lib";
import { ModelReadme } from "./ModelReadme";
import { z } from "zod";
import { CodeBlock, LoadingSpin } from "../../../components";
import { useMemo, useState } from "react";
import { ModelSectionHeader } from "./SectionHeader";
import { recursiveHelpers } from "../../pipeline-builder";
import { defaultCodeSnippetStyles } from "../../../constant";
import React from "react";

export type ModelOutputActiveView = "preview" | "json";

export type ModelOverviewProps = {
  model?: Model;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

const convertTaskNameToPayloadPropName = (taskName?: ModelTask) =>
  taskName ? taskName.replace("TASK_", "").toLocaleLowerCase() : null;

const preprocessInitialSampleValues = (payload: Record<string, any>) => {
  return Object.keys(payload).reduce((acc, key) => {
    const value = payload[key];
    let newValue: string | null = null;

    if (typeof value === "string") {
      newValue = value;
    } else if (typeof value === "number") {
      newValue = value.toString();
    }

    if (newValue) {
      return {
        ...acc,
        [key]: newValue,
      };
    }

    return acc;
  }, {});
};

const DEFAULT_INPUT_OUTPUT_SAMPLES = {
  input: {},
  output: {},
};

export const ModelOverview = ({ model }: ModelOverviewProps) => {
  const { toast } = useToast();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [isTriggered, setIsTriggered] = useState(false);
  const [outputActiveView, setOutputActiveView] =
    useState<ModelOutputActiveView>("preview");
  const taskPropName = useMemo(
    () => convertTaskNameToPayloadPropName(model?.task),
    [model]
  );
  const inputOutputSamples = useMemo(() => {
    if (!model || !taskPropName) {
      return DEFAULT_INPUT_OUTPUT_SAMPLES;
    }

    return {
      input: preprocessInitialSampleValues(
        model.sample_input?.[taskPropName] || {}
      ),
      output: model.sample_output?.[taskPropName] || {},
    };
  }, [model, taskPropName]);
  const [outputResult, setOutputResult] = useState<Record<string, any>>(
    inputOutputSamples.output
  );
  const { accessToken } = useInstillStore(useShallow(selector));

  const { form, fields, ValidatorSchema } = useInstillForm(
    model?.input_schema || null,
    inputOutputSamples.input || null
  );

  const triggerModel = useTriggerUserModel();

  async function onTriggerModel(
    formData: Record<string, any> /* z.infer<typeof Schema> */
  ) {
    if (!model || !model.name) return;

    let parsedData;

    try {
      parsedData = ValidatorSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err);
      }

      return;
    }

    setIsTriggered(true);

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

      if (amplitudeIsInit) {
        sendAmplitudeData("trigger_model");
      }

      console.log(data);
      setOutputResult(data.task_outputs[0][taskPropName]);
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when triggering the model",
        error,
        toast,
      });
    }

    setIsTriggered(false);
  }

  const overviewModelTriggerFormID = "model-details-page-trigger-model-form";

  const componentOutputFields = useComponentOutputFields({
    mode: "demo",
    schema: model?.output_schema || {},
    data: outputResult || {},
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
              onSubmit={form.handleSubmit(onTriggerModel)}
            >
              <div className="mb-5 flex flex-col gap-y-5">{fields}</div>
              <div className="flex flex-row-reverse">
                <Button
                  disabled={isTriggered}
                  type="submit"
                  size="md"
                  variant="secondaryColour"
                >
                  Run
                  {isTriggered ? (
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
          {isTriggered ? (
            <LoadingSpin className="m-0 !text-semantic-fg-secondary" />
          ) : (
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
                  codeString={JSON.stringify(outputResult, null, 2)}
                  wrapLongLines={true}
                  language="json"
                  customStyle={defaultCodeSnippetStyles}
                  className="!h-auto !flex-none"
                />
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      <div>
        <ModelSectionHeader className="mb-5">Readme</ModelSectionHeader>
        <ModelReadme model={model} />
      </div>
    </div>
  );
};
