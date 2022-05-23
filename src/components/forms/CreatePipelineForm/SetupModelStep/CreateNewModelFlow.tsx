import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormikContext } from "formik";
import {
  BasicProgressMessageBox,
  ModelInstanceIcon,
  SingleSelectOption,
} from "@instill-ai/design-system";

import {
  SingleSelect,
  TextArea,
  TextField,
  UploadFileField,
} from "../../../formik";
import { PrimaryButton } from "@/components/ui/Buttons";
import { StepNumberState, Values } from "../CreatePipelineForm";
import { mockModelInstances, mockModelSourceOptions } from "../../MockData";
import {
  useCreateModel,
  useDeployModel,
  useModelDefinition,
  useModelDefinitions,
  useModelInstance,
  useModelInstances,
} from "@/services/model/ModelServices";
import useOnScreen from "@/hooks/useOnScreen";
import { ModelDefinitionIcon } from "@/components/ui";
import { CreateModelPayload, Model, ModelDefinition } from "@/lib/instill";

// We need to pass modelCreated state to UseExistingModelFlow

export type CreateNewModelFlowProps = StepNumberState & {
  setModelCreated: Dispatch<SetStateAction<boolean>>;
  modelCreated: boolean;
};

const CreateNewModelFlow: FC<CreateNewModelFlowProps> = ({
  maximumStepNumber,
  setStepNumber,
  stepNumber,
  setModelCreated,
  modelCreated,
}) => {
  const { values, setFieldValue } = useFormikContext<Values>();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the model definition                             #
  // #                                                                 #
  // ###################################################################

  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);
  const modelDefinitions = useModelDefinitions();

  const [modelDefinitionOptions, setModelDefinitionOptions] = useState<
    SingleSelectOption[] | undefined
  >();
  const [targetModelDefinitionName, setTargetModelDefinitionName] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (!flowIsOnScreen || !modelDefinitions.isSuccess) return;

    console.log(modelDefinitions.data);

    setModelDefinitionOptions(
      modelDefinitions.data.map((e) => {
        return {
          label: e.title,
          value: e.id,
          startIcon: (
            <ModelDefinitionIcon
              iconName={e.icon}
              iconWidth="w-[30px]"
              iconHeight="h-[30px]"
              iconColor="fill-instillGrey90"
              iconPosition="my-auto"
            />
          ),
        };
      })
    );
  }, [flowIsOnScreen, modelDefinitions.isSuccess]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Set up github model                                         #
  // #                                                                 #
  // ###################################################################

  const createModel = useCreateModel();
  const targetModelDefinition = useModelDefinition(targetModelDefinitionName);
  const [newModel, setNewModel] = useState<Model | undefined>();
  const [isSettingModel, setIsSettingModel] = useState(false);
  const [setupModelError, setSetupModelError] = useState<string | undefined>(
    undefined
  );

  const canSetupModel = useMemo(() => {
    console.log(values);
    if (!values.model.new.modelDefinition || modelCreated) return false;

    if (values.model.new.modelDefinition === "github") {
      if (!values.model.new.repo || !values.model.new.id) {
        return false;
      }
      return true;
    }

    if (
      !values.model.new.file ||
      !values.model.new.id ||
      !values.model.new.description
    ) {
      return false;
    }
    return true;
  }, [
    values.model.new.modelInstance,
    values.model.new.modelDefinition,
    values.model.new.id,
    values.model.new.file,
    values.model.new.description,
    values.model.new.repo,
    modelCreated,
  ]);

  const handelSetupGithubModel = async () => {
    if (!targetModelDefinition.isSuccess) return;

    console.log(targetModelDefinition.isFetched);

    const configuration =
      values.model.new.modelDefinition === "github"
        ? {
            repository: values.model.new.repo,
          }
        : {
            description: values.model.new.description,
          };

    const payload: CreateModelPayload = {
      id: values.model.new.id,
      model_definition: targetModelDefinition.data.name,
      configuration: JSON.stringify(configuration),
    };

    setIsSettingModel(true);

    createModel.mutate(payload, {
      onSuccess: (newModel) => {
        setModelCreated(true);
        setNewModel(newModel);
        setIsSettingModel(false);
      },
      onError: (error) => {
        if (error instanceof Error) {
          setSetupModelError(error.message);
        } else {
          setSetupModelError("Something went wrong when setting up model");
        }
      },
    });
  };

  // ###################################################################
  // #                                                                 #
  // # 2 - Set up local model                                          #
  // #                                                                 #
  // ###################################################################

  const canDisplayLocalModelFlow = useMemo(() => {
    if (values.model.new.modelDefinition !== "local") {
      return false;
    }
    return true;
  }, [values.model.new.modelDefinition]);

  // ###################################################################
  // #                                                                 #
  // # 3 - Deploy model instance                                       #
  // #                                                                 #
  // ###################################################################

  const modelInstances = useModelInstances(newModel?.id);
  const deployModel = useDeployModel();
  const [isDeployingModel, setIsDeployingModel] = useState(false);
  const [deployModelError, setDeployModelError] = useState<
    string | undefined
  >();

  const canDisplayDeployModelSection = useMemo(() => {
    if (!modelCreated || !newModel || !modelInstances.isSuccess) {
      return false;
    }
    return true;
  }, [modelCreated, newModel, modelInstances.isSuccess]);

  const canDeployModel = useMemo(() => {
    if (!values.model.new.modelInstance) return false;
    return true;
  }, [values.model.new.modelInstance]);

  const modelInstanceOptions = useMemo(() => {
    if (!modelInstances.isSuccess) return;

    const options: SingleSelectOption[] = modelInstances.data.map((e) => {
      return {
        label: e.id,
        value: e.name,
        startIcon: (
          <ModelInstanceIcon
            width="w-[30px]"
            height="h-[30px]"
            position="my-auto"
            color="fill-instillGrey95"
          />
        ),
      };
    });
    return options;
  }, [modelInstances.isSuccess, values.model.new.modelDefinition]);

  const handleDeployModel = async () => {
    setIsDeployingModel(true);
    deployModel.mutate(values.model.new.modelInstance, {
      onSuccess: () => {
        setIsDeployingModel(false);
        setStepNumber(stepNumber + 1);
      },
      onError: (error) => {
        if (error instanceof Error) {
          setDeployModelError(error.message);
        } else {
          setDeployModelError("Something went wrong when deploying model");
        }
      },
    });
  };

  const modelDefinitionOnChangeCb = (option: SingleSelectOption) => {
    setTargetModelDefinitionName(
      modelDefinitions.data?.find((e) => e.id === option.value)?.name
    );
    if (option.value !== "github") {
      setFieldValue("model.new.modelInstance", null);
    }
  };

  return (
    <div ref={flowRef} className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">Set up a new model</h3>
      <TextField
        name="model.new.id"
        label="Name"
        description="Pick a name to help you identify this source in Instill"
        disabled={modelCreated ? true : false}
        readOnly={false}
        required={true}
        placeholder=""
        type="text"
        autoComplete="off"
      />
      <SingleSelect
        instanceId="new-model-definition"
        name="model.new.modelDefinition"
        disabled={modelCreated ? true : false}
        readOnly={false}
        required={true}
        description={"Setup Guide"}
        label="Source type"
        options={modelDefinitionOptions ? modelDefinitionOptions : []}
        onChangeCb={modelDefinitionOnChangeCb}
        menuPlacement="auto"
        defaultValue={null}
      />
      {values.model.new.modelDefinition === "github" ? (
        <TextField
          name="model.new.repo"
          label="GitHub repository"
          description="The name of a public GitHub repository, e.g. `instill-ai/yolov4`."
          disabled={modelCreated ? true : false}
          readOnly={false}
          required={true}
          placeholder=""
          type="text"
          autoComplete="off"
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
      <div className="flex flex-row">
        {setupModelError ? (
          <BasicProgressMessageBox width="w-[216px]" status="error">
            {setupModelError}
          </BasicProgressMessageBox>
        ) : isSettingModel ? (
          <BasicProgressMessageBox width="w-[216px]" status="progressing">
            Setting model...
          </BasicProgressMessageBox>
        ) : null}
        <PrimaryButton
          disabled={canSetupModel ? false : true}
          onClickHandler={handelSetupGithubModel}
          position="ml-auto my-auto"
          type="button"
        >
          Setup new model
        </PrimaryButton>
      </div>

      {canDisplayDeployModelSection ? (
        <>
          <h3 className="instill-text-h3 mt-[60px] mb-5 text-black">
            Deploy a model instance
          </h3>
          <SingleSelect
            instanceId="new-model-instances"
            name="model.new.modelInstance"
            disabled={false}
            readOnly={false}
            required={true}
            description={"Setup Guide"}
            label="Source type"
            options={modelInstanceOptions ? modelInstanceOptions : []}
            menuPlacement="auto"
            defaultValue={null}
          />
          <div className="flex flex-row">
            {deployModelError ? (
              <BasicProgressMessageBox width="w-[216px]" status="error">
                {deployModelError}
              </BasicProgressMessageBox>
            ) : isDeployingModel ? (
              <BasicProgressMessageBox width="w-[216px]" status="progressing">
                Deploying model...
              </BasicProgressMessageBox>
            ) : null}
            <PrimaryButton
              disabled={canDeployModel ? false : true}
              onClickHandler={handleDeployModel}
              position="ml-auto my-auto"
              type="button"
            >
              Deploy
            </PrimaryButton>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CreateNewModelFlow;
