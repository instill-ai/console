"use client";

import type {
  Pipeline,
  PipelineRelease,
  TriggerNamespacePipelineResponse,
} from "instill-sdk";
import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";

import { Button, Form, TabMenu, useToast } from "@instill-ai/design-system";

import {
  CodeBlock,
  EmptyView,
  LoadingSpin,
  ModelSectionHeader,
} from "../../../components";
import { defaultCodeSnippetStyles } from "../../../constant";
import {
  GeneralRecord,
  InstillStore,
  Nullable,
  onTriggerInvalidateCredits,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useComponentOutputFields,
  useInstillStore,
  usePipelineTriggerRequestForm,
  useQueryClient,
  useRouteInfo,
  useShallow,
  useTriggerNamespacePipeline,
  useTriggerNamespacePipelineRelease,
  useUserNamespaces,
} from "../../../lib";
import { recursiveHelpers } from "../../pipeline-builder";
import { RunButton } from "./RunButton";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export type PipelineOutputActiveView = "preview" | "json";

export const PipelinePlayground = ({
  releases,
  pipeline,
}: {
  releases: PipelineRelease[];
  pipeline?: Pipeline;
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("view");
  const currentVersion = searchParams.get("version");
  const namespaces = useUserNamespaces();
  const { toast } = useToast();
  const [isPipelineRunning, setIsPipelineRunning] = React.useState(false);
  const [outputActiveView, setOutputActiveView] =
    React.useState<PipelineOutputActiveView>("preview");
  const queryClient = useQueryClient();

  const { accessToken, navigationNamespaceAnchor } = useInstillStore(
    useShallow(selector),
  );
  const [pipelineRunResponse, setPipelineRunResponse] =
    React.useState<Nullable<TriggerNamespacePipelineResponse>>(null);

  const inOutPutFormID = "pipeline-details-page-trigger-pipeline-form";

  const routeInfo = useRouteInfo();

  const variables = React.useMemo(() => {
    if (pipeline) {
      if (!currentVersion || releases.length === 0) {
        return pipeline.recipe?.variable ?? null;
      }

      const pipelineVersion = releases.find(
        (release) =>
          release.id === currentVersion || release.alias === currentVersion,
      );

      if (pipelineVersion) {
        return pipelineVersion?.recipe.variable ?? null;
      }
    }

    return null;
  }, [releases, currentVersion, pipeline]);

  const outputs = React.useMemo(() => {
    if (pipeline) {
      if (!currentVersion || releases.length === 0) {
        return pipeline.recipe?.output ?? null;
      }

      const pipelineVersion = releases.find(
        (release) =>
          release.id === currentVersion || release.alias === currentVersion,
      );

      if (pipelineVersion) {
        return pipelineVersion?.recipe.output ?? null;
      }
    }

    return null;
  }, [releases, currentVersion, pipeline]);

  const formSchema = React.useMemo(() => {
    if (currentVersion && releases.length > 0) {
      const release = releases.find((release) => release.id === currentVersion);

      if (release) {
        return release.dataSpecification;
      }
    }

    if (pipeline) {
      return pipeline.dataSpecification;
    }

    return {
      input: null,
      output: null,
    };
  }, [currentVersion, pipeline, releases]);

  const {
    fieldItems: fields,
    form,
    Schema: ValidatorSchema,
  } = usePipelineTriggerRequestForm({
    mode: "demo",
    fields: variables,
    keyPrefix: "pipeline-details-page-trigger-pipeline-form",
    disabledFields: false,
    disabledFieldControls: true,
  });

  const componentOutputFields = useComponentOutputFields({
    mode: "demo",
    schema: formSchema?.output || null,
    data: pipelineRunResponse?.outputs[0] || null,
  });

  const triggerPipeline = useTriggerNamespacePipeline();
  const triggerPipelineRelease = useTriggerNamespacePipelineRelease();

  async function onTriggerPipeline(formData: z.infer<typeof ValidatorSchema>) {
    if (!routeInfo.isSuccess || !routeInfo.data?.pipelineName || !pipeline) {
      return;
    }

    setIsPipelineRunning(true);

    const input = recursiveHelpers.removeUndefinedAndNullFromArray(
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(formData),
    );

    // Backend need to have the encoded JSON input. So we need to double check
    // the metadata whether this field is a semi-structured object and parse it

    const semiStructuredObjectKeys: string[] = [];

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        if (value.instillFormat === "semi-structured/json") {
          semiStructuredObjectKeys.push(key);
        }
      });
    }

    const parsedStructuredData: GeneralRecord = input;

    for (const key of semiStructuredObjectKeys) {
      if (!formData[key]) {
        continue;
      }

      try {
        const parsed = JSON.parse(formData[key]);
        parsedStructuredData[key] = parsed;
      } catch (err) {
        console.error(err);
        form.setError(key, {
          type: "manual",
          message: "Invalid JSON format",
        });
        setIsPipelineRunning(false);
        return;
      }
    }

    // The user can trigger different version of pipeline when they are
    // pro or enterprise users

    if (!currentVersion) {
      try {
        const targetNamespace = namespaces.find(
          (namespace) => namespace.id === navigationNamespaceAnchor,
        );

        const data = await triggerPipeline.mutateAsync({
          namespacePipelineName: routeInfo.data.pipelineName,
          accessToken,
          inputs: [parsedStructuredData],
          returnTraces: true,
          shareCode: shareCode ?? undefined,
          requesterUid: targetNamespace ? targetNamespace.uid : undefined,
          stream: false,
        });

        console.log("data", data);

        onTriggerInvalidateCredits({
          ownerName: targetNamespace?.name ?? null,
          namespaceNames: namespaces.map((namespace) => namespace.name),
          queryClient,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("trigger_pipeline", {
            page_url: window.location.href,
          });
        }

        setPipelineRunResponse(data);
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
          toast,
        });
      }
    } else {
      try {
        const targetNamespace = namespaces.find(
          (namespace) => namespace.id === navigationNamespaceAnchor,
        );

        const data = await triggerPipelineRelease.mutateAsync({
          namespacePipelineReleaseName: `${routeInfo.data.pipelineName}/releases/${currentVersion}`,
          inputs: [parsedStructuredData],
          accessToken,
          returnTraces: true,
          shareCode: shareCode ?? undefined,
          requesterUid: targetNamespace ? targetNamespace.uid : undefined,
        });

        onTriggerInvalidateCredits({
          ownerName: targetNamespace?.name ?? null,
          namespaceNames: namespaces.map((namespace) => namespace.name),
          queryClient,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("trigger_pipeline", {
            page_url: window.location.href,
          });
        }

        setPipelineRunResponse(data);
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
          toast,
        });
      }
    }

    setIsPipelineRunning(false);
  }

  const inputIsNotDefined = React.useMemo(() => {
    if (!variables) return false;

    if (variables && Object.keys(variables).length > 0) {
      return false;
    }

    return true;
  }, [variables]);

  const outputIsNotDefined = React.useMemo(() => {
    if (!outputs) return true;

    if (outputs && Object.keys(outputs).length > 0) {
      return false;
    }

    return true;
  }, [outputs]);

  if (!formSchema || !formSchema.input || !formSchema.output) {
    return (
      <EmptyView
        iconName="AlertCircle"
        title="Pipeline is not runnable"
        description={
          <p className="product-body-text-2-regular text-center text-semantic-fg-secondary">
            This pipeline cannot be run.{" "}
            <span
              onClick={() => {
                router.push(
                  `/${routeInfo.data.namespaceId}/pipelines/${routeInfo.data.resourceId}/editor`,
                );
              }}
              className="cursor-pointer underline text-semantic-accent-default"
            >
              Please check the configuration
            </span>{" "}
            and ensure all necessary components are set up correctly.
          </p>
        }
        className="flex-1"
      />
    );
  }

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
        {pipeline ? (
          inputIsNotDefined ? (
            <div className="flex flex-row justify-between pl-3">
              <div className="flex flex-row gap-x-6">
                <CryingFaceSVG className="my-auto h-10 w-10 shrink-0 grow-0" />
                <p className="my-auto font-mono text-sm italic text-semantic-fg-disabled">
                  Pipeline input is not defined.
                </p>
              </div>
              <Button
                variant="tertiaryColour"
                size="md"
                onClick={() => {
                  router.push(
                    `/${routeInfo.data.namespaceName}/pipelines/${routeInfo.data.resourceId}/editor`,
                  );
                }}
              >
                Setup
              </Button>
            </div>
          ) : (
            <Form.Root {...form}>
              <form
                id={inOutPutFormID}
                className="w-full"
                onSubmit={form.handleSubmit(onTriggerPipeline)}
              >
                <div className="mb-5 flex flex-col gap-y-5">{fields}</div>
                <div className="flex flex-row-reverse">
                  {pipeline ? (
                    <RunButton
                      inOutPutFormID={inOutPutFormID}
                      inputIsNotDefined={inputIsNotDefined}
                      outputIsNotDefined={outputIsNotDefined}
                      isTriggeringPipeline={
                        triggerPipeline.isPending ||
                        triggerPipelineRelease.isPending
                      }
                    />
                  ) : (
                    <div className="h-8 w-20 animate-pulse rounded bg-gradient-to-r from-[#DBDBDB]" />
                  )}
                </div>
              </form>
            </Form.Root>
          )
        ) : (
          <InOutputSkeleton />
        )}
      </div>
      <div className="flex w-1/2 flex-col pb-6 pl-6">
        <ModelSectionHeader className="mb-24">Output</ModelSectionHeader>
        {isPipelineRunning ? (
          <div className="flex flex-col items-center justify-center">
            <LoadingSpin className="!text-semantic-accent-hover !mb-10 !w-20 !h-20" />
            <p className="text-semantic-fg-primary product-headings-heading-2 mb-2">
              Running
            </p>
          </div>
        ) : pipelineRunResponse ? (
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
                {componentOutputFields}
              </div>
            ) : (
              <CodeBlock
                codeString={JSON.stringify(
                  pipelineRunResponse?.outputs[0],
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
  );
};

export const CryingFaceSVG = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.5 10.6667C0.5 4.77563 5.27563 0 11.1667 0H29.8333C35.7244 0 40.5 4.77563 40.5 10.6667V29.3333C40.5 35.2244 35.7244 40 29.8333 40H11.1667C5.27563 40 0.5 35.2244 0.5 29.3333V10.6667Z"
        fill="#F0F5FF"
      />
      <path
        d="M16.9062 29.1407C18.7921 27.6043 22.4498 26.2268 27.025 29.1407"
        stroke="black"
        strokeWidth="1.06667"
        strokeLinecap="round"
      />
      <path
        d="M9.35547 13.9418C11.2703 13.5682 15.2773 12.4287 15.9872 10.8594"
        stroke="black"
        strokeWidth="1.06667"
        strokeLinecap="round"
      />
      <path
        d="M27.4727 11.1387C28.9983 12.1817 32.3953 14.1838 33.7779 13.8475"
        stroke="black"
        strokeWidth="1.06667"
        strokeLinecap="round"
      />
      <circle cx="14.7013" cy="17.5812" r="2.03333" fill="#1D2433" />
      <circle cx="28.4982" cy="17.5812" r="2.03333" fill="#1D2433" />
      <circle
        cx="14.7951"
        cy="17.5812"
        r="2.80599"
        stroke="#1D2433"
        strokeWidth="0.4"
      />
      <circle
        cx="28.5841"
        cy="17.5812"
        r="2.80599"
        stroke="#1D2433"
        strokeWidth="0.4"
      />
      <circle cx="15.6095" cy="16.6847" r="0.37513" fill="white" />
      <circle cx="29.4025" cy="16.6847" r="0.37513" fill="white" />
      <path
        d="M8.50469 18.1253C8.50469 19.1028 7.71227 19.8952 6.73477 19.8952C5.75726 19.8952 4.96484 19.1028 4.96484 18.1253C4.96484 17.1478 6.73477 14.5752 6.73477 14.5752C6.73477 14.5752 8.50469 17.1478 8.50469 18.1253Z"
        fill="#E1E6EF"
      />
      <path
        d="M7.58984 17.845C7.58984 18.7121 6.88697 19.415 6.01992 19.415C5.15288 19.415 4.45 18.7121 4.45 17.845C4.45 17.646 4.54439 17.3355 4.70973 16.9582C4.87146 16.5892 5.08865 16.1831 5.30811 15.8035C5.52718 15.4246 5.74654 15.0754 5.91129 14.8208C5.95095 14.7595 5.98742 14.7037 6.01992 14.6544C6.05242 14.7037 6.08889 14.7595 6.12855 14.8208C6.2933 15.0754 6.51266 15.4246 6.73174 15.8035C6.95119 16.1831 7.16838 16.5892 7.33011 16.9582C7.49545 17.3355 7.58984 17.646 7.58984 17.845Z"
        stroke="#1D2433"
        strokeWidth="0.4"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const InOutputSkeleton = () => {
  return (
    <div className="h-8 w-full animate-pulse rounded bg-gradient-to-r from-[#DBDBDB]" />
  );
};
