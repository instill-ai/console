import { FC, useMemo } from "react";
import { useFormikContext } from "formik";

import { TextArea, UploadFileField } from "@/components/formik";
import { PrimaryButton } from "@/components/ui/Buttons";
import { CreateModelFormValue } from "./CreateModelForm";

const LocalModelFlow: FC = () => {
  const { values } = useFormikContext<CreateModelFormValue>();

  const canSetupModel = useMemo(() => {
    if (!values.name || !values.type || !values.description || values.file) {
      return false;
    }
    return true;
  }, [values.name, values.type, values.description, values.file]);

  return (
    <>
      <TextArea
        name="description"
        label="Description"
        description="Fill with a short description of your new model"
        disabled={false}
        readOnly={false}
        required={true}
        autoComplete="off"
        placeholder=""
        value={values.description}
        enableCounter={false}
        counterWordLimit={0}
      />
      <UploadFileField
        name="file"
        label="Upload a file"
        description="Create and upload a zip file that contains all the model files from your computer"
        placeholder=""
        uploadButtonText="Upload"
        required={true}
        readOnly={false}
        disabled={false}
      />
      <PrimaryButton
        disabled={canSetupModel ? false : true}
        position="ml-auto"
        type="submit"
      >
        Set up model
      </PrimaryButton>
    </>
  );
};

export default LocalModelFlow;
