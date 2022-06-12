import { FC, useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import {
  BasicProgressMessageBox,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";

import { FormBase, SingleSelect } from "@/components/formik";
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

type ConfigureSourceFormValue = {
  definition: Nullable<string>;
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
  const [isDeletingSource, setIsDeletingSource] = useState(false);
  const [deleteSourceError, setDeleteSourceError] =
    useState<Nullable<string>>(null);

  const deleteSource = useDeleteSource();

  const handleDeleteSource = useCallback(() => {
    if (!source) return;

    setIsDeletingSource(true);
    deleteSource.mutate(source.name, {
      onSuccess: () => {
        setIsDeletingSource(false);
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
          setDeleteSourceError(error.message);
          setIsDeletingSource(false);
        } else {
          setDeleteSourceError("Something went wrong when deleting source");
          setIsDeletingSource(false);
        }
      },
    });
    setDeleteSourceModalIsOpen(false);
  }, [source]);

  return (
    <>
      <Formik
        initialValues={
          { definition: source ? source.id : null } as ConfigureSourceFormValue
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
            <FormBase marginBottom={null} gapY={null} padding={null}>
              <div className="mb-10 flex flex-col">
                <SingleSelect
                  name="definition"
                  label="Data source"
                  instanceId="source-definition"
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
                {deleteSourceError ? (
                  <BasicProgressMessageBox width="w-[25vw]" status="error">
                    {deleteSourceError}
                  </BasicProgressMessageBox>
                ) : isDeletingSource ? (
                  <BasicProgressMessageBox
                    width="w-[25vw]"
                    status="progressing"
                  >
                    Deleting source...
                  </BasicProgressMessageBox>
                ) : null}
              </div>
            </FormBase>
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
