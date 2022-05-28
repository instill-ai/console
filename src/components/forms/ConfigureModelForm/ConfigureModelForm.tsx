import { FormBase, TextArea, ToggleField } from "@/components/formik";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Model } from "@/lib/instill";
import { useUpdateModel } from "@/services/model/ModelServices";
import { Nullable } from "@/types/general";
import { useState } from "@storybook/addons";
import { Formik } from "formik";
import { FC } from "react";
import cn from "clsx";

export type ConfigureModelFormProps = {
  model: Nullable<Model>;
  marginBottom: Nullable<string>;
};

type ConfigureModelFormValue = {
  description: Nullable<string>;
};

const ConfigureModelForm: FC<ConfigureModelFormProps> = ({
  model,
  marginBottom,
}) => {
  const [canEdit, setCanEdit] = useState(false);
  const updateModel = useUpdateModel();

  return (
    <Formik
      initialValues={
        {
          description: model ? model.description : null,
        } as ConfigureModelFormValue
      }
      onSubmit={(values) => {
        if (!canEdit) {
          setCanEdit(true);
          return;
        }

        if (!values.description || !model) return;

        updateModel.mutate(
          {
            name: model.name,
            description: values.description,
          },
          {
            onSuccess: () => {
              setCanEdit(false);
            },
          }
        );
      }}
    >
      {({ values }) => {
        return (
          <FormBase marginBottom={marginBottom} gapY="gap-y-5" padding={null}>
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
