import { PrimaryButton } from "@/components/ui/Buttons";
import {
  GitHubIcon,
  LocalUploadIcon,
  ModelInstanceIcon,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { useFormikContext } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import {
  SingleSelect,
  TextArea,
  TextField,
  UploadFileField,
} from "../../FormikField";
import {
  StepNumberState,
  Values,
} from "../CreatePipelineDataSourceForm/CreatePipelineDataSourceForm";

export type CreateNewModelFlowProps = StepNumberState;

const CreateNewModelFlow: FC<CreateNewModelFlowProps> = ({
  maximumStepNumber,
  setStepNumber,
  stepNumber,
}) => {
  const modelSourceOptions = [
    {
      label: "GitHub",
      value: "github",
      startIcon: (
        <GitHubIcon
          width="w-[30px]"
          height="h-[30px]"
          color="fill-instillGrey90"
          position="my-auto"
        />
      ),
    },
    {
      label: "Local",
      value: "local",
      startIcon: (
        <LocalUploadIcon
          width="w-[30px]"
          height="h-[30px]"
          color="fill-instillGrey90"
          position="my-auto"
        />
      ),
    },
  ];
  const { values, setFieldValue } = useFormikContext<Values>();

  const [fetched, setFetched] = useState(false);
  const [displayFetchModelButton, setDisplayFetchModelButton] = useState(false);
  const [displaySetupModelButton, setDisplaySetupModelButton] = useState(false);
  const [modelInstances, setModelInstances] = useState<
    SingleSelectOption[] | null
  >(null);

  useEffect(() => {
    if (fetched) {
      setDisplayFetchModelButton(false);
      setDisplaySetupModelButton(true);
      return;
    }

    if (values.model.new.modelSource === "github") {
      setDisplayFetchModelButton(true);
      setDisplaySetupModelButton(false);
      return;
    }

    setDisplayFetchModelButton(false);
    setDisplaySetupModelButton(true);
  }, [values.model.new.modelSource, fetched]);

  /**
   *  Indicators about whether we can submit or not
   */

  const canFetchModel = useMemo(() => {
    if (!values.model.new.modelSource || !values.model.new.name) {
      return false;
    }

    return true;
  }, [values.model.new.modelSource, values.model.new.name]);

  const canSetupModel = useMemo(() => {
    console.log("can setup model", values.model);

    if (!values.model.new.modelSource) return false;

    if (values.model.new.modelSource === "github") {
      if (!values.model.new.modelInstance || !values.model.new.name) {
        return false;
      }
      return true;
    }

    if (
      !values.model.new.file ||
      !values.model.new.name ||
      !values.model.new.description
    ) {
      return false;
    }
    return true;
  }, [
    values.model.new.modelInstance,
    values.model.new.modelSource,
    values.model.new.name,
    values.model.new.file,
    values.model.new.description,
  ]);

  const canDisplayModelInstanceField = useMemo(() => {
    if (!modelInstances || values.model.new.modelSource !== "github") {
      return false;
    }
    return true;
  }, [values.model.new.modelSource, modelInstances]);

  const canDisplayLocalModelFlow = useMemo(() => {
    if (values.model.new.modelSource !== "local") {
      return false;
    }
    return true;
  }, [values.model.new.modelSource]);

  // We can't observe values.model.modelSource within a useEffect or canDisplayModelInstanceField
  // useMemo, it will cause render issue, when we are rendering Formik, setFieldValue will trigger
  // re-render again, which will cause infinite loop
  //
  // Once the modelInstance has been changed, we re-init all the modelInstances
  // TODO: store the modelInstances data at react-query

  const modelSourceOnChangeCb = (option: SingleSelectOption) => {
    setFetched(false);
    setModelInstances(null);
    if (option.value !== "github") {
      setFieldValue("model.new.modelInstance", null);
    }
  };

  const handleFetchingModel = async () => {
    console.log("fetch", values.model.new.name);
    setFetched(true);
    setTimeout(
      () =>
        setModelInstances([
          {
            label: "v1.0.0",
            value: "v1.0,0",
            startIcon: (
              <ModelInstanceIcon
                color="fill-instillGrey90"
                width="w-[30px]"
                height="h-[30px]"
                position="my-auto"
              />
            ),
          },
        ]),
      3000
    );
  };

  const handelSetupModel = async () => {
    if (stepNumber === maximumStepNumber) {
      // submit the form
      return;
    }

    setStepNumber(stepNumber + 1);
  };

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">Set up a new model</h3>
      <TextField
        name="model.new.name"
        label="Name"
        description="Pick a name to help you identify this source in Instill"
        disabled={false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
      />
      <SingleSelect
        instanceId="new-model-source"
        name="model.new.modelSource"
        disabled={false}
        readOnly={false}
        required={true}
        description={"Setup Guide"}
        label="Source type"
        options={modelSourceOptions}
        onChangeCb={modelSourceOnChangeCb}
      />
      {canDisplayModelInstanceField ? (
        <SingleSelect
          instanceId="new-model-instances"
          name="model.new.modelInstance"
          disabled={false}
          readOnly={false}
          required={true}
          description={"Setup Guide"}
          label="Source type"
          options={modelInstances ? modelInstances : []}
        />
      ) : null}
      {canDisplayLocalModelFlow ? (
        <>
          <TextArea
            name="model.new.description"
            label="Description"
            description="Fill with a short description of your new model"
            disabled={false}
            readOnly={false}
            required={true}
            autoComplete="off"
            placeholder=""
            value={values.model.new.description}
            enableCounter={false}
            counterWordLimit={0}
          />
          <UploadFileField
            name="model.new.file"
            label="Upload a file"
            description="Create and upload a zip file that contains all the model files from your computer"
            placeholder=""
            uploadButtonText="Upload"
            required={true}
            readOnly={false}
            disabled={false}
          />
        </>
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
      ) : null}
      {displaySetupModelButton ? (
        <PrimaryButton
          disabled={canSetupModel ? false : true}
          onClickHandler={handelSetupModel}
          position="ml-auto"
          type="button"
        >
          Setup new model
        </PrimaryButton>
      ) : null}
    </div>
  );
};

export default CreateNewModelFlow;
