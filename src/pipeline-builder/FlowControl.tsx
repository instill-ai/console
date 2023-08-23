import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";
import {
  Button,
  Icons,
  useToast,
  SingleSelectOption,
  DataSourceIcon,
  DataDestinationIcon,
} from "@instill-ai/design-system";
import {
  CreatePipelinePayload,
  ImageWithFallback,
  Nullable,
  UpdatePipelinePayload,
  getInstillApiErrorMessage,
  useActivatePipeline,
  useConnectors,
  useCreatePipeline,
  useDeActivatePipeline,
  usePipeline,
  useRenamePipeline,
  useUpdatePipeline,
  useWatchPipeline,
} from "@instill-ai/toolkit";
import { constructPipelineRecipe } from "./constructPipelineRecipe";
import { useState } from "react";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { Combobox } from "@/components";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  pipelineId: state.pipelineId,
  pipelineDescription: state.pipelineDescription,
  setPipelineUid: state.setPipelineUid,
  pipelineRecipeIsDirty: state.pipelineRecipeIsDirty,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
  updateEdges: state.updateEdges,
  updatePipelineIsNew: state.updatePipelineIsNew,
  pipelineIsNew: state.pipelineIsNew,
});

export type FlowControlProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

/**
 * FlowControl is a component that handles the crucial action of pipeline like
 * - Save pipeline
 * - Activate pipeline
 * - Deactivate pipeline
 */

