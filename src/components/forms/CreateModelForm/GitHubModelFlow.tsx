import { FC, useState, useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import {
  BasicProgressMessageBox,
  BasicProgressMessageBoxProps,
  SingleSelectOption,
} from "@instill-ai/design-system";

import { SingleSelect, TextField } from "@/components/formik";
import { PrimaryButton } from "@/components/ui/Buttons";
import { mockModelInstances } from "../MockData";
import { CreateModelFormValue } from "./CreateModelForm";

type progressMessageBoxState = {
  progressState: BasicProgressMessageBoxProps["status"];
  message: string;
};

const GitHubModelFlow: FC = () => {
  const [modelInstances, setModelInstances] = useState<
    SingleSelectOption[] | null
  >(null);
  const [fetched, setFetched] = useState(false);
  const [progressMessageBoxState, setProgressMessageBoxState] =
    useState<progressMessageBoxState | null>(null);

  const { values, setFieldValue, errors } =
    useFormikContext<CreateModelFormValue>();

  const displayFetchModelButton = useMemo(() => {
    if (fetched) return false;
    return true;
  }, [fetched]);

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
    setModelInstances(null);
    setProgressMessageBoxState(null);
  };

  const handleFetchingModel = () => {
    setFetched(true);
    setProgressMessageBoxState({
      progressState: "progressing",
      message: "Fetching model",
    });
    setTimeout(() => {
      setProgressMessageBoxState({
        progressState: "success",
        message: "Successfully fetched model",
      });
      setModelInstances(mockModelInstances);
      setTimeout(() => setProgressMessageBoxState(null), 3000);
    }, 3000);
  };

  const handleSettingUpModel = () => {
    console.log("Setting model");
  };

  // Testing model
  useEffect(() => {
    if (
      !values.name ||
      !values.type ||
      !values.githubRepo ||
      !values.instance
    ) {
      return;
    }
    setProgressMessageBoxState({
      progressState: "progressing",
      message: "Testing connection",
    });
    setTimeout(() => {
      setProgressMessageBoxState({
        progressState: "success",
        message: "All connection tests succeeded.",
      });
    }, 3000);
  }, [values.name, values.type, values.githubRepo, values.instance]);

  return (
    <>
      <TextField
        name="githubRepo"
        label="GitHub repository"
        value={values.githubRepo}
        description="The URL of a GitHub repositories/organizations, e.g. 'instill-ai/yolov4'."
        disabled={false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
        onChangeCb={githubRepoOnChangeCb}
        error={errors.githubRepo || null}
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
          menuPlacement="auto"
          error={errors.instance || null}
        />
      ) : null}
      <div className="flex flex-row">
        {progressMessageBoxState ? (
          <BasicProgressMessageBox
            width="w-[335px]"
            status={progressMessageBoxState.progressState}
          >
            {progressMessageBoxState.message}
          </BasicProgressMessageBox>
        ) : null}

        {displayFetchModelButton ? (
          <PrimaryButton
            disabled={canFetchModel ? false : true}
            onClickHandler={handleFetchingModel}
            position="ml-auto my-auto"
            type="button"
          >
            Fetch model
          </PrimaryButton>
        ) : (
          <PrimaryButton
            disabled={canSetupModel ? false : true}
            position="ml-auto my-auto"
            type="button"
            onClickHandler={handleSettingUpModel}
          >
            Set up model
          </PrimaryButton>
        )}
      </div>
    </>
  );
};

export default GitHubModelFlow;
