import * as React from "react";
import * as z from "zod";
import { isAxiosError } from "axios";
import { NodeProps, Position } from "reactflow";
import { shallow } from "zustand/shallow";
import { StartNodeData } from "../../type";
import { Button, Form, Icons, useToast } from "@instill-ai/design-system";

import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../../usePipelineBuilderStore";
import {
  recursiveRemoveUndefinedAndNullFromArray,
  recursiveReplaceNullAndEmptyStringWithUndefined,
} from "../../lib";
import { CustomHandle } from "../CustomHandle";
import { useStartOperatorTestModeInputForm } from "../../use-node-input-fields";
import {
  getInstillApiErrorMessage,
  useTriggerUserPipeline,
  useTriggerUserPipelineRelease,
} from "../../../../lib";
import { StartNodeInputForm } from "./StartNodeInputForm";
import { LoadingSpin } from "../../../../components";
import { toastInstillError } from "../../../../lib/toastInstillError";

export const CreateStartOperatorInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  key: z.string().min(1, { message: "Key is required" }),
});

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  pipelineIsNew: state.pipelineIsNew,
  pipelineName: state.pipelineName,
  nodes: state.nodes,
  edges: state.edges,
  testModeEnabled: state.testModeEnabled,
  updateTestModeTriggerResponse: state.updateTestModeTriggerResponse,
  accessToken: state.accessToken,
  currentVersion: state.currentVersion,
});

export const StartNode = ({ data, id }: NodeProps<StartNodeData>) => {
  const [isTriggering, setIsTriggering] = React.useState(false);

  const {
    pipelineName,
    nodes,
    edges,
    testModeEnabled,
    updateTestModeTriggerResponse,
    accessToken,
    currentVersion,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const { toast } = useToast();

  const {
    Schema: StartOperatorTestModeInputSchema,
    fields: startOperatorTestModeInputfields,
    form: startOperatorTestModeInputForm,
  } = useStartOperatorTestModeInputForm({ nodes });

  React.useEffect(() => {
    if (!testModeEnabled) {
      setIsTriggering(false);
    }
    updateTestModeTriggerResponse(() => null);
    startOperatorTestModeInputForm.reset();
  }, [testModeEnabled]);

  const useTriggerPipeline = useTriggerUserPipeline();
  const useTriggerPipelineRelease = useTriggerUserPipelineRelease();

  async function onTriggerPipeline(
    data: z.infer<typeof StartOperatorTestModeInputSchema>
  ) {
    if (!pipelineName) return;

    const input = recursiveRemoveUndefinedAndNullFromArray(
      recursiveReplaceNullAndEmptyStringWithUndefined(data)
    );

    setIsTriggering(true);

    if (currentVersion === "latest") {
      try {
        const data = await useTriggerPipeline.mutateAsync({
          pipelineName,
          accessToken,
          payload: {
            inputs: [input],
          },
          returnTraces: true,
        });

        setIsTriggering(false);
        updateTestModeTriggerResponse(() => data);
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
          toast,
        });
      }
    } else {
      try {
        const data = await useTriggerPipelineRelease.mutateAsync({
          pipelineReleaseName: `${pipelineName}/releases/${currentVersion}`,
          payload: {
            inputs: [input],
          },
          accessToken,
          returnTraces: true,
        });

        setIsTriggering(false);
        updateTestModeTriggerResponse(() => data);
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when trigger the pipeline",
          error,
          toast,
        });
      }
    }
  }

  const hasSourceEdges = React.useMemo(() => {
    return edges.some((edge) => edge.source === id);
  }, [edges, id]);

  return (
    <React.Fragment>
      <div className="relative flex min-w-[332px] flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            start
          </p>
        </div>
        <div className="flex flex-col">
          {testModeEnabled ? (
            <Form.Root {...startOperatorTestModeInputForm}>
              <form
                className="w-full"
                onSubmit={startOperatorTestModeInputForm.handleSubmit(
                  onTriggerPipeline
                )}
              >
                <div className="flex flex-col space-y-3">
                  {...startOperatorTestModeInputfields}
                </div>
                <div className="absolute left-[6px] top-0 -translate-y-[calc(100%+2px)]">
                  <Button
                    type="submit"
                    variant="secondaryGrey"
                    size="lg"
                    className="gap-x-2"
                    disabled={isTriggering}
                  >
                    Run
                    {isTriggering ? (
                      <LoadingSpin className="!text-semantic-fg-secondary" />
                    ) : (
                      <Icons.Play className="h-4 w-4 stroke-semantic-fg-primary" />
                    )}
                  </Button>
                </div>
              </form>
            </Form.Root>
          ) : (
            <StartNodeInputForm data={data} />
          )}
        </div>
      </div>
      <CustomHandle
        className={hasSourceEdges ? "" : "!opacity-0"}
        type="source"
        position={Position.Right}
        id={id}
      />
    </React.Fragment>
  );
};
