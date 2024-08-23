import { Nullable, Pipeline } from "instill-sdk";
import * as React from "react";
import { CodeBlock, ModelSectionHeader, RunStateLabel } from "../../../../components";
import { Button, Form, Icons, TabMenu } from "@instill-ai/design-system";
import { convertToSecondsAndMilliseconds, InstillStore, useComponentOutputFields, useInstillStore, usePipelineTriggerRequestForm, useRouteInfo, useShallow } from "../../../../lib";
import { InOutputSkeleton, PipelineOutputActiveView } from "../PipelinePlayground";
import { defaultCodeSnippetStyles } from "../../../../constant";
import { usePaginatedPipelineRuns } from "../../../../lib/react-query-service/pipeline";
import { getHumanReadableStringFromTime } from "../../../../server";
import { PipelineRunComponents } from "./RunComponents";
import Link from "next/link";

export type PipelineRunProps = {
  id?: string;
  pipeline?: Pipeline;
}

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const PipelineRunView = ({ id, pipeline }: PipelineRunProps) => {
  const routeInfo = useRouteInfo();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const pipelineRuns = usePaginatedPipelineRuns({
    pipelineName: `namespaces/${routeInfo.data.namespaceId}/pipelines/${routeInfo.data.resourceId}`,
    enabled: enabledQuery && routeInfo.isSuccess,
    accessToken,
    pageSize: 1,
    page: 0,
    filter: `pipelineTriggerUID="${id}"`,
    fullView: true,
  });
  const pipelineRun = React.useMemo(() => {
    return pipelineRuns.data?.pipelineRuns[0] || null
  }, [pipelineRuns.isSuccess, pipelineRuns.data]);
  const {
    fieldItems: fields,
    form,
  } = usePipelineTriggerRequestForm({
    mode: "demo",
    fields: pipelineRun?.recipeSnapshot?.variable || null,
    keyPrefix: "pipeline-run-details-page-form",
    disabledFields: true,
    disabledFieldControls: true,
    values: pipelineRun?.inputs[0],
  });

  const componentOutputFields = useComponentOutputFields({
    mode: "demo",
    schema: pipelineRun?.dataSpecification.output || null,
    data: pipelineRun?.outputs[0] || null,
  });

  const [outputActiveView, setOutputActiveView] = React.useState<PipelineOutputActiveView>("preview");

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
            <div>Version <b>{pipelineRun?.pipelineVersion}</b></div>
            <div>Status <RunStateLabel
              state={pipelineRun?.status}
              className="inline-flex"
            /></div>
            <div>Source <b>{pipelineRun?.source === 'RUN_SOURCE_CONSOLE' ? "Web" : "API"}</b></div>
            <div>Total Duration <b>{convertToSecondsAndMilliseconds((pipelineRun?.totalDuration || 0) / 1000)}</b></div>
            <div>Trigger Time <b>{pipelineRun?.startTime ? getHumanReadableStringFromTime(pipelineRun.startTime, Date.now()) : null}</b></div>
            <div>Runner <Link target="_blank" className="text-semantic-accent-default hover:underline" href={`/${pipelineRun?.runnerId}`}><b>{pipelineRun?.runnerId}</b></Link></div>
            {
              (pipelineRun && pipelineRun.creditAmount !== null)
                ? <div>Credits <b>{pipelineRun.creditAmount}</b></div>
                : null
            }
          </div>
        </div>
        <div>
          <ModelSectionHeader className="mb-3">Recipe</ModelSectionHeader>
          <CodeBlock
            codeString={pipelineRun?.recipeSnapshot ? JSON.stringify(pipelineRun.recipeSnapshot, null, 2) : ''}
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
                {componentOutputFields}
              </div>
            ) : (
              <CodeBlock
                codeString={JSON.stringify(
                  pipelineRun?.outputs[0],
                  null,
                  2,
                )}
                wrapLongLines={true}
                language="json"
                customStyle={defaultCodeSnippetStyles}
                className="!h-auto !flex-none"
              />
            )}
          </div>
        </div>
        <PipelineRunComponents pipelineRunId={id || null} />
      </div>
    </React.Fragment>
  );
}