import { useState, useEffect, useCallback } from "react";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
  SingleSelectOption,
  OutlineButton,
  SolidButton,
  BasicSingleSelect,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";
import { AxiosError } from "axios";

import { ConnectorIcon, DeleteResourceModal, FormBase } from "@/components/ui";
import { SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useDeleteSource } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { ErrorDetails, Violation } from "@/lib/instill/types";
import useDeleteResourceGuard from "@/hooks/useDeleteResourceGuard";

export type ConfigureSourceFormProps = {
  source: Nullable<SourceWithPipelines>;
  marginBottom: Nullable<string>;
};

export type ConfigureSourceFormValue = {
  sourceDefinition: Nullable<string>;
};

const ConfigureSourceForm = ({
  source,
  marginBottom,
}: ConfigureSourceFormProps) => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // # Initialize the source definition                                #
  // ###################################################################

  const [sourceDefinitionOptions, setSourceDefinitionOptions] =
    useState<Nullable<SingleSelectOption[]>>(null);
  const [selectedSourceDefinitionOption, setSelectedSourceDefinitionOption] =
    useState<Nullable<SingleSelectOption>>(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!source) return;

    const options = [
      {
        label: "gRPC",
        value: "source-grpc",
        startIcon: (
          <ConnectorIcon
            iconName="grpc.svg"
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      },
      {
        label: "HTTP",
        value: "source-http",
        startIcon: (
          <ConnectorIcon
            iconName="http.svg"
            iconColor="fill-instillGrey90"
            iconHeight="h-[30px]"
            iconWidth="w-[30px]"
            iconPosition="my-auto"
          />
        ),
      },
    ];

    setSourceDefinitionOptions(options);
    setSelectedSourceDefinitionOption(
      options.find((e) => e.value === source.id) || null
    );
  }, [source]);

  // ###################################################################
  // # Handle delete destination                                       #
  // ###################################################################

  const handleSubmit = useCallback(() => {
    if (canEdit) {
      setCanEdit(false);
    } else {
      setCanEdit(true);
    }
  }, [canEdit]);

  // ###################################################################
  // # Handle delete destination                                       #
  // ###################################################################

  const { disableResourceDeletion } = useDeleteResourceGuard();

  const [deleteSourceModalIsOpen, setDeleteSourceModalIsOpen] = useState(false);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const deleteSource = useDeleteSource();

  const handleDeleteSource = useCallback(() => {
    if (!source) return;

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Deleting...",
    }));

    deleteSource.mutate(source.name, {
      onSuccess: () => {
        setMessageBoxState(() => ({
          activate: true,
          status: "success",
          description: null,
          message: "Succeed.",
        }));

        if (amplitudeIsInit) {
          sendAmplitudeData("delete_source", {
            type: "critical_action",
            process: "source",
          });
        }
        router.push("/sources");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          setMessageBoxState(() => ({
            activate: true,
            message: `${error.response?.status} - ${error.response?.data.message}`,
            description: (
              (error.response?.data.details as ErrorDetails[])[0]
                .violations as Violation[]
            )[0].description,
            status: "error",
          }));
        } else {
          setMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: "Something went wrong when delete the source",
          }));
        }
      },
    });
    setDeleteSourceModalIsOpen(false);
  }, [source, amplitudeIsInit, router, deleteSource]);

  return (
    <>
      <FormBase
        padding={null}
        marginBottom={marginBottom}
        noValidate={true}
        flex1={false}
      >
        <div className="mb-10 flex flex-col">
          <BasicSingleSelect
            id="sourceDefinition"
            instanceId="sourceDefinition"
            label="Source"
            disabled={canEdit ? false : true}
            options={sourceDefinitionOptions || []}
            required={true}
            value={selectedSourceDefinitionOption}
          />
        </div>
        <div className="mb-10 flex flex-row">
          <OutlineButton
            disabled={disableResourceDeletion}
            onClickHandler={() => setDeleteSourceModalIsOpen(true)}
            position="mr-auto my-auto"
            type="button"
            color="danger"
          >
            Delete
          </OutlineButton>
          <SolidButton
            type="submit"
            disabled={true}
            position="ml-auto my-auto"
            color="primary"
            onClickHandler={handleSubmit}
          >
            {canEdit ? "Done" : "Edit"}
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
        resource={source}
        modalIsOpen={deleteSourceModalIsOpen}
        setModalIsOpen={setDeleteSourceModalIsOpen}
        handleDeleteResource={handleDeleteSource}
      />
    </>
  );
};

export default ConfigureSourceForm;
