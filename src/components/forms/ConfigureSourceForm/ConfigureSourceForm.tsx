import { FormBase, SingleSelect } from "@/components/formik";
import { ConnectorIcon } from "@/components/ui";
import { PrimaryButton } from "@/components/ui/Buttons";
import { SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Formik } from "formik";
import { FC, useState, useEffect, useCallback } from "react";

export type ConfigureSourceFormProps = {
  source: Nullable<SourceWithPipelines>;
};

type ConfigureSourceFormValue = {
  definition: Nullable<string>;
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
    []
  );

  return (
    <Formik
      initialValues={
        { definition: source ? source.id : null } as ConfigureSourceFormValue
      }
      onSubmit={(values) => {
        if (!canEdit) {
          setCanEdit(true);
          return;
        }
      }}
    >
      {(formik) => {
        return (
          <FormBase gapY="gap-y-5" padding={null}>
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
              onChangeCb={sourceDefinitionOnChangeCb}
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
              <div className="ml-auto flex">
                <PrimaryButton type="submit" disabled={true}>
                  {canEdit ? "Done" : "Edit"}
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
