import * as React from "react";
import * as z from "zod";
import { useRouter } from "next/router";
import {
  GeneralRecord,
  InstillStore,
  Nullable,
  StartOperatorMetadata,
  TriggerUserPipelineResponse,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useEntity,
  useInstillStore,
  useShallow,
  useStartOperatorTriggerPipelineForm,
  useTriggerUserPipeline,
  useUserPipeline,
} from "../../../lib";
import {
  Button,
  Form,
  Icons,
  Skeleton,
  useToast,
} from "@instill-ai/design-system";
import { recursiveHelpers } from "../../pipeline-builder";
import { ComponentOutputs } from "../../pipeline-builder/components/ComponentOutputs";
import { getPipelineInputOutputSchema } from "../../pipeline-builder/lib/getPipelineInputOutputSchema";
import { LoadingSpin } from "../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const InOutPut = () => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const [response, setResponse] =
    React.useState<Nullable<TriggerUserPipelineResponse>>(null);

  const inOutPutFormID = "pipeline-details-page-trigger-pipeline-form";

  const { toast } = useToast();

  const entityObject = useEntity();

  const pipeline = useUserPipeline({
    pipelineName: entityObject.pipelineName,
    enabled: enabledQuery && entityObject.isSuccess,
    accessToken,
  });

  const startComponent = React.useMemo(() => {
    if (!pipeline.isSuccess) return null;

    return (
      pipeline.data.recipe.components.find((c) => c.id === "start") ?? null
    );
  }, [pipeline.isSuccess, pipeline.data]);

  const { fields, form, Schema } = useStartOperatorTriggerPipelineForm({
    mode: "demo",
    metadata: startComponent ? startComponent.configuration.metadata : null,
    keyPrefix: "pipeline-details-page-trigger-pipeline-form",
    disabledFields: false,
    disabledFieldControls: true,
  });

  const triggerPipeline = useTriggerUserPipeline();

  async function onTriggerPipeline(formData: z.infer<typeof Schema>) {
    if (!entityObject.isSuccess || !pipeline.isSuccess) return;

    const input = recursiveHelpers.removeUndefinedAndNullFromArray(
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(formData)
    );

    const startOperatorMetadata = pipeline.data.recipe.components.find(
      (component) => component.id === "start"
    )?.configuration.metadata as StartOperatorMetadata | undefined;

    // Backend need to have the encoded JSON input. So we need to double check
    // the metadata whether this field is a semi-structured object and parse it

    const semiStructuredObjectKeys: string[] = [];

    if (startOperatorMetadata) {
      Object.entries(startOperatorMetadata).forEach(([key, value]) => {
        if (value.instillFormat === "semi-structured/object") {
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
        return;
      }
    }

    try {
      const data = await triggerPipeline.mutateAsync({
        pipelineName: entityObject.pipelineName,
        accessToken,
        payload: {
          inputs: [parsedStructuredData],
        },
        returnTraces: true,
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("trigger_pipeline");
      }

      setResponse(data);
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when trigger the pipeline",
        error,
        toast,
      });
    }
  }

  const inputIsNotDefined = React.useMemo(() => {
    if (!pipeline.isSuccess) return false;

    const startComponent = pipeline.data.recipe.components.find(
      (e) => e.id === "start"
    );

    if (
      startComponent &&
      startComponent.configuration &&
      startComponent.configuration.metadata &&
      Object.keys(startComponent.configuration.metadata).length > 0
    ) {
      return false;
    }

    return true;
  }, [pipeline.isSuccess, pipeline.data]);

  const outputIsNotDefined = React.useMemo(() => {
    if (!pipeline.isSuccess) return true;

    const endComponent = pipeline.data.recipe.components.find(
      (e) => e.id === "end"
    );

    if (
      endComponent &&
      endComponent.configuration &&
      endComponent.configuration.metadata &&
      Object.keys(endComponent.configuration.metadata).length > 0
    ) {
      return false;
    }

    return true;
  }, [pipeline.isSuccess, pipeline.data]);

  const pipelineOpenAPISchema = React.useMemo(() => {
    if (!pipeline.isSuccess) return null;

    const { outputSchema } = getPipelineInputOutputSchema(
      pipeline.data.openapi_schema
    );

    return outputSchema;
  }, [pipeline.isSuccess, pipeline.data]);

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-row-reverse">
        {pipeline.isSuccess ? (
          !accessToken ? (
            <Button
              onClick={() => {
                router.push("/login");
              }}
              type="button"
              variant="secondaryColour"
              size="md"
            >
              Log in to run
            </Button>
          ) : inputIsNotDefined || outputIsNotDefined ? null : (
            <Button
              variant="secondaryColour"
              size="md"
              className="flex flex-row gap-x-2"
              type="submit"
              form={inOutPutFormID}
            >
              Run
              {triggerPipeline.isLoading ? (
                <LoadingSpin className="!h-4 !w-4 !text-semantic-accent-default" />
              ) : (
                <Icons.Play className="h-4 w-4 stroke-semantic-accent-default" />
              )}
            </Button>
          )
        ) : (
          <RunButtonSkeleton />
        )}
      </div>
      <div className="mb-6 flex flex-col gap-y-6">
        <div className="bg-semantic-bg-base-bg px-3 py-2 product-body-text-1-semibold">
          Input
        </div>
        {pipeline.isSuccess ? (
          inputIsNotDefined ? (
            <div className="flex flex-row justify-between">
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
                    `/${entityObject.entity}/pipelines/${entityObject.id}/builder`
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
                <div className="flex flex-col gap-y-3">{fields}</div>
              </form>
            </Form.Root>
          )
        ) : (
          <InOutputSkeleton />
        )}
      </div>
      <div className="mb-6 flex flex-col gap-y-6">
        <div className="bg-semantic-bg-base-bg px-3 py-2 product-body-text-1-semibold">
          Output
        </div>
        {pipeline.isSuccess ? (
          outputIsNotDefined ? (
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-x-6">
                <CryingFaceSVG className="my-auto h-10 w-10 shrink-0 grow-0" />
                <p className="my-auto font-mono text-sm italic text-semantic-fg-disabled">
                  Pipeline output is not defined.
                </p>
              </div>
              <Button
                variant="tertiaryColour"
                size="md"
                onClick={() => {
                  router.push(
                    `/${entityObject.entity}/pipelines/${entityObject.id}/builder`
                  );
                }}
              >
                Setup
              </Button>
            </div>
          ) : (
            <ComponentOutputs
              componentID="end"
              outputSchema={pipelineOpenAPISchema}
              nodeType="end"
              chooseTitleFrom="title"
              response={response}
            />
          )
        ) : (
          <InOutputSkeleton />
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

export const RunButtonSkeleton = () => {
  return <Skeleton className="w-18 h-8 rounded" />;
};
