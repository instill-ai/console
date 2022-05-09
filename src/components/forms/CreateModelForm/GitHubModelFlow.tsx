import { FC, useState, useMemo } from "react";
import { useFormikContext } from "formik";

import { SingleSelect, TextField } from "@/components/formik";
import { PrimaryButton } from "@/components/ui/Buttons";
import { SingleSelectOption } from "@instill-ai/design-system";
import { mockModelInstances } from "../MockData";
import { CreateModelFormValue } from "./CreateModelForm";

const GitHubModelFlow: FC = () => {
  const [modelInstances, setModelInstances] = useState<
    SingleSelectOption[] | null
  >(null);

  const [fetched, setFetched] = useState(false);

  const { values, setFieldValue } = useFormikContext<CreateModelFormValue>();

  const displayFetchModelButton = useMemo(() => {
    if (fetched) return false;
    return true;
  }, [values.type, values.githubRepo]);

  const canFetchModel = useMemo(() => {
    if (!values.githubRepo) return false;
    return true;
  }, [values.githubRepo]);

  const canSetupModel = useMemo(() => {
    if (
      !values.name ||
      !values.type ||
      !values.githubRepo ||
      !values.instance
    ) {
      return false;
    }

    return true;
  }, [values.name, values.type, values.githubRepo, values.instance]);

  const githubRepoOnChangeCb = () => {
    if (fetched) setFetched(false);
    setFieldValue("instance", null);
  };

  const handleFetchingModel = () => {
    setFetched(true);
    setTimeout(() => setModelInstances(mockModelInstances), 3000);
  };

  return (
    <>
      <TextField
        name="githubRepo"
        label="GitHub repository"
        description="The URL of a GitHub repositories/organizations, e.g. 'instill-ai/yolov4'."
        disabled={false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
        onChangeCb={githubRepoOnChangeCb}
      />
      {modelInstances ? (
        <SingleSelect
          name="instance"
          label="Instance"
          instanceId="model-instance"
          disabled={false}
          readOnly={false}
          options={modelInstances}
          required={true}
          description={"Setup Guide"}
        />
      ) : null}
      {displayFetchModelButton ? (
        <PrimaryButton
          disabled={canFetchModel ? false : true}
          onClickHandler={handleFetchingModel}
          position="ml-auto"
          type="button"
        >
          Fetch model
        </PrimaryButton>
      ) : (
        <PrimaryButton
          disabled={canSetupModel ? false : true}
          position="ml-auto"
          type="submit"
        >
          Setup new model
        </PrimaryButton>
      )}
    </>
  );
};

export default GitHubModelFlow;
