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
  ProgressMessageBoxState,
  SingleSelectOption,
  SolidButton,
} from "@instill-ai/design-system";

import {
  SingleSelect,
  TextArea,
  TextField,
  UploadFileField,
} from "@/components/formik";
import {
  StepNumberState,
  CreatePipelineFormValues,
} from "../CreatePipelineForm";
import {
  useCreateArtivcModel,
  useCreateGithubModel,
  useCreateHuggingFaceModel,
  useCreateLocalModel,
  useDeployModelInstance,
  useModelDefinitions,
  useModelInstances,
} from "@/services/model";
import { ModelDefinitionIcon } from "@/components/ui";
import {
  CreateArtivcModelPayload,
  CreateGithubModelPayload,
  CreateHuggingFaceModelPayload,
  CreateLocalModelPayload,
  Model,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { AxiosError } from "axios";

// We need to pass modelCreated state to UseExistingModelInstanceFlow

export type CreateNewModelInstanceFlowProps = StepNumberState & {
  setModelCreated: Dispatch<SetStateAction<boolean>>;
  modelCreated: boolean;
};

const CreateNewModelInstanceFlow: FC<CreateNewModelInstanceFlowProps> = ({
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

  const [newModel, setNewModel] = useState<Nullable<Model>>(null);

  const [createModelMessageBoxState, setCreateModelMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const canCreateModel = useMemo(() => {
    if (!values.model.new.modelDefinition || modelCreated) return false;

    if (values.model.new.modelDefinition === "github") {
      if (!values.model.new.repo || !values.model.new.id) {
        return false;
      }
      return true;
    }

    if (values.model.new.modelDefinition === "local") {
      if (!values.model.new.file || !values.model.new.id) {
        return false;
      }
      return true;
    }

    if (values.model.new.modelDefinition === "artivc") {
      if (!values.model.new.gcsBucketPath || !values.model.new.id) {
        return false;
      }

      return true;
    }

    if (!values.model.new.huggingFaceRepo) {
      return false;
    }

    return true;
  }, [
    values.model.new.modelDefinition,
    values.model.new.id,
    values.model.new.file,
    values.model.new.repo,
    values.model.new.gcsBucketPath,
    values.model.new.huggingFaceRepo,
    modelCreated,
  ]);

  const createGithubModel = useCreateGithubModel();
  const createLocalModel = useCreateLocalModel();
  const createArtivcModel = useCreateArtivcModel();
  const createHuggingFaceModel = useCreateHuggingFaceModel();

  const handelCreateModel = async () => {
    if (!values.model.new.id) return;

    setCreateModelMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Creating...",
    }));

    if (values.model.new.modelDefinition === "github") {
      if (!values.model.new.repo) return;

      const payload: CreateGithubModelPayload = {
        id: values.model.new.id,
        model_definition: "model-definitions/github",
        description: values.model.new.description ?? null,
        configuration: {
          repository: values.model.new.repo,
        },
      };

      createGithubModel.mutate(payload, {
        onSuccess: (newModel) => {
          setModelCreated(true);
          setNewModel(newModel);
          setCreateModelMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));
          if (amplitudeIsInit) {
            sendAmplitudeData("create_github_model", {
              type: "critical_action",
              process: "pipeline",
            });
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.response?.data.message ?? error.message,
            }));
          } else {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when create the GitHub model",
            }));
          }
        },
      });
    } else if (values.model.new.modelDefinition === "local") {
      if (!values.model.new.id || !values.model.new.file) {
        return;
      }

      const payload: CreateLocalModelPayload = {
        id: values.model.new.id,
        description: values.model.new.description ?? null,
        model_definition: "model-definitions/local",
        configuration: {
          content: values.model.new.file,
        },
      };

      createLocalModel.mutate(payload, {
        onSuccess: (newModel) => {
          setModelCreated(true);
          setNewModel(newModel);
          setCreateModelMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.response?.data.message ?? error.message,
            }));
          } else {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when create the local model",
            }));
          }
        },
      });
    } else if (values.model.new.modelDefinition === "artivc") {
      if (!values.model.new.gcsBucketPath) return;

      const payload: CreateArtivcModelPayload = {
        id: values.model.new.id,
        model_definition: "model-definitions/artivc",
        description: values.model.new.description ?? null,
        configuration: {
          url: values.model.new.gcsBucketPath,
          credential: values.model.new.credentials,
        },
      };

      createArtivcModel.mutate(payload, {
        onSuccess: (newModel) => {
          setModelCreated(true);
          setNewModel(newModel);
          setCreateModelMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));
          if (amplitudeIsInit) {
            sendAmplitudeData("create_artivc_model", {
              type: "critical_action",
            });
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.response?.data.message ?? error.message,
            }));
          } else {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when create the ArtiVC model",
            }));
          }
        },
      });
    } else {
      if (!values.model.new.huggingFaceRepo) return;

      const payload: CreateHuggingFaceModelPayload = {
        id: values.model.new.id,
        model_definition: "model-definitions/huggingface",
        description: values.model.new.description ?? null,
        configuration: {
          repo_id: values.model.new.huggingFaceRepo,
        },
      };

      createHuggingFaceModel.mutate(payload, {
        onSuccess: (newModel) => {
          setModelCreated(true);
          setNewModel(newModel);
          setCreateModelMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));
          if (amplitudeIsInit) {
            sendAmplitudeData("create_artivc_model", {
              type: "critical_action",
            });
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.response?.data.message ?? error.message,
            }));
          } else {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when create the HuggingFace model",
            }));
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

  const [
    deployModelInstanceMessageBoxState,
    setDeployModelInstanceMessageBoxState,
  ] = useState<ProgressMessageBoxState>({
    activate: false,
    message: null,
    description: null,
    status: null,
  });

  const modelInstances = useModelInstances(newModel ? newModel.name : null);
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
    if (!values.model.new.modelInstanceTag) return false;
    return true;
  }, [values.model.new.modelInstanceTag]);

  const selectedModelInstanceOption = useMemo(() => {
    if (!values.model.new.modelInstanceTag || !modelInstanceOptions) {
      return null;
    }

    return (
      modelInstanceOptions.find(
        (e) => e.value === values.model.new.modelInstanceTag
      ) || null
    );
  }, [modelInstanceOptions, values.model.new.modelInstanceTag]);

  const deployModelInstance = useDeployModelInstance();

  const handleDeployModel = async () => {
    if (!values.model.new.modelInstanceTag || !values.model.new.id) return;

    setDeployModelInstanceMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Deploying...",
    }));

    deployModelInstance.mutate(values.model.new.modelInstanceTag, {
      onSuccess: () => {
        setDeployModelInstanceMessageBoxState(() => ({
          activate: true,
          status: "success",
          description: null,
          message: "Succeed.",
        }));
        setFieldValue("model.type", "new");
        setStepNumber(stepNumber + 1);
      },
      onError: (error) => {
        if (error instanceof Error) {
          setDeployModelInstanceMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: error.message,
          }));
        } else {
          setDeployModelInstanceMessageBoxState(() => ({
            activate: true,
            status: "error",
            description: null,
            message: "Something went wrong when deploy the model instance",
          }));
        }
      },
    });
  };

  const modelDefinitionOnChangeCb = useCallback(() => {
    setFieldValue("model.new.description", null);
    setFieldValue("model.new.repo", null);
    setFieldValue("model.new.file", null);
    setFieldValue("model.new.gcsBucketPath", null);
    setFieldValue("model.new.credentials", null);
    setFieldValue("model.new.huggingFaceRepo", null);
  }, [setFieldValue]);

  const getModelSetupGuide = useCallback(() => {
    switch (values.model.new.modelDefinition) {
      case "github":
        return "https://www.instill.tech/docs/import-models/github";
      case "artivc":
        return "https://www.instill.tech/docs/import-models/artivc";
      case "local":
        return "https://www.instill.tech/docs/import-models/local";
      case "huggingface":
        return "https://www.instill.tech/docs/import-models/huggingface";
      default:
        return "https://www.instill.tech/docs/import-models/overview";
    }
  }, [values.model.new.modelDefinition]);

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      <h3 className="text-black text-instill-h3">Set up a new model</h3>
      <TextField
        id="modelId"
        name="model.new.id"
        label="ID"
        description={
          "Pick a name to help you identify this resource. The ID conforms to RFC-1034, " +
          "which restricts to letters, numbers, and hyphen, with the first character a letter," +
          "the last a letter or a number, and a 63 character maximum."
        }
        value={values.model.new.id}
        error={errors.model?.new?.id || null}
        disabled={modelCreated ? true : false}
        required={true}
      />
      <TextArea
        id="description"
        name="model.new.description"
        label="Description"
        description="Fill with a short description."
        value={values.model.new.description}
        error={errors.model?.new?.description || null}
      />
      <SingleSelect
        id="modelDefinition"
        name="model.new.modelDefinition"
        label="Model source"
        description={`<a href="${getModelSetupGuide()}">Setup Guide</a>`}
        value={selectedModelDefinitionOption}
        options={modelDefinitionOptions ? modelDefinitionOptions : []}
        error={errors.model?.new?.modelDefinition || null}
        additionalOnChangeCb={modelDefinitionOnChangeCb}
        disabled={modelCreated ? true : false}
        required={true}
      />
      {values.model.new.modelDefinition === "github" ? (
        <>
          <TextField
            id="modelRepo"
            name="model.new.repo"
            label="GitHub repository"
            description="The name of a public GitHub repository, e.g. `instill-ai/model-mobilenetv2`."
            value={values.model.new.repo}
            error={errors.model?.new?.repo || null}
            disabled={modelCreated ? true : false}
            required={true}
          />
        </>
      ) : null}
      {values.model.new.modelDefinition === "local" ? (
        <>
          <UploadFileField
            id="file"
            name="model.new.file"
            label="Upload a file"
            additionalMessageOnLabel={null}
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
      {values.model.new.modelDefinition === "artivc" ? (
        <>
          <TextField
            id="gcsBucketPath"
            name="model.new.gcsBucketPath"
            label="GCS Bucket Path"
            description="The bucket path string of Google Cloud Storage (GCS), e.g. `gs://mybucket/path/to/mymodel/`."
            value={values.model.new.gcsBucketPath}
            error={errors.model?.new?.gcsBucketPath || null}
            required={true}
          />
          <TextArea
            id="credentials"
            name="model.new.credentials"
            label="Credentials JSON"
            description="If the GCS bucket path is private, please provide the Google Cloud Application Default credential or service account credential in its JSON format to get access to the model. See ArtiVC Google Cloud Storage setup guide."
            value={values.model.new.credentials}
            error={errors.model?.new?.credentials || null}
          />
        </>
      ) : null}
      {values.model.new.modelDefinition === "huggingface" ? (
        <>
          <TextField
            id="huggingFaceRepo"
            name="model.new.huggingFaceRepo"
            label="HuggingFace model ID"
            description="The name of a public HuggingFace model ID, e.g. `google/vit-base-patch16-224`."
            value={values.model.new.huggingFaceRepo}
            error={errors.model?.new?.huggingFaceRepo || null}
            disabled={modelCreated ? true : false}
            required={true}
          />
        </>
      ) : null}
      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={createModelMessageBoxState}
          setState={setCreateModelMessageBoxState}
          width="w-[15vw]"
          closable={true}
        />
        <SolidButton
          disabled={canCreateModel ? false : true}
          onClickHandler={handelCreateModel}
          position="ml-auto my-auto"
          type="button"
          color="primary"
        >
          Set up
        </SolidButton>
      </div>

      {canDisplayDeployModelSection ? (
        <>
          <h3 className="mt-[60px] mb-5 text-black text-instill-h3">
            Deploy a model instance
          </h3>
          <SingleSelect
            id="modelInstanceTag"
            name="model.new.modelInstanceTag"
            label="Model instances"
            options={modelInstanceOptions ? modelInstanceOptions : []}
            value={selectedModelInstanceOption}
            error={errors.model?.new?.modelInstanceTag || null}
            required={true}
            description={
              "<a href='https://www.instill.tech/docs/core-concepts/model#model-instance'>Setup Guide</a>"
            }
          />
          <div className="flex flex-row">
            <BasicProgressMessageBox
              state={deployModelInstanceMessageBoxState}
              setState={setDeployModelInstanceMessageBoxState}
              width="w-[15vw]"
              closable={true}
            />
            <SolidButton
              disabled={canDeployModel ? false : true}
              onClickHandler={handleDeployModel}
              position="ml-auto my-auto"
              type="button"
              color="primary"
            >
              Deploy
            </SolidButton>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CreateNewModelInstanceFlow;