export const FlowControl = (props: FlowControlProps) => {
  const { accessToken, enableQuery } = props;
  const router = useRouter();
  const {
    nodes,
    pipelineId,
    pipelineDescription,
    setPipelineUid,
    edges,
    updateEdges,
    pipelineRecipeIsDirty,
    updatePipelineRecipeIsDirty,
    updatePipelineIsNew,
    pipelineIsNew,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const { toast } = useToast();
  const { id } = router.query;

  const [aiValue, setAIValue] = useState("");
  const [dataValue, setDataValue] = useState("");

  const ais = useConnectors({
    connectorType: "CONNECTOR_TYPE_AI",
    accessToken: null,
    enabled: true,
  });

  const destinations = useConnectors({
    connectorType: "CONNECTOR_TYPE_DATA",
    accessToken: null,
    enabled: true,
  });

  const pipeline = usePipeline({
    pipelineName: `pipelines/${id}`,
    accessToken,
    enabled: !!id && enableQuery && !pipelineIsNew,
  });

  const pipelineWatchState = useWatchPipeline({
    pipelineName: `pipelines/${id}`,
    accessToken,
    enabled: !!id && !pipelineIsNew && pipeline.isSuccess && enableQuery,
  });

  const updatePipeline = useUpdatePipeline();
  const createPipeline = useCreatePipeline();
  const activatePipeline = useActivatePipeline();
  const deactivatePipeline = useDeActivatePipeline();
  const renamePipeline = useRenamePipeline();

  const [isHandlingConnection, setIsHandlingConnection] = useState(false);

  async function handleTogglePipeline() {
    if (!pipeline.isSuccess || !pipelineWatchState.isSuccess) return;

    setIsHandlingConnection(true);

    if (
      pipelineWatchState.data.state === "STATE_ACTIVE" ||
      pipelineWatchState.data.state === "STATE_ERROR"
    ) {
      try {
        await deactivatePipeline.mutateAsync({
          pipelineName: `pipelines/${pipelineId}`,
          accessToken,
        });

        toast({
          title: "Successfully deativated the pipeline",
          variant: "alert-success",
          size: "small",
        });
        setIsHandlingConnection(false);

        updateEdges((edges) => {
          return edges.map((edge) => ({
            ...edge,
            animated: false,
          }));
        });

        // When user deactivate the pipeline we help them update the pipeline recipe
        if (pipelineRecipeIsDirty) {
          await handleSavePipeline();
        }
      } catch (error) {
        setIsHandlingConnection(false);
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when deactivated the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when deactivated the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
      }
    } else {
      // If the user changed the pipeline's name we need to update the
      // pipeline's name first

      if (pipelineId !== pipeline.data.id) {
        await handleRenamePipeline();
      }

      try {
        // If the user had changed the recipe, we will first save the pipeline
        // then activate the pipeline.

        if (pipelineRecipeIsDirty) {
          await handleSavePipeline();
        }

        await activatePipeline.mutateAsync({
          pipelineName: `pipelines/${pipelineId}`,
          accessToken,
        });

        toast({
          title: "Successfully activated the pipeline",
          variant: "alert-success",
          size: "small",
        });
        setIsHandlingConnection(false);

        updateEdges((edges) => {
          return edges.map((edge) => ({
            ...edge,
            animated: true,
          }));
        });
      } catch (error) {
        setIsHandlingConnection(false);
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when activated the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when activated the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
      }
    }
  }

  const [isSaving, setIsSaving] = useState(false);

  async function handleSavePipeline() {
    if (!pipelineId) {
      toast({
        title: "Pipeline ID not set",
        description:
          "The pipeline ID should be set before saving the pipeline.",
        variant: "alert-error",
        size: "large",
      });
      return;
    }

    setIsSaving(true);

    if (pipeline.isSuccess) {
      // We need to rename the pipeline if the user changed the pipeline's name
      if (pipelineId !== pipeline.data.id) {
        await handleRenamePipeline();
      }

      const payload: UpdatePipelinePayload = {
        name: `pipelines/${pipelineId}`,
        description: pipelineDescription ?? undefined,
        // recipe: constructPipelineRecipe(nodes, edges),
      };

      try {
        await updatePipeline.mutateAsync({
          payload,
          accessToken,
        });
        toast({
          title: "Pipeline is saved",
          variant: "alert-success",
          size: "small",
        });
        updatePipelineRecipeIsDirty(() => false);
      } catch (error) {
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
      }
      setIsSaving(false);
      return;
    }

    // If the user haven't created the pipeline yet, we will create the pipeline

    const payload: CreatePipelinePayload = {
      id: pipelineId,
      description: pipelineDescription ?? undefined,
      recipe: constructPipelineRecipe(nodes, edges),
    };

    try {
      const res = await createPipeline.mutateAsync({
        payload,
        accessToken,
      });

      setPipelineUid(res.pipeline.uid);

      router.push(`/pipelines/${pipelineId}`, undefined, {
        shallow: true,
      });

      updatePipelineIsNew(() => false);

      toast({
        title: "Successfully created the pipeline",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
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
    }

    setIsSaving(false);
  }

  async function handleRenamePipeline() {
    if (!pipelineId || !pipeline.isSuccess) {
      return;
    }

    try {
      await renamePipeline.mutateAsync({
        payload: {
          pipelineId: pipeline.data.id,
          newPipelineId: pipelineId,
        },
        accessToken,
      });

      router.push(`/pipelines/${pipelineId}`, undefined, {
        shallow: true,
      });

      toast({
        title: "Sussessfully renamed the pipeline",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Something went wrong when rename the pipeline",
          description: getInstillApiErrorMessage(error),
          variant: "alert-error",
          size: "large",
        });
      } else {
        toast({
          title: "Something went wrong when rename the pipeline",
          variant: "alert-error",
          description: "Please try again later",
          size: "large",
        });
      }
    }
  }

  const aiItems: SingleSelectOption[] =
    ais?.data?.map((ai) => {
      return {
        label: ai.id,
        value: ai.id,
        startIcon: (
          <ImageWithFallback
            src={`/icons/${ai.connector_definition.vendor}/${ai.connector_definition.icon}`}
            width={16}
            height={16}
            alt={`${ai}-icon`}
            fallbackImg={
              ai.connector_definition.name.split("/")[0].split("-")[0] ===
              "source" ? (
                <DataSourceIcon
                  width="w-4"
                  height="h-4"
                  color="fill-semantic-bg-secondary-base-bg"
                  position="my-auto"
                />
              ) : (
                <DataDestinationIcon
                  width="w-4"
                  height="h-4"
                  color="fill-semantic-bg-secondary-base-bg"
                  position="my-auto"
                />
              )
            }
          />
        ),
      };
    }) || [];

  const dataItems: SingleSelectOption[] =
    destinations?.data?.map((data) => {
      return {
        label: data.id,
        value: data.id,
        startIcon: (
          <ImageWithFallback
            src={`/icons/${data.connector_definition.vendor}/${data.connector_definition.icon}`}
            width={16}
            height={16}
            alt={`${data}-icon`}
            fallbackImg={
              data.connector_definition.name.split("/")[0].split("-")[0] ===
              "source" ? (
                <DataSourceIcon
                  width="w-4"
                  height="h-4"
                  color="fill-semantic-bg-secondary-base-bg"
                  position="my-auto"
                />
              ) : (
                <DataDestinationIcon
                  width="w-4"
                  height="h-4"
                  color="fill-semantic-bg-secondary-base-bg"
                  position="my-auto"
                />
              )
            }
          />
        ),
      };
    }) || [];

  return (
    <>
      <div className="absolute right-8 top-8 flex flex-row-reverse gap-x-4">
        <Button
          onClick={handleTogglePipeline}
          className="gap-x-2"
          variant="primary"
          size="lg"
          disabled={
            pipeline.isSuccess && pipelineWatchState.isSuccess ? false : true
          }
        >
          {pipelineWatchState.isSuccess ? (
            pipelineWatchState.data.state === "STATE_ACTIVE" ||
            pipelineWatchState.data.state === "STATE_ERROR" ? (
              <>
                <span>Unpublish</span>
                {isHandlingConnection ? (
                  <svg
                    className="m-auto h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <Icons.Stop className="h-4 w-4 fill-semantic-fg-on-default stroke-semantic-fg-on-default group-disabled:fill-semantic-fg-disabled group-disabled:stroke-semantic-fg-disabled" />
                )}
              </>
            ) : (
              <>
                <span>Publish</span>
                {isHandlingConnection ? (
                  <svg
                    className="m-auto h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <Icons.Play className="h-4 w-4 fill-semantic-fg-on-default stroke-semantic-fg-on-default group-disabled:fill-semantic-fg-disabled group-disabled:stroke-semantic-fg-disabled" />
                )}
              </>
            )
          ) : (
            "Disabled"
          )}
        </Button>
        <Button
          onClick={handleSavePipeline}
          className="gap-x-2"
          variant="secondaryGrey"
          size="lg"
        >
          Save
          {isSaving ? (
            <svg
              className="m-auto h-4 w-4 animate-spin text-semantic-fg-secondary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <Icons.Save01 className="h-5 w-5 stroke-semantic-fg-primary" />
          )}
        </Button>
      </div>
      <div className="absolute left-8 top-8 flex flex-row gap-x-4">
        <Combobox
          items={aiItems}
          placeholder="Search"
          notFoundPlaceholder="No Item Found"
          value={aiValue}
          setValue={setAIValue}
          label={
            <Button size="lg" className="gap-x-2" variant="primary">
              {aiValue
                ? aiItems.find((aiItem) => aiItem.value === aiValue)?.label
                : "AI"}
              <Icons.Plus className="my-auto h-5 w-5 stroke-semantic-bg-primary " />
            </Button>
          }
        />

        <Combobox
          items={dataItems}
          placeholder="Search"
          notFoundPlaceholder="No Item Found"
          value={dataValue}
          setValue={setDataValue}
          label={
            <Button size="lg" className="gap-x-2" variant="primary">
              {dataValue
                ? dataItems.find((dataItem) => dataItem.value === dataValue)
                    ?.label
                : "Data"}
              <Icons.Plus className="my-auto h-5 w-5 stroke-semantic-bg-primary " />
            </Button>
          }
        />
      </div>
    </>
  );
};
