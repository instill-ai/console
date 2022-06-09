import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
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
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import {
  useCreateGithubModel,
  useCreateLocalModel,
  useDeployModelInstance,
  useModelDefinitions,
  useModelInstances,
} from "@/services/model";
import { ModelDefinitionIcon, PrimaryButton } from "@/components/ui";
import {
  CreateGithubModelPayload,
  CreateLocalModelPayload,
  Model,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

// We need to pass modelCreated state to UseExistingModelFlow

export type CreateNewModelFlowProps = StepNumberState & {
  setModelCreated: Dispatch<SetStateAction<boolean>>;
  modelCreated: boolean;
};

const CreateNewModelFlow: FC<CreateNewModelFlowProps> = ({
  setStepNumber,
  stepNumber,
  setModelCreated,
  modelCreated,
}) => {
  const { values, setFieldValue, errors } =
    useFormikContext<CreatePipelineFormValues>();
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the model definition                             #
  // #                                                                 #
  // ###################################################################

  const modelDefinitions = useModelDefinitions();

  const [modelDefinitionOptions, setModelDefinitionOptions] =
    useState<Nullable<SingleSelectOption[]>>();

  useEffect(() => {
    if (!modelDefinitions.isSuccess || !modelDefinitions.data) return;

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
  }, [modelDefinitions.isSuccess, modelDefinitions.data]);

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
  const createLocalModel = useCreateLocalModel();

  const [newModel, setNewModel] = useState<Nullable<Model>>(null);
  const [isSettingModel, setIsSettingModel] = useState(false);
  const [setupModelError, setSetupModelError] =
    useState<Nullable<string>>(null);

  const canDisplayLocalModelFlow = useMemo(() => {
    if (values.model.new.modelDefinition !== "local") {
      return false;
    }
    return true;
  }, [values.model.new.modelDefinition]);

  const canCreateModel = useMemo(() => {
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
    values.model.new.modelDefinition,
    values.model.new.id,
    values.model.new.file,
    values.model.new.description,
    values.model.new.repo,
    modelCreated,
  ]);

  const handelCreateModel = async () => {
    if (!values.model.new.id) return;

    setIsSettingModel(true);
    setSetupModelError(null);

    if (values.model.new.modelDefinition === "github") {
      const configuration = {
        repository: values.model.new.repo,
      };
      const payload: CreateGithubModelPayload = {
        id: values.model.new.id,
        model_definition: "model-definitions/github",
        configuration: JSON.stringify(configuration),
      };

      createGithubModel.mutate(payload, {
        onSuccess: (newModel) => {
          setModelCreated(true);
          setNewModel(newModel);
          setIsSettingModel(false);
          if (amplitudeIsInit) {
            sendAmplitudeData("create_github_model", {
              type: "critical_action",
              process: "pipeline",
            });
          }
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

  // ###################################################################
  // #                                                                 #
  // # 2 - Deploy model instance                                       #
  // #                                                                 #
  // ###################################################################

  const [isDeployingModel, setIsDeployingModel] = useState(false);
  const [deployModelError, setDeployModelError] = useState<
    string | undefined
  >();

  const modelInstances = useModelInstances(newModel ? newModel.id : null);
  const modelInstanceOptions = useMemo(() => {
    if (!modelInstances.isSuccess || !modelInstances.data) return;

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
  }, [modelInstances.isSuccess, modelInstances.data]);

  const canDisplayDeployModelSection = useMemo(() => {
    if (!modelCreated || !newModel || !modelInstances.isSuccess) {
      return false;
    }
    return true;
  }, [modelCreated, newModel, modelInstances.isSuccess]);

  const canDeployModel = useMemo(() => {
    if (!values.model.new.modelInstanceName) return false;
    return true;
  }, [values.model.new.modelInstanceName]);

  const selectedModelInstanceOption = useMemo(() => {
    if (!values.model.new.modelInstanceName || !modelInstanceOptions) {
      return null;
    }

    return (
      modelInstanceOptions.find(
        (e) => e.value === values.model.new.modelInstanceName
      ) || null
    );
  }, [modelInstanceOptions, values.model.new.modelInstanceName]);

  const deployModelInstance = useDeployModelInstance();

  const handleDeployModel = async () => {
    if (!values.model.new.modelInstanceName || !values.model.new.id) return;

    setIsDeployingModel(true);
    deployModelInstance.mutate(values.model.new.modelInstanceName, {
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

  const modelDefinitionOnChangeCb = useCallback(
    (option: SingleSelectOption) => {
      if (option.value !== "github") {
        setFieldValue("model.new.modelInstance", null);
      }
    },
    [setFieldValue]
  );

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="instill-text-h3 text-black">Set up a new model</h3>
      <TextField
        name="model.new.id"
        label="Name"
        description="Pick a name to help you identify this source in Instill"
        value={values.model.new.id}
        error={errors.model?.new?.id || null}
        additionalOnChangeCb={null}
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
        label="Source type"
        description={"Setup Guide"}
        value={selectedModelDefinitionOption}
        options={modelDefinitionOptions ? modelDefinitionOptions : []}
        error={errors.model?.new?.modelDefinition || null}
        additionalOnChangeCb={modelDefinitionOnChangeCb}
        disabled={modelCreated ? true : false}
        readOnly={false}
        required={true}
        menuPlacement="auto"
      />
      {values.model.new.modelDefinition === "github" ? (
        <TextField
          name="model.new.repo"
          label="GitHub repository"
          description="The name of a public GitHub repository, e.g. `instill-ai/yolov4`."
          value={values.model.new.repo}
          error={errors.model?.new?.repo || null}
          additionalOnChangeCb={null}
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
            value={values.model.new.description}
            error={errors.model?.new?.description || null}
            additionalOnChangeCb={null}
            disabled={false}
            readOnly={false}
            required={true}
            autoComplete="off"
            placeholder=""
            enableCounter={false}
            counterWordLimit={0}
          />
          <UploadFileField
            name="model.new.file"
            label="Upload a file"
            description="Create and upload a zip file that contains all the model files from your computer"
            error={errors.model?.new?.file || null}
            additionalOnChangeCb={null}
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
          disabled={canCreateModel ? false : true}
          onClickHandler={handelCreateModel}
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
            name="model.new.modelInstanceName"
            options={modelInstanceOptions ? modelInstanceOptions : []}
            value={selectedModelInstanceOption}
            error={errors.model?.new?.modelInstanceName || null}
            additionalOnChangeCb={null}
            disabled={false}
            readOnly={false}
            required={true}
            description={"Setup Guide"}
            label="Source type"
            menuPlacement="auto"
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
