import { ChangeEvent, FC, useCallback, useState } from "react";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
  OutlineButton,
  SolidButton,
  BasicTextArea,
} from "@instill-ai/design-system";

import { DeleteResourceModal, FormBase } from "@/components/ui";
import { Pipeline, PipelineState } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useDeletePipeline, useUpdatePipeline } from "@/services/pipeline";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import useDeleteResourceGuard from "@/hooks/useDeleteResourceGuard";

export type ConfigurePipelineFormProps = {
  pipeline: Nullable<Pipeline>;
  marginBottom: Nullable<string>;
};

export type ConfigurePipelineFormValue = {
  description: Nullable<string>;
  state: Nullable<PipelineState>;
};

const ConfigurePipelineForm: FC<ConfigurePipelineFormProps> = ({
  pipeline,
  marginBottom,
}) => {
  // ##########################################################################
  // # Initialize necessary state and function                                #
  // ##########################################################################

  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const [fieldValues, setFieldValues] = useState({
    description: pipeline ? pipeline.description : null,
    state: pipeline ? pipeline.state : null,
  });

  const [fieldErrors, _] = useState({
    description: null,
    state: null,
  });

  const updateFieldValues = useCallback(
    (field: string, value: Nullable<string | File>) => {
      setFieldValues((prev) => {
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [setFieldValues]
  );

  // ##########################################################################
  // # Handle update pipeline                                                 #
  // ##########################################################################

  const [canEdit, setCanEdit] = useState(false);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const updatePipeline = useUpdatePipeline();

  const handleSubmit = useCallback(() => {
    if (!canEdit) {
      setCanEdit(true);
      return;
    }

    if (!pipeline) return;

    if (pipeline.description === fieldValues.description) {
      setCanEdit(false);
      return;
    }

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Updating...",
    }));

    updatePipeline.mutate(
      {
        name: pipeline.name,
        description: fieldValues.description ?? null,
      },
      {
        onSuccess: () => {
          setCanEdit(false);
          setMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));
        },
        onError: (error) => {
          if (error instanceof Error) {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.message,
            }));
          } else {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when update the pipeline",
            }));
          }
        },
      }
    );
  }, [canEdit, fieldValues, updatePipeline, pipeline]);

  // ##########################################################################
  // # Handle delete pipeline                                                 #
  // ##########################################################################

  const { disableResourceDeletion } = useDeleteResourceGuard();

  const [deletePipelineModalIsOpen, setDeletePipelineModalIsOpen] =
    useState(false);

  const deletePipeline = useDeletePipeline();

  const handleDeletePipeline = useCallback(() => {
    if (!pipeline) return;

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Deleting...",
    }));

    deletePipeline.mutate(pipeline.name, {
      onSuccess: () => {
        setMessageBoxState(() => ({
          activate: true,
          status: "success",
          description: null,
          message: "Succeed.",
        }));
        if (amplitudeIsInit) {
          sendAmplitudeData("delete_pipeline", {
            type: "critical_action",
            process: "destination",
          });
        }
        router.push("/pipelines");
      },
      onError: (error) => {
        if (error instanceof Error) {
          setMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: error.message,
          }));
        } else {
          setMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: "Something went wrong when delete the pipeline",
          }));
        }
      },
    });
    setDeletePipelineModalIsOpen(false);
  }, [pipeline, amplitudeIsInit, router, deletePipeline]);

  return (
    <>
      <FormBase
        flex1={false}
        noValidate={true}
        marginBottom={marginBottom}
        padding={null}
      >
        <div className="flex flex-col mb-10">
          <BasicTextArea
            id="pipelineDescription"
            label="Description"
            key="pipelineDescription"
            description="Fill with a short description."
            required={false}
            disabled={canEdit ? false : true}
            error={fieldErrors.description}
            value={fieldValues.description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              updateFieldValues("description", event.target.value);
            }}
          />
        </div>
        <div className="mb-10 flex flex-row">
          <OutlineButton
            disabled={disableResourceDeletion}
            onClickHandler={() => setDeletePipelineModalIsOpen(true)}
            position="mr-auto my-auto"
            type="button"
            color="danger"
            hoveredShadow={null}
          >
            Delete
          </OutlineButton>
          <SolidButton
            disabled={false}
            onClickHandler={() => handleSubmit()}
            position="ml-auto my-auto"
            type="button"
            color="primary"
          >
            {canEdit ? "Save" : "Edit"}
          </SolidButton>
        </div>
        <div className="flex">
          <BasicProgressMessageBox
            state={messageBoxState}
            setState={setMessageBoxState}
            width="w-[25vw]"
            closable={true}
          />
        </div>
      </FormBase>
      <DeleteResourceModal
        resource={pipeline}
        modalIsOpen={deletePipelineModalIsOpen}
        setModalIsOpen={setDeletePipelineModalIsOpen}
        handleDeleteResource={handleDeletePipeline}
      />
    </>
  );
};

export default ConfigurePipelineForm;
