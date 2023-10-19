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
} from "../../../../lib";
import { StartNodeInputForm } from "./StartNodeInputForm";
import { LoadingSpin } from "../../../../components";

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
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const { toast } = useToast();

  const {
    Schema: StartOperatorTestModeInputSchema,
    fields: startOperatorTestModeInputfields,
    form: startOperatorTestModeInputForm,
  } = useStartOperatorTestModeInputForm({ nodes });

  const useTriggerPipeline = useTriggerUserPipeline();

  const onTriggerPipeline = (
    data: z.infer<typeof StartOperatorTestModeInputSchema>
  ) => {
    if (!pipelineName) return;

    const input = recursiveRemoveUndefinedAndNullFromArray(
      recursiveReplaceNullAndEmptyStringWithUndefined(data)
    );

    setIsTriggering(true);

    useTriggerPipeline.mutate(
      {
        pipelineName,
        accessToken,
        payload: {
          inputs: [input],
        },
        returnTraces: true,
      },
      {
        onSuccess: (data) => {
          setIsTriggering(false);
          updateTestModeTriggerResponse(() => data);
        },
        onError: (error) => {
          setIsTriggering(false);
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when trigger the pipeline",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when trigger the pipeline",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }
        },
      }
    );
  };

  const hasSourceEdges = React.useMemo(() => {
    return edges.some((edge) => edge.source === id);
  }, [edges, id]);

  return (
    <React.Fragment>
      <div className="relative flex min-w-[246px] flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg">
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
