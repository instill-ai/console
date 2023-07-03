import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import { Button, Icons, useToast } from "@instill-ai/design-system";
import {
  CreatePipelinePayload,
  UpdatePipelinePayload,
  getInstillApiErrorMessage,
  useCreatePipeline,
  useUpdatePipeline,
} from "@instill-ai/toolkit";
import { isAxiosError } from "axios";
import { shallow } from "zustand/shallow";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  pipelineId: state.pipelineId,
  pipelineDescription: state.pipelineDescription,
  pipelineUid: state.pipelineUid,
  setPipelineUid: state.setPipelineUid,
});

export const FlowControl = () => {
  const {
    nodes,
    pipelineId,
    pipelineDescription,
    pipelineUid,
    setPipelineUid,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);
  const { toast } = useToast();

  const updatePipeline = useUpdatePipeline();
  const createPipeline = useCreatePipeline();

  return (
    <div className="absolute bottom-4 right-4 flex flex-row-reverse gap-x-4">
      <Button
        onClick={() => {
          const createPipelinePayload: CreatePipelinePayload = {
            id: "test-pipeline",
            recipe: {
              version: "v1alpha",
              components: nodes.map((node) => ({
                id: node.id,
                resource_name: node.data.connector.name,
              })),
            },
          };
        }}
        className="gap-x-2"
        variant="primary"
        size="lg"
      >
        Activate
        <Icons.Play className="h-5 w-5 stroke-semantic-bg-primary" />
      </Button>
      <Button
        onClick={() => {
          if (!pipelineId) {
            toast({
              title: "Pipeline ID is not set",
              description:
                "Pipeline ID is not set, please set it at the top navbar",
              variant: "alert-error",
              size: "large",
            });
            return;
          }

          if (pipelineUid) {
            const payload: UpdatePipelinePayload = {
              name: `pipelines/${pipelineId}`,
              description: pipelineDescription ?? undefined,
              recipe: {
                version: "v1alpha",
                components: nodes.map((node) => ({
                  id: node.id,
                  resource_name: node.data.connector.name,
                })),
              },
            };

            updatePipeline.mutate(
              {
                payload,
                accessToken: null,
              },
              {
                onSuccess: () => {
                  toast({
                    title: "Pipeline is saved",
                    variant: "alert-success",
                    size: "small",
                  });
                },
              }
            );

            return;
          }

          const payload: CreatePipelinePayload = {
            id: pipelineId,
            recipe: {
              version: "v1alpha",
              components: nodes.map((node) => ({
                id: node.id,
                resource_name: node.data.connector.name,
              })),
            },
          };

          createPipeline.mutate(
            {
              payload,
              accessToken: null,
            },
            {
              onSuccess: async (res) => {
                setPipelineUid(res.pipeline.uid);
                if (!pipelineDescription) {
                  toast({
                    title: "Pipeline is saved",
                    variant: "alert-success",
                    size: "small",
                  });
                  return;
                }
                updatePipeline.mutate(
                  {
                    payload: {
                      name: res.pipeline.name,
                      description: pipelineDescription,
                    },
                    accessToken: null,
                  },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Pipeline is saved",
                        variant: "alert-success",
                        size: "small",
                      });
                    },
                    onError: (error) => {
                      if (isAxiosError(error)) {
                        toast({
                          title: "Something went wrong when save the pipeline",
                          description: getInstillApiErrorMessage(error),
                          variant: "alert-error",
                          size: "large",
                        });
                      } else {
                        toast({
                          title: "Something went wrong when save the pipeline",
                          variant: "alert-error",
                          size: "large",
                        });
                      }
                    },
                  }
                );
              },
              onError: (error) => {
                if (isAxiosError(error)) {
                  toast({
                    title: "Something went wrong when save the pipeline",
                    description: getInstillApiErrorMessage(error),
                    variant: "alert-error",
                    size: "large",
                  });
                } else {
                  toast({
                    title: "Something went wrong when save the pipeline",
                    variant: "alert-error",
                    size: "large",
                  });
                }
              },
            }
          );
        }}
        className="gap-x-2"
        variant="secondaryGrey"
        size="lg"
      >
        Save
        <Icons.Save01 className="h-5 w-5 stroke-semantic-fg-primary" />
      </Button>
    </div>
  );
};
