import { FC, useCallback, useState } from "react";
import { Formik } from "formik";
import { BasicProgressMessageBox } from "@instill-ai/design-system";

import { FormBase, TextArea, ToggleField } from "@/components/formik";
import { PrimaryButton } from "@/components/ui";
import { Pipeline, PipelineState } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useDeletePipeline, useUpdatePipeline } from "@/services/pipeline";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { DeleteResourceModal } from "@/components/modals";
import { useRouter } from "next/router";

export type ConfigurePipelineFormProps = {
  pipeline: Nullable<Pipeline>;
  marginBottom: Nullable<string>;
};

type ConfigurePipelineFormValue = {
  description: Nullable<string>;
  state: Nullable<PipelineState>;
};

const ConfigurePipelineForm: FC<ConfigurePipelineFormProps> = ({
  pipeline,
  marginBottom,
}) => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const [canEdit, setCanEdit] = useState(false);
  const [updatePipelineError, setUpdatePipelineError] =
    useState<Nullable<string>>(null);
  const [isUpdateingPipeline, setIsUpdatingPipeline] = useState(false);

  const validateForm = useCallback((values: ConfigurePipelineFormValue) => {
    const errors: Partial<ConfigurePipelineFormValue> = {};

    if (!values.description) {
      errors.description = "Required";
    }

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

  const updatePipeline = useUpdatePipeline();

  // ###################################################################
  // #                                                                 #
  // # Handle delete source                                            #
  // #                                                                 #
  // ###################################################################

  const [deletePipelineModalIsOpen, setDeletePipelineModalIsOpen] =
    useState(false);
  const [isDeletingPipeline, setIsDeletingPipeline] = useState(false);
  const [deletePipelineError, setDeletePipelineError] =
    useState<Nullable<string>>(null);

  const deletePipeline = useDeletePipeline();

  const handleDeletePipeline = useCallback(() => {
    if (!pipeline) return;

    setIsDeletingPipeline(true);
    deletePipeline.mutate(pipeline.name, {
      onSuccess: () => {
        setIsDeletingPipeline(false);
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
          setDeletePipelineError(error.message);
          setIsDeletingPipeline(false);
        } else {
          setDeletePipelineError(
            "Something went wrong when deleting destination"
          );
          setIsDeletingPipeline(false);
        }
      },
    });
    setDeletePipelineModalIsOpen(false);
  }, [pipeline, amplitudeIsInit, router, deletePipeline]);

  const determinePipelineState = useCallback(
    (values: ConfigurePipelineFormValue) => {
      switch (values.state) {
        case "STATE_ACTIVE":
          return true;
        default:
          return false;
      }
    },
    []
  );

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
        onSubmit={(values) => {
          if (!pipeline || !values.description) return;

          if (
            pipeline.description === values.description &&
            pipeline.state === values.state
          ) {
            setCanEdit(false);
            return;
          }

          setIsUpdatingPipeline(true);

          updatePipeline.mutate(
            {
              name: pipeline.name,
              description: values.description,
            },
            {
              onSuccess: () => {
                setCanEdit(false);
                setIsUpdatingPipeline(false);
              },
              onError: (error) => {
                if (error instanceof Error) {
                  setUpdatePipelineError(error.message);
                  setIsUpdatingPipeline(false);
                  if (amplitudeIsInit) {
                    sendAmplitudeData("update_pipeline", {
                      type: "critical_action",
                      process: "pipeline",
                    });
                  }
                } else {
                  setUpdatePipelineError(
                    "Something went wrong when deploying model"
                  );
                  setIsUpdatingPipeline(false);
                }
              },
            }
          );
        }}
        validate={validateForm}
      >
        {({ values, errors, submitForm }) => {
          return (
            <FormBase marginBottom={marginBottom} gapY={null} padding={null}>
              <div className="mb-[60px] flex flex-col gap-y-5">
                <ToggleField
                  id="pipelineState"
                  name="state"
                  label="State"
                  value={determinePipelineState(values)}
                  additionalMessageOnLabel={null}
                  defaultChecked={true}
                  error={errors?.state || null}
                  additionalOnChangeCb={null}
                  disabled={true}
                  readOnly={false}
                  required={true}
                  description={null}
                />
                <TextArea
                  id="pipelineDescription"
                  name="description"
                  label="Description"
                  additionalMessageOnLabel={null}
                  description="Fill with a short description of your model"
                  value={values.description}
                  error={errors.description || null}
                  additionalOnChangeCb={null}
                  disabled={canEdit ? false : true}
                  readOnly={false}
                  required={true}
                  autoComplete="off"
                  placeholder=""
                  enableCounter={false}
                  counterWordLimit={0}
                />
              </div>
              <div className="mb-10 flex flex-row">
                <PrimaryButton
                  disabled={deletePipelineModalIsOpen ? true : false}
                  position="mr-auto my-auto"
                  type="button"
                  onClickHandler={() => setDeletePipelineModalIsOpen(true)}
                >
                  Delete
                </PrimaryButton>
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
                {updatePipelineError ? (
                  <BasicProgressMessageBox width="w-[25vw]" status="error">
                    {updatePipelineError}
                  </BasicProgressMessageBox>
                ) : isUpdateingPipeline ? (
                  <BasicProgressMessageBox
                    width="w-[25vw]"
                    status="progressing"
                  >
                    Updating pipeline...
                  </BasicProgressMessageBox>
                ) : null}
                {deletePipelineError ? (
                  <BasicProgressMessageBox width="w-[25vw]" status="error">
                    {deletePipelineError}
                  </BasicProgressMessageBox>
                ) : isDeletingPipeline ? (
                  <BasicProgressMessageBox
                    width="w-[25vw]"
                    status="progressing"
                  >
                    Deleting pipeline...
                  </BasicProgressMessageBox>
                ) : null}
              </div>
            </FormBase>
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
