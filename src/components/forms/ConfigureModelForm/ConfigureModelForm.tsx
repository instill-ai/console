import { FC, useCallback, useState } from "react";
import { Formik } from "formik";
import { BasicProgressMessageBox } from "@instill-ai/design-system";

import { FormBase, TextArea } from "@/components/formik";
import { PrimaryButton } from "@/components/ui";
import { Model } from "@/lib/instill";
import { useUpdateModel } from "@/services/model";
import { Nullable } from "@/types/general";
import { sendAmplitudeData } from "@/lib/amplitude";
import { useAmplitudeCtx } from "context/AmplitudeContext";

export type ConfigureModelFormProps = {
  model: Nullable<Model>;
  marginBottom: Nullable<string>;
};

type ConfigureModelFormValue = {
  description: Nullable<string>;
};

const ConfigureModelForm: FC<ConfigureModelFormProps> = ({
  model,
  marginBottom,
}) => {
  const [canEdit, setCanEdit] = useState(false);
  const [updateModelError, setUpdateModelError] =
    useState<Nullable<string>>(null);
  const [isUpdateingModel, setIsUpdatingModel] = useState(false);
  const updateModel = useUpdateModel();

  const validateForm = useCallback((values: ConfigureModelFormValue) => {
    const errors: Partial<ConfigureModelFormValue> = {};

    if (!values.description) {
      errors.description = "Required";
    }

    return errors;
  }, []);

  const handleEditButton = (
    values: ConfigureModelFormValue,
    submitForm: () => Promise<void>
  ) => {
    if (!canEdit) {
      setCanEdit(true);
      return;
    }

    submitForm();
  };

  const { amplitudeIsInit } = useAmplitudeCtx();

  return (
    <Formik
      initialValues={
        {
          description: model ? model.description : null,
        } as ConfigureModelFormValue
      }
      enableReinitialize={true}
      onSubmit={(values) => {
        if (!model || !values.description) return;

        if (model.description === values.description) {
          setCanEdit(false);
          return;
        }

        setIsUpdatingModel(true);

        updateModel.mutate(
          {
            name: model.name,
            description: values.description,
          },
          {
            onSuccess: () => {
              setCanEdit(false);
              setIsUpdatingModel(false);
              if (amplitudeIsInit) {
                sendAmplitudeData("update_model", { type: "critical_action" });
              }
            },
            onError: (error) => {
              if (error instanceof Error) {
                setUpdateModelError(error.message);
              } else {
                setUpdateModelError(
                  "Something went wrong when deploying model"
                );
              }
            },
          }
        );
      }}
      validate={validateForm}
    >
      {({ values, errors, submitForm }) => {
        return (
          <FormBase marginBottom={marginBottom} gapY="gap-y-5" padding={null}>
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
            <div className="flex flex-row">
              {updateModelError ? (
                <BasicProgressMessageBox width="w-[216px]" status="error">
                  {updateModelError}
                </BasicProgressMessageBox>
              ) : isUpdateingModel ? (
                <BasicProgressMessageBox width="w-[216px]" status="progressing">
                  Updating model...
                </BasicProgressMessageBox>
              ) : null}
              <PrimaryButton
                disabled={false}
                onClickHandler={() => handleEditButton(values, submitForm)}
                position="ml-auto my-auto"
                type="button"
              >
                {canEdit ? "Done" : "Edit"}
              </PrimaryButton>
            </div>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default ConfigureModelForm;
