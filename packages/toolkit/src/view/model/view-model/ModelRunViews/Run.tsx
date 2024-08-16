import { Model, Nullable } from "instill-sdk";
import * as React from "react";
import { CodeBlock, ModelSectionHeader } from "../../../../components";
import { Button, Form, Icons, TabMenu } from "@instill-ai/design-system";
import { useInstillForm, useRouteInfo } from "../../../../lib";
import Image from "next/image";
import { defaultCodeSnippetStyles } from "../../../../constant";
import { ModelRunStateLabel } from "../../../../components/ModelRunStateLabel";
import { ModelOutputActiveView } from "../ModelPlayground";

export type ModelRunProps = {
  id?: string;
  model?: Model;
}

export const ModelRun = ({ id, model }: ModelRunProps) => {
  const routeInfo = useRouteInfo();
  const {
    fields,
    form,
    //Schema: ValidatorSchema,
  } = useInstillForm(
    model?.inputSchema || null,
    null,
    {
      disabledAll: true,
    },
  );

  const [outputActiveView, setOutputActiveView] = React.useState<ModelOutputActiveView>("preview");

  return (
    <React.Fragment>
      <div className="flex flex-col gap-6">
        <Button
          className="text-semantic-accent-default gap-x-2 !bg-transparent self-start"
          variant="secondaryColour"
          size="lg"
          asChild
        >
          <a href={`/${routeInfo.data.namespaceId}/models/${model?.id}/runs`}>
            <Icons.ChevronLeft className="h-4 w-4 stroke-semantic-accent-default" />
            Back
          </a>
        </Button>
        <div className="border rounded-sm p-6 flex flex-col gap-y-5">
          <div className="text-lg text-semantic-fg-primary font-bold">{id}</div>
          <div className="flex flex-row items-center justify-between text-xs">
            <div>Version <b>v1.1.1</b></div>
            <div>Status <ModelRunStateLabel
              state="RUN_STATUS_COMPLETED"
              className="inline-flex"
            /></div>
            <div>Source <b>v1.1.1</b></div>
            <div>Total Duration <b>v1.1.1</b></div>
            <div>Created Time <b>v1.1.1</b></div>
            <div>Runner <b>v1.1.1</b></div>
            <div>Credits <b>v1.1.1</b></div>
          </div>
        </div>
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
              <form className="w-full">
                <div className="mb-5 flex flex-col gap-y-5">{fields}</div>
              </form>
            </Form.Root>
          </div>
          <div className="flex w-1/2 flex-col pb-6 pl-6">
            <ModelSectionHeader className="mb-3">Output</ModelSectionHeader>
            {(routeInfo.data.modelName === 'abc') ? (
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
                    {/* componentOutputFields */}
                  </div>
                ) : (
                  <CodeBlock
                    codeString={JSON.stringify(
                      //pipelineRunResponse?.outputs[0],
                      '',
                      null,
                      2,
                    )}
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
      </div>
    </React.Fragment>
  );
}