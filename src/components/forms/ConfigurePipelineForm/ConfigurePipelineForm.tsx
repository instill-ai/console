import { Formik } from "formik";
import { FC, useCallback, useState } from "react";

import { FormBase, TextArea, ToggleField } from "@/components/formik";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Model, Pipeline, PipelineState } from "@/lib/instill";
import { useUpdateModel } from "@/services/model/ModelServices";
import { Nullable } from "@/types/general";
import { BasicProgressMessageBox } from "@instill-ai/design-system";
import { useUpdatePipeline } from "@/services/pipeline/PipelineServices";

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
    submitForm: () => Promise<any>
  ) => {
    if (!canEdit) {
      setCanEdit(true);
      return;
    }

    submitForm();
  };

  const updatePipeline = useUpdatePipeline();

  return (
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
                name="state"
                label="State"
                defaultChecked={true}
                error={errors?.state || null}
                additionalOnChangeCb={null}
                disabled={true}
                readOnly={false}
                required={true}
                description={null}
              />
              <TextArea
                name="description"
                label="Description"
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
                disabled={true}
                position="mr-auto my-auto"
                type="button"
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
                <BasicProgressMessageBox width="w-[216px]" status="error">
                  {updatePipelineError}
                </BasicProgressMessageBox>
              ) : isUpdateingPipeline ? (
                <BasicProgressMessageBox width="w-[216px]" status="progressing">
                  Updating pipeline...
                </BasicProgressMessageBox>
              ) : null}
            </div>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default ConfigurePipelineForm;
