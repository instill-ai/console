import * as React from "react";
import { PipelineVariableFieldMap } from "instill-sdk";
import * as z from "zod";

import { Form } from "@instill-ai/design-system";

import {
  GeneralRecord,
  InstillStore,
  Nullable,
  useInstillStore,
  usePipelineTriggerRequestForm,
  useShallow,
  useStreamingTriggerUserPipeline,
  useUserNamespaces,
} from "../../lib";
import { env } from "../../server";
import { recursiveHelpers } from "../pipeline-builder";

const selector = (store: InstillStore) => ({
  updateIsTriggeringPipeline: store.updateIsTriggeringPipeline,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  accessToken: store.accessToken,
  updateTriggerWithStreamData: store.updateTriggerWithStreamData,
});

export const Input = ({
  fields,
  pipelineName,
}: {
  pipelineName: Nullable<string>;
  fields: Nullable<PipelineVariableFieldMap>;
}) => {
  const {
    updateIsTriggeringPipeline,
    navigationNamespaceAnchor,
    accessToken,
    updateTriggerWithStreamData,
  } = useInstillStore(useShallow(selector));

  const [sseURL, setSseURL] = React.useState<Nullable<string>>(null);

  const { Schema, fieldItems, form } = usePipelineTriggerRequestForm({
    mode: "build",
    fields: fields,
    onDeleteField: () => {},
    onEditField: () => {},
    disabledFieldControls: true,
    disabledReferenceHint: true,
  });

  const namespace = useUserNamespaces();
  const triggerPipeline = useStreamingTriggerUserPipeline();
  async function onTriggerPipeline(formData: z.infer<typeof Schema>) {
    if (!pipelineName || !formData || !fields) return;

    const input = recursiveHelpers.removeUndefinedAndNullFromArray(
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(formData),
    );

    // Backend need to have the encoded JSON input. So we need to double check
    // the metadata whether this field is a semi-structured object and parse it

    const semiStructuredObjectKeys: string[] = [];

    Object.entries(fields).forEach(([key, value]) => {
      if (value.instillFormat === "semi-structured/json") {
        semiStructuredObjectKeys.push(key);
      }
    });

    const parsedStructuredData: GeneralRecord = input;

    updateTriggerWithStreamData(() => []);

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

    updateIsTriggeringPipeline(() => true);

    try {
      const tartgetNamespace = namespace.find(
        (ns) => ns.id === navigationNamespaceAnchor,
      );

      const data = await triggerPipeline.mutateAsync({
        namespacePipelineName: pipelineName,
        accessToken,
        inputs: [parsedStructuredData],
        returnTraces: true,
        requesterUid: tartgetNamespace ? tartgetNamespace.uid : undefined,
      });

      setSseURL(
        `${env("NEXT_PUBLIC_API_GATEWAY_URL")}/v1beta/sse/${data.sessionUUID}`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    if (!sseURL) {
      return;
    }

    const sse = new EventSource(sseURL);

    sse.addEventListener("output", (event) => {
      let data: Nullable<GeneralRecord> = null;

      try {
        data = JSON.parse(event.data);
        if (data) {
          const result = data.result;

          if (result) {
            updateTriggerWithStreamData((prev) => [...prev, result]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

    sse.addEventListener("done", () => {
      updateIsTriggeringPipeline(() => false);
      sse.close();
    });

    sse.onerror = (event) => {
      console.log(event);
      sse.close();
    };

    return () => {
      sse.close();
    };
  }, [sseURL, updateIsTriggeringPipeline, updateTriggerWithStreamData]);

  return (
    <Form.Root {...form}>
      <form
        id="variable-node-trigger-pipeline-form"
        className="w-full"
        onSubmit={form.handleSubmit(onTriggerPipeline)}
      >
        <div className="flex flex-col gap-y-4">{fieldItems}</div>
      </form>
    </Form.Root>
  );
};
