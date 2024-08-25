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

      const stream = await triggerPipeline.mutateAsync({
        namespacePipelineName: pipelineName,
        accessToken,
        inputs: [parsedStructuredData],
        returnTraces: true,
        requesterUid: tartgetNamespace ? tartgetNamespace.uid : undefined,
      });

      for await (const chunk of stream.body) {
        if (chunk === null) {
          continue;
        }

        console.log(chunk);
        const text =
          typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
        const eventStrings = text
          .split("\n\n")
          .filter((str) => str.trim() !== "");

        const events = eventStrings.map((eventString) => {
          const lines = eventString.split("\n");
          let event = "";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event:")) {
              event = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              data = line.slice(5).trim();
            }
          }

          // Parse the data as JSON if possible
          try {
            data = JSON.parse(data);
          } catch (e) {
            // If parsing fails, keep data as a string
          }

          return { event, data };
        });

        for (const event of events) {
          console.log(event);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col w-full">
      <h3 className="py-2 product-body-text-1-semibold text-semantic-fg-primary">
        Input
      </h3>
      <div className="flex w-full flex-row border-b border-semantic-bg-line mb-3 box-border">
        <p
          className="font-fans text-sm border-b-[2px] py-1 pb-2 border-semantic-accent-default"
          style={{ color: "#5F6D86" }}
        >
          Form
        </p>
      </div>
      <Form.Root {...form}>
        <form
          id="variable-node-trigger-pipeline-form"
          className="w-full"
          onSubmit={form.handleSubmit(onTriggerPipeline)}
        >
          <div className="flex flex-col gap-y-4">{fieldItems}</div>
        </form>
      </Form.Root>
    </div>
  );
};
