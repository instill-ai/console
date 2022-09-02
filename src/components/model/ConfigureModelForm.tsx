import { FC, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
  OutlineButton,
  SolidButton,
  BasicTextArea,
} from "@instill-ai/design-system";

import { DeleteResourceModal, FormBase } from "@/components/ui";
import { Model } from "@/lib/instill";
import { useDeleteModel, useUpdateModel } from "@/services/model";
import { Nullable } from "@/types/general";
import { sendAmplitudeData } from "@/lib/amplitude";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import useDeleteResourceModalState from "@/hooks/useDeleteResourceModalState";
import useDeleteResourceGuard from "@/hooks/useDeleteResourceGuard";

export type ConfigureModelFormProps = {
  model: Nullable<Model>;
  marginBottom: Nullable<string>;
};

export type ConfigureModelFormValues = {
  description: Nullable<string>;
};

export type ConfigureModelFormErrors = {
  description: Nullable<string>;
};

const ConfigureModelForm: FC<ConfigureModelFormProps> = ({
  model,
  marginBottom,
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const router = useRouter();

  const [canEdit, setCanEdit] = useState(false);
  const [fieldValues, setFieldValues] = useState<ConfigureModelFormValues>({
    description: model ? model.description : null,
  });
  const [formIsDirty, setFormIsDirty] = useState(false);

  // ###################################################################
  // # 1 - Handle update model                                         #
  // ###################################################################

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const updateModel = useUpdateModel();

  const handleSubmit = useCallback(() => {
    if (!canEdit) {
      setCanEdit(true);
      return;
    }

    if (!model || !formIsDirty) {
      setCanEdit(false);
      return;
    }

    if (model.description === fieldValues.description) {
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
        description: fieldValues.description || undefined,
      },
      {
        onSuccess: () => {
          setCanEdit(false);
          setFormIsDirty(false);
          setMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
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
  }, [amplitudeIsInit, model, updateModel, fieldValues, canEdit, formIsDirty]);

  // ###################################################################
  // # 2 - Handle delete model                                         #
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
          message: "Succeed.",
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
            description: JSON.stringify(
              error.response?.data.details,
              null,
              "\t"
            ),
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
      <FormBase
        marginBottom={marginBottom}
        padding={null}
        flex1={false}
        noValidate={true}
      >
        <div className="mb-10 flex flex-col">
          <BasicTextArea
            id="description"
            name="description"
            label="Description"
            description="Fill with a short description."
            value={fieldValues.description}
            disabled={canEdit ? false : true}
            required={false}
            onChange={(event) => {
              setFormIsDirty(true);
              setFieldValues({
                description: event.target.value,
              });
            }}
          />
        </div>
        <div className="flex flex-row mb-8">
          <OutlineButton
            disabled={disableResourceDeletion}
            onClickHandler={() => modalState.setModalIsOpen(true)}
            position="mr-auto my-auto"
            type="button"
            color="danger"
          >
            Delete
          </OutlineButton>
          <SolidButton
            disabled={false}
            onClickHandler={handleSubmit}
            position="ml-auto my-auto"
            type="button"
            color="primary"
          >
            {canEdit ? "Save" : "Edit"}
          </SolidButton>
        </div>
        <div className="flex flex-row">
          <BasicProgressMessageBox
            state={messageBoxState}
            setState={setMessageBoxState}
            width="w-[25vw]"
            closable={true}
          />
        </div>
      </FormBase>
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
