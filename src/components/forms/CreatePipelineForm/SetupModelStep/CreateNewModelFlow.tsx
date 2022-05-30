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
  useCreateGithubModel,
  useCreateLocalModel,
  useDeployModelInstance,
  useModelDefinition,
  useModelDefinitions,
  useModelInstance,
  useModelInstances,
} from "@/services/model/ModelServices";
import useOnScreen from "@/hooks/useOnScreen";
import { ModelDefinitionIcon } from "@/components/ui";
import {
  CreateGithubModelPayload,
  CreateLocalModelPayload,
  Model,
} from "@/lib/instill";
import { Nullable } from "@/types/general";

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
  const { values, setFieldValue, validate } = useFormikContext<Values>();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the model definition                             #
  // #                                                                 #
  // ###################################################################

  const flowRef = useRef<HTMLDivElement>(null);
  const flowIsOnScreen = useOnScreen(flowRef);
  const modelDefinitions = useModelDefinitions();

  const [modelDefinitionOptions, setModelDefinitionOptions] =
    useState<Nullable<SingleSelectOption[]>>();
  const [targetModelDefinitionName, setTargetModelDefinitionName] =
    useState<Nullable<string>>(null);

  useEffect(() => {
    if (!flowIsOnScreen || !modelDefinitions.isSuccess) return;

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

  const selectedModelDefinitionOption = useMemo(() => {
    if (!values.model.new.modelDefinition || !modelDefinitionOptions) {
      return null;
    }

    return (
      modelDefinitionOptions?.find(
        (e) => e.value === values.model.new.modelDefinition
      ) || null
    );
  }, [values.model.new.modelDefinition, modelDefinitionOptions]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Set up github/local model                                   #
  // #                                                                 #
  // ###################################################################

  const createGithubModel = useCreateGithubModel();
  const targetModelDefinition = useModelDefinition(targetModelDefinitionName);
  const [newModel, setNewModel] = useState<Nullable<Model>>(null);
  const [isSettingModel, setIsSettingModel] = useState(false);
  const [setupModelError, setSetupModelError] =
    useState<Nullable<string>>(null);

  const canSetupModel = useMemo(() => {
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

  const createLocalModel = useCreateLocalModel();

  const handelSetupModel = async () => {
    console.log(targetModelDefinition);
    if (!targetModelDefinition.isSuccess) return;

    setIsSettingModel(true);
    setSetupModelError(null);

    if (values.model.new.modelDefinition === "github") {
      const configuration = {
        repository: values.model.new.repo,
      };
      console.log(values);

      const payload: CreateGithubModelPayload = {
        id: values.model.new.id,
        model_definition: targetModelDefinition.data.name,
        configuration: JSON.stringify(configuration),
      };

      createGithubModel.mutate(payload, {
        onSuccess: (newModel) => {
          setModelCreated(true);
          setNewModel(newModel);
          setIsSettingModel(false);
        },
        onError: (error) => {
          if (error instanceof Error) {
            console.log(error);
            setSetupModelError(error.message);
          } else {
            setSetupModelError(
              "Something went wrong when setting up GitHub model"
            );
          }
        },
      });
    } else {
      if (
        !values.model.new.id ||
        !values.model.new.description ||
        !values.model.new.file
      ) {
        return;
      }

      const payload: CreateLocalModelPayload = {
        id: values.model.new.id,
        desctiption: values.model.new.description,
        model_definition: "model-definitions/local",
        content: values.model.new.file,
      };

      createLocalModel.mutate(payload, {
        onSuccess: (newModel) => {
          console.log("local");
          setModelCreated(true);
          setNewModel(newModel);
          setIsSettingModel(false);
        },
        onError: (error) => {
          if (error instanceof Error) {
            console.log(error);
            setSetupModelError(error.message);
          } else {
            setSetupModelError(
              "Something went wrong when setting up local model"
            );
          }
        },
      });
    }
  };

  const canDisplayLocalModelFlow = useMemo(() => {
    if (values.model.new.modelDefinition !== "local") {
      return false;
    }
    return true;
  }, [values.model.new.modelDefinition]);

  // ###################################################################
  // #                                                                 #
  // # 2 - Deploy model instance                                       #
  // #                                                                 #
  // ###################################################################

  const modelInstances = useModelInstances(newModel?.id);
  const deployModelInstance = useDeployModelInstance();
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

  const selectedModelInstanceOption = useMemo(() => {
    if (!values.model.new.modelInstance || !modelInstanceOptions) {
      return null;
    }

    return (
      modelInstanceOptions.find(
        (e) => e.value === values.model.new.modelInstance
      ) || null
    );
  }, [modelInstanceOptions, values.model.new.modelInstance]);

  const handleDeployModel = async () => {
    setIsDeployingModel(true);
    deployModelInstance.mutate(values.model.new.modelInstance, {
      onSuccess: () => {
        setIsDeployingModel(false);
        setFieldValue("model.type", "new");
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
      modelDefinitions.data?.find((e) => e.id === option.value)?.name || null
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
        error={null}
      />
      <SingleSelect
        instanceId="new-model-definition"
        name="model.new.modelDefinition"
        value={selectedModelDefinitionOption}
        disabled={modelCreated ? true : false}
        readOnly={false}
        required={true}
        description={"Setup Guide"}
        label="Source type"
        options={modelDefinitionOptions ? modelDefinitionOptions : []}
        onChangeCb={modelDefinitionOnChangeCb}
        menuPlacement="auto"
        error={null}
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
          error={null}
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
            value={
              values.model.new.description ? values.model.new.description : ""
            }
            enableCounter={false}
            counterWordLimit={0}
            error={null}
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
            error={null}
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
          onClickHandler={handelSetupModel}
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
            value={selectedModelInstanceOption}
            disabled={false}
            readOnly={false}
            required={true}
            description={"Setup Guide"}
            label="Source type"
            options={modelInstanceOptions ? modelInstanceOptions : []}
            menuPlacement="auto"
            error={null}
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
