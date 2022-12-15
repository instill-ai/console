import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  ProgressMessageBoxState,
  SingleSelectOption,
  SolidButton,
} from "@instill-ai/design-system";

import { ConnectorIcon, FormBase } from "@/components/ui";
import { useCreateSource, useSources } from "@/services/connector";
import { CreateSourcePayload } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

export type CreateSourceFormValues = {
  definition: Nullable<string>;
};

export type CreateSourceFormErrors = {
  definition: Nullable<string>;
};

export type CreateSourceFormProps = {
  marginBottom: Nullable<string>;
};

const CreateSourceForm = ({ marginBottom }: CreateSourceFormProps) => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // # 1 - Initialize the source definition                            #
  // ###################################################################
  //
  // A user can only have a http source and a grpc source

  const [sourceDefinitionOptions, setSourceDefinitionOptions] = useState<
    SingleSelectOption[]
  >([]);
  const [selectedSourceDefinitionOption, setSelectedSourceDefinitionOption] =
    useState<Nullable<SingleSelectOption>>(null);

  const sources = useSources();
  const createSource = useCreateSource();

  useEffect(() => {
    if (!sources.isSuccess) return;

    setSourceDefinitionOptions([
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
    ]);
  }, [sources.isSuccess]);

  // ###################################################################
  // # 2 - handle create source                                        #
  // ###################################################################

  const [fieldValues, setFieldValues] = useState<CreateSourceFormValues>({
    definition: null,
  });

  const [fieldErrors, setFieldErrors] = useState<CreateSourceFormErrors>({
    definition: null,
  });

  const handleDefinitionChange = useCallback(
    (option: Nullable<SingleSelectOption>) => {
      setFieldErrors({
        definition: null,
      });
      setSelectedSourceDefinitionOption(option);
      setFieldValues({
        definition: (option?.value as string) || null,
      });
    },
    []
  );

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const handleSubmit = useCallback(() => {
    if (!fieldValues.definition) return;

    if (!fieldValues.definition) {
      setFieldErrors({
        definition: "Required",
      });
      return;
    }

    if (sources.data?.find((e) => e.id === fieldValues.definition)) {
      setFieldErrors({
        definition:
          "You could only create one http and one grpc source. Check the setup guide for more information.",
      });
      return;
    }

    const payload: CreateSourcePayload = {
      id: fieldValues.definition,
      source_connector_definition: `source-connector-definitions/${fieldValues.definition}`,
      connector: {
        configuration: {},
      },
    };

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Creating...",
    }));

    createSource.mutate(payload, {
      onSuccess: () => {
        setMessageBoxState(() => ({
          activate: true,
          status: "success",
          description: null,
          message: "Succeed.",
        }));
        if (amplitudeIsInit) {
          sendAmplitudeData("create_source", {
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
            message: "Something went wrong when create the source",
          }));
        }
      },
    });
  }, [amplitudeIsInit, createSource, router, fieldValues, sources.data]);

  return (
    <FormBase
      padding={null}
      marginBottom={marginBottom}
      noValidate={true}
      flex1={false}
    >
      <div className="flex flex-col">
        <BasicSingleSelect
          id="sourceDefinition"
          label="Source type"
          instanceId="sourceDefinition"
          options={sourceDefinitionOptions}
          value={selectedSourceDefinitionOption}
          error={fieldErrors.definition || null}
          onChange={handleDefinitionChange}
          required={true}
          description={`<a href=${
            fieldValues.definition === null
              ? "https://www.instill.tech/docs/source-connectors/overview"
              : fieldValues.definition === "source-http"
              ? "https://www.instill.tech/docs/source-connectors/http"
              : "https://www.instill.tech/docs/source-connectors/grpc"
          }>Setup Guide</a>`}
        />
      </div>
      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={messageBoxState}
          setState={setMessageBoxState}
          width="w-[25vw]"
          closable={true}
        />
        <SolidButton
          disabled={false}
          position="ml-auto my-auto"
          type="button"
          color="primary"
          onClickHandler={handleSubmit}
        >
          Set up
        </SolidButton>
      </div>
    </FormBase>
  );
};

export default CreateSourceForm;
