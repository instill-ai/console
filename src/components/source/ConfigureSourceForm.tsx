import { useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";
import { AxiosError } from "axios";

import { FormikFormBase, SingleSelect } from "@/components/formik";
import { ConnectorIcon, PrimaryButton , DeleteResourceModal } from "@/components/ui";
import { SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useDeleteSource } from "@/services/connector";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { ErrorDetails, Violation } from "@/lib/instill/types";
import OutlineButton from "@/components/ui/Buttons/OutlineButton";
import useDeleteResourceGuard from "@/hooks/useDeleteResourceGuard";

export type ConfigureSourceFormProps = {
  source: Nullable<SourceWithPipelines>;
};

export type ConfigureSourceFormValue = {
  sourceDefinition: Nullable<string>;
};

const ConfigureSourceForm = ({ source }: ConfigureSourceFormProps) => {
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
            <FormikFormBase
              marginBottom={null}
              gapY={null}
              padding={null}
              minWidth={null}
            >
              <div className="mb-10 flex flex-col">
                <SingleSelect
                  id="sourceDefinition"
                  name="sourceDefinition"
                  label="Source"
                  disabled={canEdit ? false : true}
                  options={syncSourceDefinitionOptions}
                  required={true}
                  description={"Setup Guide"}
                  value={selectedSourceDefinitionOption}
                  additionalOnChangeCb={sourceDefinitionOnChangeCb}
                />
              </div>
              <div className="mb-10 flex flex-row">
                <OutlineButton
                  disabled={disableResourceDeletion}
                  onClickHandler={() => setDeleteSourceModalIsOpen(true)}
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
