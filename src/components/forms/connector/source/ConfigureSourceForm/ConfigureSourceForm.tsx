import { FC, useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";

import { FormikFormBase, SingleSelect } from "@/components/formik";
import { ConnectorIcon, PrimaryButton } from "@/components/ui";
import { SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { DeleteResourceModal } from "@/components/modals";
import { useDeleteSource } from "@/services/connector";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type ConfigureSourceFormProps = {
  source: Nullable<SourceWithPipelines>;
};

export type ConfigureSourceFormValue = {
  sourceDefinition: Nullable<string>;
};

const ConfigureSourceForm: FC<ConfigureSourceFormProps> = ({ source }) => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # Initialize the source definition                                #
  // #                                                                 #
  // ###################################################################

  const [syncSourceDefinitionOptions, setSyncSourceDefinitionOptions] =
    useState<SingleSelectOption[]>([]);
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

    setSyncSourceDefinitionOptions(options);
    setSelectedSourceDefinitionOption(
      options.find((e) => e.value === source.id) || null
    );
  }, [source]);

  const sourceDefinitionOnChangeCb = useCallback(
    (option: SingleSelectOption) => {
      setSelectedSourceDefinitionOption(
        syncSourceDefinitionOptions.find((e) => e.value === option.value) ||
          null
      );
    },
    [syncSourceDefinitionOptions]
  );

  // ###################################################################
  // #                                                                 #
  // # Handle delete destination                                       #
  // #                                                                 #
  // ###################################################################

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
      message: "Deleting source...",
    }));

    deleteSource.mutate(source.name, {
      onSuccess: () => {
        setMessageBoxState(() => ({
          activate: true,
          status: "success",
          description: null,
          message: "Delete source succeed.",
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
            message: "Something went wrong when deleting source",
          }));
        }
      },
    });
    setDeleteSourceModalIsOpen(false);
  }, [source, amplitudeIsInit, router, deleteSource]);

  return (
    <>
      <Formik
        initialValues={
          {
            sourceDefinition: source ? source.id : null,
          } as ConfigureSourceFormValue
        }
        onSubmit={() => {
          if (!canEdit) {
            setCanEdit(true);
            return;
          }
        }}
      >
        {() => {
          return (
            <FormikFormBase marginBottom={null} gapY={null} padding={null}>
              <div className="mb-10 flex flex-col">
                <SingleSelect
                  id="sourceDefinition"
                  name="sourceDefinition"
                  label="Data source"
                  additionalMessageOnLabel={null}
                  disabled={canEdit ? false : true}
                  readOnly={false}
                  options={syncSourceDefinitionOptions}
                  required={true}
                  description={"Setup Guide"}
                  menuPlacement="auto"
                  value={selectedSourceDefinitionOption}
                  error={null}
                  additionalOnChangeCb={sourceDefinitionOnChangeCb}
                />
              </div>
              <div className="mb-10 flex flex-row">
                <PrimaryButton
                  type="button"
                  disabled={true}
                  position="mr-auto my-auto"
                  onClickHandler={() => {
                    setDeleteSourceModalIsOpen(true);
                  }}
                >
                  Delete
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={true}
                  position="ml-auto my-auto"
                  onClickHandler={null}
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
        resource={source}
        modalIsOpen={deleteSourceModalIsOpen}
        setModalIsOpen={setDeleteSourceModalIsOpen}
        handleDeleteResource={handleDeleteSource}
      />
    </>
  );
};

export default ConfigureSourceForm;
