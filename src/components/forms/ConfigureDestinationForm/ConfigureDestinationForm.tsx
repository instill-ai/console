import { FormBase, SingleSelect } from "@/components/formik";
import { ConnectorIcon } from "@/components/ui";
import { PrimaryButton } from "@/components/ui/Buttons";
import { DestinationWithDefinition, SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { SingleSelectOption } from "@instill-ai/design-system";
import { Formik } from "formik";
import { FC, useState, useEffect, useCallback } from "react";

export type ConfigureDestinationFormProps = {
  destination: Nullable<DestinationWithDefinition>;
};

type ConfigureDestinationFormValue = {
  definition: Nullable<string>;
};

const ConfigureDestinationForm: FC<ConfigureDestinationFormProps> = ({
  destination,
}) => {
  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the destination definition                       #
  // #                                                                 #
  // ###################################################################

  const [
    syncDestinationDefinitionOptions,
    setSyncDestinationDefinitionOptions,
  ] = useState<SingleSelectOption[]>([]);
  const [
    selectedDestinationDefinitionOption,
    setSelectedDestinationDefinitionOption,
  ] = useState<Nullable<SingleSelectOption>>(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!destination) return;

    const options = [
      {
        label: "gRPC",
        value: "destination-grpc",
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
        value: "destination-http",
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

    setSyncDestinationDefinitionOptions(options);
    setSelectedDestinationDefinitionOption(
      options.find((e) => e.value === destination.id) || null
    );
  }, [destination]);

  const destinationDefinitionOnChangeCb = useCallback(
    (option: SingleSelectOption) => {
      setSelectedDestinationDefinitionOption(
        syncDestinationDefinitionOptions.find(
          (e) => e.value === option.value
        ) || null
      );
    },
    []
  );

  return (
    <Formik
      initialValues={
        {
          definition: destination ? destination.id : null,
        } as ConfigureDestinationFormValue
      }
      onSubmit={(values) => {
        if (!canEdit) {
          setCanEdit(true);
          return;
        }
        console.log(values);
      }}
    >
      {() => {
        return (
          <FormBase gapY="gap-y-5" padding={null}>
            <SingleSelect
              name="definition"
              label="Data destination"
              instanceId="destination-definition"
              disabled={true}
              readOnly={false}
              options={syncDestinationDefinitionOptions}
              required={true}
              description={"Setup Guide"}
              menuPlacement="auto"
              value={selectedDestinationDefinitionOption}
              error={null}
              onChangeCb={destinationDefinitionOnChangeCb}
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
                <PrimaryButton type="submit" disabled={false}>
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

export default ConfigureDestinationForm;
