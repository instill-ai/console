import { FC, useCallback, useState } from "react";
import { Formik } from "formik";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
} from "@instill-ai/design-system";

import { FormikFormBase, TextArea } from "@/components/formik";
import { PrimaryButton } from "@/components/ui";
import { Model } from "@/lib/instill";
import { useDeleteModel, useUpdateModel } from "@/services/model";
import { Nullable } from "@/types/general";
import { sendAmplitudeData } from "@/lib/amplitude";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import useDeleteResourceModalState from "@/hooks/useDeleteResourceModalState";
import { useRouter } from "next/router";
import OutlineButton from "@/components/ui/Buttons/OutlineButton";
import { DeleteResourceModal } from "@/components/modals";
import { AxiosError } from "axios";
import { ErrorDetails, Violation } from "@/lib/instill/types";
import useDeleteResourceGuard from "@/hooks/useDeleteResourceGuard";

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
  const router = useRouter();

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
  // # 1 - handle update model                                         #
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

  // ###################################################################
  // #                                                                 #
  // # 2 - Handle delete model                                         #
  // #                                                                 #
  // ###################################################################

  const { disableResourceDeletion } = useDeleteResourceGuard();

  const modalState = useDeleteResourceModalState();

  const deleteModel = useDeleteModel();

  const handleDeleteModel = useCallback(() => {
    if (!model) return;

    setMessageBoxState({
      activate: true,
      message: "Deleting...",
      description: null,
      status: "progressing",
    });

    deleteModel.mutate(model.name, {
      onSuccess: () => {
        setMessageBoxState({
          activate: true,
          message: "Deleting succeeded.",
          description: null,
          status: "success",
        });
        if (amplitudeIsInit) {
          sendAmplitudeData("delete_model", {
            type: "critical_action",
            process: "model",
          });
        }
        router.push("/models");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          setMessageBoxState({
            activate: true,
            message: `${error.response?.status} - ${error.response?.data.message}`,
            description: (
              (error.response?.data.details as ErrorDetails[])[0]
                .violations as Violation[]
            )[0].description,
            status: "error",
          });
        } else {
          setMessageBoxState({
            activate: true,
            message: "Something went wrong when delete the model",
            description: null,
            status: "error",
          });
        }
        modalState.setModalIsOpen(false);
      },
    });
  }, [model, amplitudeIsInit, router, deleteModel, modalState]);

  return (
    <>
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
              <div className="mb-10 flex flex-col">
                <TextArea
                  id="description"
                  name="description"
                  label="Description"
                  description="Fill with a short description."
                  value={values.description}
                  error={errors.description || null}
                  disabled={canEdit ? false : true}
                  required={false}
                />
              </div>
              <div className="flex flex-row">
                <OutlineButton
                  disabled={disableResourceDeletion}
                  onClickHandler={() => modalState.setModalIsOpen(true)}
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
              <div className="flex flex-row">
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
        resource={model}
        modalIsOpen={modalState.modalIsOpen}
        setModalIsOpen={modalState.setModalIsOpen}
        handleDeleteResource={handleDeleteModel}
      />
    </>
  );
};

export default ConfigureModelForm;
