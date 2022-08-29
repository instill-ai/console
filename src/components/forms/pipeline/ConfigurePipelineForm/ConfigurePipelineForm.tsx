import { FC, useCallback, useState } from "react";
import { Formik } from "formik";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
} from "@instill-ai/design-system";

import { FormikFormBase, TextArea } from "@/components/formik";
import { PrimaryButton } from "@/components/ui";
import { Pipeline, PipelineState } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useDeletePipeline, useUpdatePipeline } from "@/services/pipeline";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { DeleteResourceModal } from "@/components/modals";
import { useRouter } from "next/router";
import OutlineButton from "@/components/ui/Buttons/OutlineButton";
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
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # Handle update pipeline                                          #
  // #                                                                 #
  // ###################################################################

  const [canEdit, setCanEdit] = useState(false);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const updatePipeline = useUpdatePipeline();

  const validateForm = useCallback((values: ConfigurePipelineFormValue) => {
    const errors: Partial<ConfigurePipelineFormValue> = {};

    return errors;
  }, []);

  const handleEditButton = (
    values: ConfigurePipelineFormValue,
    submitForm: () => Promise<void>
  ) => {
    if (!canEdit) {
      setCanEdit(true);
      return;
    }

    submitForm();
  };

  const handleUpdatePipeline = useCallback(
    (values: ConfigurePipelineFormValue) => {
      if (!pipeline) return;

      if (
        pipeline.description === values.description &&
        pipeline.state === values.state
      ) {
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
          description: values.description ?? null,
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
    },
    [updatePipeline, pipeline]
  );

  // ###################################################################
  // #                                                                 #
  // # Handle delete pipeline                                          #
  // #                                                                 #
  // ###################################################################

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
      <Formik
        initialValues={
          {
            description: pipeline ? pipeline.description : null,
            state: pipeline ? pipeline.state : null,
          } as ConfigurePipelineFormValue
        }
        enableReinitialize={true}
        onSubmit={handleUpdatePipeline}
        validate={validateForm}
      >
        {({ values, errors, submitForm }) => {
          return (
            <FormikFormBase
              marginBottom={marginBottom}
              gapY={null}
              padding={null}
              minWidth={null}
            >
              <div className="mb-10 flex flex-col">
                <TextArea
                  id="pipelineDescription"
                  name="description"
                  label="Description"
                  description="Fill with a short description."
                  value={values.description}
                  error={errors.description || null}
                  disabled={canEdit ? false : true}
                  required={false}
                />
              </div>
              <div className="mb-10 flex flex-row">
                <OutlineButton
                  disabled={disableResourceDeletion}
                  onClickHandler={() => setDeletePipelineModalIsOpen(true)}
                  position="mr-auto my-auto"
                  type="button"
                  disabledBgColor="bg-instillGrey15"
                  bgColor="bg-white"
                  hoveredBgColor="hover:bg-instillRed"
                  disabledTextColor="text-instillGrey50"
                  textColor="text-instillRed"
                  hoveredTextColor="hover:text-instillGrey05"
                  width={null}
                  borderSize="border"
                  borderColor="border-instillRed"
                  hoveredBorderColor={null}
                  disabledBorderColor="border-instillGrey15"
                >
                  Delete
                </OutlineButton>
                <PrimaryButton
                  disabled={false}
                  onClickHandler={() => handleEditButton(values, submitForm)}
                  position="ml-auto my-auto"
                  type="button"
                >
                  {canEdit ? "Done" : "Edit"}
                </PrimaryButton>
              </div>
              <div className="flex">
                <BasicProgressMessageBox
                  state={messageBoxState}
                  setState={setMessageBoxState}
                  width="w-[25vw]"
                  closable={true}
                />
              </div>
            </FormikFormBase>
          );
        }}
      </Formik>
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
