import * as React from "react";
import * as z from "zod";
import { useRouter } from "next/router";
import {
  InstillStore,
  Nullable,
  TriggerUserPipelineResponse,
  toastInstillError,
  useInstillStore,
  useShallow,
  useStartOperatorTriggerPipelineForm,
  useTriggerUserPipeline,
  useUserPipeline,
} from "../../../lib";
import { Button, Form, Icons, useToast } from "@instill-ai/design-system";
import {
  recursiveRemoveUndefinedAndNullFromArray,
  recursiveReplaceNullAndEmptyStringWithUndefined,
} from "../../pipeline-builder";
import { ComponentOutputs } from "../../pipeline-builder/components/ComponentOutputs";
import { getPipelineInputOutputSchema } from "../../pipeline-builder/lib/getPipelineInputOutputSchema";
import { LoadingSpin } from "../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const InOutPut = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { id, entity } = router.query;
  const [response, setResponse] =
    React.useState<Nullable<TriggerUserPipelineResponse>>(null);
  const [isTriggering, setIsTriggering] = React.useState(false);

  const inOutPutFormID = "pipeline-details-page-trigger-pipeline-form";

  const { toast } = useToast();

  const pipelineName = `users/${entity}/pipelines/${id}`;

  const pipeline = useUserPipeline({
    pipelineName: id ? pipelineName : null,
    accessToken,
    enabled: enabledQuery && !!accessToken,
  });

  const startComponent = React.useMemo(() => {
    if (!pipeline.isSuccess) return null;

    return (
      pipeline.data.recipe.components.find((c) => c.id === "start") ?? null
    );
  }, [pipeline.isSuccess, pipeline.data]);

  const { fields, form, Schema } = useStartOperatorTriggerPipelineForm({
    metadata: startComponent ? startComponent.configuration.metadata : null,
    keyPrefix: "pipeline-details-page-trigger-pipeline-form",
    disabledFields: false,
    disabledFieldControls: true,
  });

  const triggerPipeline = useTriggerUserPipeline();

  async function onTriggerPipeline(data: z.infer<typeof Schema>) {
    const input = recursiveRemoveUndefinedAndNullFromArray(
      recursiveReplaceNullAndEmptyStringWithUndefined(data)
    );

    setIsTriggering(true);

    try {
      const data = await triggerPipeline.mutateAsync({
        pipelineName,
        accessToken,
        payload: {
          inputs: [input],
        },
        returnTraces: true,
      });

      setResponse(data);
      setIsTriggering(false);
    } catch (error) {
      setIsTriggering(false);
      toastInstillError({
        title: "Something went wrong when trigger the pipeline",
        error,
        toast,
      });
    }
  }

  const pipelineOpenAPISchema = React.useMemo(() => {
    if (!pipeline.isSuccess) return null;

    const { outputSchema } = getPipelineInputOutputSchema(
      pipeline.data.openapi_schema
    );

    return outputSchema;
  }, [pipeline.isSuccess, pipeline.data]);

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col gap-y-6">
        <div className="bg-semantic-bg-base-bg px-3 py-2 product-body-text-1-semibold">
          Input
        </div>
        <Form.Root {...form}>
          <form
            id={inOutPutFormID}
            className="w-full"
            onSubmit={form.handleSubmit(onTriggerPipeline)}
          >
            <div className="flex flex-col gap-y-3">{fields}</div>
          </form>
        </Form.Root>
      </div>
      <div className="mb-6 flex flex-col gap-y-6">
        <div className="bg-semantic-bg-base-bg px-3 py-2 product-body-text-1-semibold">
          Output
        </div>
        <ComponentOutputs
          componentID="end"
          outputSchema={pipelineOpenAPISchema}
          nodeType="end"
          response={response}
        />
      </div>
      <div className="flex flex-row-reverse">
        <Button
          variant="secondaryColour"
          size="md"
          className="flex flex-row gap-x-2"
          type="submit"
          form={inOutPutFormID}
        >
          Run
          {isTriggering ? (
            <LoadingSpin className="!text-semantic-accent-default" />
          ) : (
            <Icons.Play className="h-4 w-4 stroke-semantic-accent-default" />
          )}
        </Button>
      </div>
    </div>
  );
};
