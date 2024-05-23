import {
  Button,
  Form,
  Icons,
  Nullable,
  TabMenu,
} from "@instill-ai/design-system";
import { Model, useInstillForm } from "../../../lib";
import { ModelReadme } from "./ModelReadme";
import { z } from "zod";
import { LoadingSpin } from "../../../components";
import { useState } from "react";
import { ModelSectionHeader } from "./SectionHeader";

export type ModelOutputActiveView = "preview" | "json";

export type ModelOverviewProps = {
  model?: Model;
};

export const ModelOverview = ({ model }: ModelOverviewProps) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [outputActiveView, setOutputActiveView] =
    useState<ModelOutputActiveView>("preview");

  const { form, fields, ValidatorSchema, formTree } = useInstillForm(
    model?.input_schema || null,
    null
  );

  return (
    <div className="flex flex-col gap-y-9">
      <div className="flex flex-row">
        <div className="flex flex-1 flex-col border-r border-semantic-bg-line pb-6 pr-6">
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
            <form className="w-full">
              <div className="mb-5 flex flex-col gap-y-5">{fields}</div>
              <div className="flex flex-row-reverse">
                <Button
                  disabled={isTriggered}
                  type="button"
                  size="md"
                  variant="secondaryColour"
                  onClick={() => {
                    const data = form.getValues();

                    try {
                      const parsedData = ValidatorSchema.parse(data);
                      console.log(parsedData);
                      //setData(JSON.stringify(parsedData, null, 2));
                      //setError(null);
                    } catch (err) {
                      if (err instanceof z.ZodError) {
                        console.log(err);
                        //setError(JSON.stringify(err, null, 2));
                      }
                    }
                  }}
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
        <div className="flex flex-1 flex-col pb-6 pl-6">
          <ModelSectionHeader className="mb-3">Output</ModelSectionHeader>
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
        </div>
      </div>
      <div>
        <ModelSectionHeader className="mb-5">Readme</ModelSectionHeader>
        <ModelReadme model={model} />
      </div>
    </div>
  );
};
