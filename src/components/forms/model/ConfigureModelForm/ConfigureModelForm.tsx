import { FC, useCallback, useState } from "react";
import { Formik } from "formik";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
} from "@instill-ai/design-system";

import { FormikFormBase, TextArea } from "@/components/formik";
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

export type ConfigureModelFormValue = {
  description: Nullable<string>;
};

const ConfigureModelForm: FC<ConfigureModelFormProps> = ({
  model,
  marginBottom,
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [canEdit, setCanEdit] = useState(false);

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

  // ###################################################################
  // #                                                                 #
  // # 2 - handle update model                                         #
  // #                                                                 #
  // ###################################################################

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const updateModel = useUpdateModel();

  const validateForm = useCallback((values: ConfigureModelFormValue) => {
    const errors: Partial<ConfigureModelFormValue> = {};

    if (!values.description) {
      errors.description = "Required";
    }

    return errors;
  }, []);

  const handleSubmit = useCallback(
    (values: ConfigureModelFormValue) => {
      if (!model || !values.description) return;

      if (model.description === values.description) {
        setCanEdit(false);
        return;
      }

      setMessageBoxState(() => ({
        activate: true,
        status: "progressing",
        description: null,
        message: "Updating...",
      }));

      updateModel.mutate(
        {
          name: model.name,
          description: values.description,
        },
        {
          onSuccess: () => {
            setCanEdit(false);
            setMessageBoxState(() => ({
              activate: true,
              status: "success",
              description: null,
              message: "Update succeeded",
            }));

            if (amplitudeIsInit) {
              sendAmplitudeData("update_model", {
                type: "critical_action",
                process: "model",
              });
            }
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
                message: "Something went wrong when update the model",
              }));
            }
          },
        }
      );
    },
    [amplitudeIsInit, model, updateModel]
  );

  return (
    <Formik
      initialValues={
        {
          description: model ? model.description : null,
        } as ConfigureModelFormValue
      }
      enableReinitialize={true}
      onSubmit={handleSubmit}
      validate={validateForm}
    >
      {({ values, errors, submitForm }) => {
        return (
          <FormikFormBase
            marginBottom={marginBottom}
            gapY="gap-y-5"
            padding={null}
          >
            <TextArea
              id="description"
              name="description"
              label="Description"
              description="Fill with a short description of your model"
              value={values.description}
              error={errors.description || null}
              disabled={canEdit ? false : true}
              required={true}
            />
            <div className="flex flex-row">
              <BasicProgressMessageBox
                state={messageBoxState}
                setState={setMessageBoxState}
                width="w-[25vw]"
                closable={true}
              />
              <PrimaryButton
                disabled={false}
                onClickHandler={() => handleEditButton(values, submitForm)}
                position="ml-auto my-auto"
                type="button"
              >
                {canEdit ? "Done" : "Edit"}
              </PrimaryButton>
            </div>
          </FormikFormBase>
        );
      }}
    </Formik>
  );
};

export default ConfigureModelForm;
