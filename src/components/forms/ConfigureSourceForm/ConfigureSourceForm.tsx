import { FormBase, SingleSelect } from "@/components/formik";
import { ConnectorIcon } from "@/components/ui";
import { PrimaryButton } from "@/components/ui/Buttons";
import { SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Formik } from "formik";
import { FC, useState, useEffect } from "react";

export type ConfigureSourceFormProps = {
  source: Nullable<SourceWithPipelines>;
};

const ConfigureSourceForm: FC<ConfigureSourceFormProps> = ({ source }) => {
  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the source definition                            #
  // #                                                                 #
  // ###################################################################

  const [syncSourceDefinitionOptions, setSyncSourceDefinitionOptions] =
    useState<SingleSelectOption[]>([]);
  const [selectedSourceDefinitionOption, setSelectedSourceDefinitionOption] =
    useState<Nullable<SingleSelectOption>>(null);

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

  return (
    <Formik
      initialValues={{ definition: source ? source.id : null }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {() => {
        return (
          <FormBase gapY="gap-y-5" padding={null}>
            <SingleSelect
              name="definition"
              label="Source type"
              instanceId="source-destinition"
              disabled={true}
              readOnly={false}
              options={syncSourceDefinitionOptions}
              required={true}
              description={"Setup Guide"}
              menuPlacement="auto"
              value={selectedSourceDefinitionOption}
              error={null}
            />
            <div className="mt-10 flex flex-row">
              <div className="mr-auto flex flex-row gap-x-2.5">
                <PrimaryButton type="button" disabled={true}>
                  Test connection
                </PrimaryButton>
                <PrimaryButton type="button" disabled={true}>
                  Delete
                </PrimaryButton>
              </div>
              <div className="ml-autoƒ flex">
                <PrimaryButton type="button" disabled={true}>
                  Edit
                </PrimaryButton>
              </div>
            </div>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default ConfigureSourceForm;
