import { FormBase, TextArea, ToggleField } from "@/components/formik";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Model } from "@/lib/instill";
import { useUpdateModel } from "@/services/model/ModelServices";
import { Nullable } from "@/types/general";
import { useState } from "@storybook/addons";
import { Formik } from "formik";
import { FC } from "react";

export type ConfigureModelFormProps = {
  model: Model;
};

type ConfigureModelFormValue = {
  state: Nullable<boolean>;
  description: Nullable<string>;
};

const ConfigureModelForm: FC<ConfigureModelFormProps> = ({ model }) => {
  const [canEdit, setCanEdit] = useState(false);
  const updateModel = useUpdateModel();

  return (
    <Formik
      initialValues={
        {
          state: null,
          description: model.description,
        } as ConfigureModelFormValue
      }
      onSubmit={(values) => {
        if (!canEdit) {
          setCanEdit(true);
          return;
        }

        if (!values.description || !values.state) return;

        updateModel.mutate(
          {
            name: model.name,
            description: values.description,
          },
          {
            onSuccess: () => {
              console.log(values);
            },
          }
        );
      }}
    >
      {({ values }) => {
        return (
          <FormBase gapY="gap-y-5" padding={null}>
            <ToggleField
              name="state"
              label="State"
              disabled={canEdit ? false : true}
              readOnly={false}
              required={true}
              defaultChecked={true}
              description={""}
              error={null}
            />
            <TextArea
              name="description"
              label="Description"
              description="Fill with a short description of your model"
              disabled={false}
              readOnly={false}
              required={true}
              autoComplete="off"
              placeholder=""
              value={values.description ? values.description : ""}
              enableCounter={false}
              counterWordLimit={0}
              error={null}
            />
            <PrimaryButton type="button" disabled={true} position="ml-auto">
              {canEdit ? "Done" : "Edit"}
            </PrimaryButton>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default ConfigureModelForm;
