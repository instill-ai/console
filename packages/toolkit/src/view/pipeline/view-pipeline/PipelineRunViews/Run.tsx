import { Nullable, Pipeline } from "instill-sdk";
import * as React from "react";
import { CodeBlock, ModelSectionHeader, PipelineRunStateLabel } from "../../../../components";
import { Button, ColumnDef, DataTable, Dialog, Form, Icons, TabMenu } from "@instill-ai/design-system";
import { convertToSecondsAndMilliseconds, formatDate, usePipelineTriggerRequestForm, useRouteInfo } from "../../../../lib";
import { InOutputSkeleton, PipelineOutputActiveView } from "../PipelinePlayground";
import Image from "next/image";
import { defaultCodeSnippetStyles } from "../../../../constant";

export type PipelineRunProps = {
  id?: string;
  pipeline?: Pipeline;
}

export const PipelineRun = ({ id, pipeline }: PipelineRunProps) => {
  const routeInfo = useRouteInfo();
  const {
    fieldItems: fields,
    form,
    //Schema: ValidatorSchema,
  } = usePipelineTriggerRequestForm({
    mode: "demo",
    fields: pipeline?.recipe.variable || null,
    keyPrefix: "pipeline-details-page-trigger-pipeline-form",
    disabledFields: true,
    disabledFieldControls: true,
  });

  const [currentOutputContent, setCurrentOutputContent] = React.useState<Nullable<{ componentId: string, content: string }>>(null);
  const [outputActiveView, setOutputActiveView] = React.useState<PipelineOutputActiveView>("preview");

  //const columns: ColumnDef<PipelineTriggerRecord>[] = [
    const componentRunsColumns: ColumnDef<unknown>[] = [
      {
        accessorKey: "componentTriggerId",
        header: () => <div className="text-left">Component ID</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("componentTriggerId")}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="text-left">Status</div>,
        cell: ({ row }) => {
          return (
            <PipelineRunStateLabel
              state={row.getValue("status")}
              className="inline-flex"
            />
          );
        },
      },
      {
        accessorKey: "computeTimeDuration",
        header: () => <div className="text-left">Total Duration</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {convertToSecondsAndMilliseconds(
                row.getValue("computeTimeDuration"),
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "triggerTime",
        header: () => <div className="text-left">Started Time</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {formatDate(row.getValue("triggerTime"))}
            </div>
          );
        },
      },
      {
        accessorKey: "finishTime",
        header: () => <div className="text-left">Completed Time</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-alt-primary">
              {formatDate(row.getValue("finishTime"))}
            </div>
          );
        },
      },
      {
        accessorKey: "creditSpent",
        header: () => <div className="text-left">Credit</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              {row.getValue("creditSpent")}
            </div>
          );
        },
      },
      {
        accessorKey: "output",
        header: () => <div className="text-left">Output</div>,
        cell: ({ row }) => {
          return (
            <div className="font-normal text-semantic-bg-secondary-secondary break-all">
              <Button
                size="sm"
                variant="secondaryGrey"
                onClick={() =>{
                  setCurrentOutputContent({
                    componentId: row.original.componentTriggerId,
                    content: row.getValue("output"),
                  });
                }}
              >
                JSON
              </Button>
            </div>
          );
        },
      },
    ];

  return (
    <React.Fragment>
      <div className="flex flex-col gap-6">
        <Button
          className="text-semantic-accent-default gap-x-2 !bg-transparent self-start"
          variant="secondaryColour"
          size="lg"
          asChild
        >
          <a href={`/${routeInfo.data.namespaceId}/pipelines/${pipeline?.id}/runs`}>
            <Icons.ChevronLeft className="h-4 w-4 stroke-semantic-accent-default" />
            Back
          </a>
        </Button>
        <div className="border rounded-sm p-6 flex flex-col gap-y-5">
          <div className="text-lg text-semantic-fg-primary font-bold">{id}</div>
          <div className="flex flex-row items-center justify-between text-xs">
            <div>Version <b>v1.1.1</b></div>
            <div>Status <PipelineRunStateLabel
              state="STATUS_COMPLETED"
              className="inline-flex"
            /></div>
            <div>Source <b>v1.1.1</b></div>
            <div>Total Duration <b>v1.1.1</b></div>
            <div>Created Time <b>v1.1.1</b></div>
            <div>Runner <b>v1.1.1</b></div>
            <div>Credits <b>v1.1.1</b></div>
          </div>
        </div>
        <div>
          <ModelSectionHeader className="mb-3">Recipe</ModelSectionHeader>
          <CodeBlock
            codeString={`{
      "slug": "medical-image-research",
      "type": "Marketing",
      "colors": {
        "header": "#FEE2A9",
        "background": "rgba(251,187,60,0.1)"
      },
      "features": [
        {
          "title": "Image Sorting Automation",
          "description": "Provides instant, 24/7 support, addressing customer inquiries at any time without the limitations of human working hours or time zones."
        },
        {
          "title": "Intelligent Query Resolution",
          "description": "Efficiently handles and resolves routine inquiries without human intervention, freeing up human agents for more complex issues."
        },
        {
          "title": "Personalized Interaction",
          "description": "Offers tailored responses and recommendations based on customer data and interaction history, enhancing the personalization of customer experiences."
        },
        {
          "title": "Proactive Engagement",
          "description": "Automatically engages with customers based on their behavior and past interactions, offering timely support or information to prevent potential issues."
        },
        {
          "title": "Sentiment Analysis and Feedback",
          "description": "Analyzes customer sentiment and feedback in real-time, providing valuable insights for improving customer satisfaction and service quality."
        },
        {
          "title": "Multilingual Support",
          "description": "Provides assistance in multiple languages, breaking down language barriers and ensuring a seamless customer experience for global audiences."
        }
      ],
      "highlights": [
        {
          "value": "80%",
          "title": "Decrease in Response Time"
        },
        {
          "value": "100%",
          "title": "Transparency in Orchestration and Monitoring Capabilities"
        },
        {
          "value": "10%",
          "title": "Improve in Accuracy for Fine-Tuning"
        }
      ],
      "hero": {
        "title": "Agricultural Biotechnology AI Image Analyser",
        "description": "Transform your visual data into actionable insights effortlessly with AI to automatically detect, classify, and analyse visual data with high precision and efficiency. Get tailored image processing and analysis including data preparation, model fine-tuning and seamless deployment.",
        "shortDescription": "Transform your visual data into actionable insights.",
        "imageUrl": "/images/use-cases/assets/ai-ia.jpg"
      },
      "stages": [
        "Outreach automation",
        "Coming soon"
      ]
    }`}
            wrapLongLines={true}
            language="json"
            customStyle={defaultCodeSnippetStyles}
          />
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
            {pipeline ? (
                <Form.Root {...form}>
                  <form className="w-full">
                    <div className="mb-5 flex flex-col gap-y-5">{fields}</div>
                  </form>
                </Form.Root>
            ) : (
              <InOutputSkeleton />
            )}
          </div>
          <div className="flex w-1/2 flex-col pb-6 pl-6">
            <ModelSectionHeader className="mb-3">Output</ModelSectionHeader>
            {(routeInfo.data.modelName === 'abc') ? (
              <React.Fragment>
                <TabMenu.Root
                  value={outputActiveView}
                  onValueChange={(value: Nullable<string>) =>
                    setOutputActiveView(value as PipelineOutputActiveView)
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
                  Execute the pipeline to view the results
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <ModelSectionHeader className="mb-4">Component Run Metadata</ModelSectionHeader>
          <div className="[&_table]:table-fixed [&_table_td]:align-top [&_table_th]:w-40 [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(6)]:w-28 [&_table_th:nth-child(7)]:w-32">
            <DataTable
              columns={componentRunsColumns}
              //data={triggers.data ?? []}
              data={[
                {
                  componentTriggerId: 'asasdasdasd211312',
                  status: 'STATUS_COMPLETED',
                  computeTimeDuration: 1.23123,
                  triggerTime: 'Fri Aug 02 2024 12:12:00 GMT+0200 (Central European Summer Time)',
                  finishTime: 'Fri Aug 02 2024 12:14:00 GMT+0200 (Central European Summer Time)',
                  creditSpent: 23.56,
                  output: `{
      "slug": "medical-image-research",
      "type": "Marketing",
      "colors": {
        "header": "#FEE2A9",
        "background": "rgba(251,187,60,0.1)"
      },
      "features": [
        {
          "title": "Image Sorting Automation",
          "description": "Provides instant, 24/7 support, addressing customer inquiries at any time without the limitations of human working hours or time zones."
        },
        {
          "title": "Intelligent Query Resolution",
          "description": "Efficiently handles and resolves routine inquiries without human intervention, freeing up human agents for more complex issues."
        },
        {
          "title": "Personalized Interaction",
          "description": "Offers tailored responses and recommendations based on customer data and interaction history, enhancing the personalization of customer experiences."
        },
        {
          "title": "Proactive Engagement",
          "description": "Automatically engages with customers based on their behavior and past interactions, offering timely support or information to prevent potential issues."
        },
        {
          "title": "Sentiment Analysis and Feedback",
          "description": "Analyzes customer sentiment and feedback in real-time, providing valuable insights for improving customer satisfaction and service quality."
        },
        {
          "title": "Multilingual Support",
          "description": "Provides assistance in multiple languages, breaking down language barriers and ensuring a seamless customer experience for global audiences."
        }
      ],
      "highlights": [
        {
          "value": "80%",
          "title": "Decrease in Response Time"
        },
        {
          "value": "100%",
          "title": "Transparency in Orchestration and Monitoring Capabilities"
        },
        {
          "value": "10%",
          "title": "Improve in Accuracy for Fine-Tuning"
        }
      ],
      "hero": {
        "title": "Agricultural Biotechnology AI Image Analyser",
        "description": "Transform your visual data into actionable insights effortlessly with AI to automatically detect, classify, and analyse visual data with high precision and efficiency. Get tailored image processing and analysis including data preparation, model fine-tuning and seamless deployment.",
        "shortDescription": "Transform your visual data into actionable insights.",
        "imageUrl": "/images/use-cases/assets/ai-ia.jpg"
      },
      "stages": [
        "Outreach automation",
        "Coming soon"
      ]
    }`,
                },
              ]}
              //pageSize={TABLE_PAGE_SIZE}
              pageSize={2}
              isLoading={false/* !triggers.isSuccess */}
              //loadingRows={TABLE_PAGE_SIZE}
              loadingRows={2}
            />
          </div>
        </div>
      </div>
      <Dialog.Root open={!!currentOutputContent}>
        <Dialog.Content
          className="w-1/2 h-full overflow-hidden"
          style={{
            maxHeight: `calc(100% - 48px)`,
          }}
        >
          <Dialog.Header>
            <Dialog.Title>Component {currentOutputContent?.componentId} output</Dialog.Title>
            <Dialog.Close onClick={() => setCurrentOutputContent(null)} className="!right-6 !top-6" />
          </Dialog.Header>
          <pre className="w-full h-full overflow-auto">{currentOutputContent?.content}</pre>
        </Dialog.Content>
      </Dialog.Root>
    </React.Fragment>
  );
}