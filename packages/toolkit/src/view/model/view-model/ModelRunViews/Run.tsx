"use client";

import * as React from "react";
import Link from "next/link";
import { Model, Nullable } from "instill-sdk";

import { Button, Form, Icons, TabMenu } from "@instill-ai/design-system";

import {
  CodeBlock,
  ModelSectionHeader,
  RunStateLabel,
} from "../../../../components";
import { defaultCodeSnippetStyles } from "../../../../constant";
import {
  convertToSecondsAndMilliseconds,
  InstillStore,
  useComponentOutputFields,
  useInstillForm,
  useInstillStore,
  usePaginatedNamespaceModelRuns,
  useRouteInfo,
  useShallow,
  useUserNamespaces,
} from "../../../../lib";
import { env, getHumanReadableStringFromTime } from "../../../../server";
import {
  convertValuesToString,
  ModelOutputActiveView,
} from "../ModelPlayground";

export type ModelRunProps = {
  id?: string;
  model?: Model;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const ModelRun = ({ id, model }: ModelRunProps) => {
  const routeInfo = useRouteInfo();
  const { accessToken, enabledQuery, navigationNamespaceAnchor } =
    useInstillStore(useShallow(selector));
  const [outputActiveView, setOutputActiveView] =
    React.useState<ModelOutputActiveView>("preview");
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

  const modelRuns = usePaginatedNamespaceModelRuns({
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess && userNamespaces.isSuccess,
    namespaceId: routeInfo.data?.namespaceId,
    modelId: routeInfo.data?.resourceId,
    pageSize: 1,
    page: 0,
    filter: `uid="${id}"`,
    view: "VIEW_FULL",
    requesterUid: targetNamespace ? targetNamespace.uid : null,
    orderBy: null,
  });

  const modelRun = React.useMemo(() => {
    return modelRuns.data?.runs[0] || null;
  }, [modelRuns.data]);
  const taskInputOutput = React.useMemo(() => {
    return {
      input: modelRun?.taskInputs[0]
        ? convertValuesToString(modelRun?.taskInputs[0])
        : null,
      output: modelRun?.taskOutputs[0] ? modelRun?.taskOutputs[0] : null,
    };
  }, [modelRun]);

  const { fields, form } = useInstillForm(
    model?.inputSchema || null,
    taskInputOutput.input,
    {
      disabledAll: true,
      stringifyDefaultValue: true,
    },
  );
  const componentOutputFields = useComponentOutputFields({
    mode: "demo",
    schema: model?.outputSchema || null,
    data: taskInputOutput.output,
    forceFormatted: true,
  });

  return (
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
          <div>
            Version <b>{modelRun?.version}</b>
          </div>
          <div>
            Status{" "}
            <RunStateLabel state={modelRun?.status} className="inline-flex" />
          </div>
          <div>
            Source{" "}
            <b>{modelRun?.source === "RUN_SOURCE_CONSOLE" ? "Web" : "API"}</b>
          </div>
          <div>
            Total Duration{" "}
            <b>
              {convertToSecondsAndMilliseconds(
                (modelRun?.totalDuration || 0) / 1000,
              )}
            </b>
          </div>
          <div>
            Created Time{" "}
            <b>
              {modelRun?.createTime
                ? getHumanReadableStringFromTime(
                    modelRun?.createTime,
                    Date.now(),
                  )
                : null}
            </b>
          </div>
          {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
            <div>
              Credits <b>{modelRun?.creditAmount}</b>
            </div>
          ) : null}
          <div>
            Credit Owner{" "}
            <Link
              target="_blank"
              className="text-semantic-accent-default hover:underline"
              href={`/${modelRun?.requesterId}`}
            >
              <b>{modelRun?.requesterId}</b>
            </Link>
          </div>
          <div>
            Runner{" "}
            <Link
              target="_blank"
              className="text-semantic-accent-default hover:underline"
              href={`/${modelRun?.runnerId}`}
            >
              <b>{modelRun?.runnerId}</b>
            </Link>
          </div>
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
            <div className="flex flex-col gap-y-2">{componentOutputFields}</div>
          ) : (
            <CodeBlock
              codeString={JSON.stringify(taskInputOutput.output, null, 2)}
              wrapLongLines={true}
              language="json"
              customStyle={defaultCodeSnippetStyles}
              className="!h-auto !flex-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};
