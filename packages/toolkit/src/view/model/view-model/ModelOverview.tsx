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
import Image from "next/image";

export type ModelOutputActiveView = "preview" | "json";

export type ModelOverviewProps = {
  model?: Model;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

const convertTaskNameToPayloadPropName = (taskName?: ModelTask) =>
  taskName ? taskName.replace("TASK_", "").toLocaleLowerCase() : null;

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
  const [outputResult, setOutputResult] = useState<Record<
    string,
    unknown
  > | null>(null);
  const { accessToken } = useInstillStore(useShallow(selector));

  const { form, fields, ValidatorSchema } = useInstillForm(
    model?.input_schema || null,
    null,
    {
      disabledAll: !model?.permission.can_trigger,
    }
  );

  const triggerModel = useTriggerUserModel();

  async function onTriggerModel(
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
    data: outputResult || null,
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
                  disabled={!model?.permission.can_trigger || isTriggered}
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
            <LoadingSpin className="!m-0 !text-semantic-fg-secondary" />
          ) : outputResult ? (
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
