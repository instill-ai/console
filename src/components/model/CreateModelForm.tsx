import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextArea,
  BasicTextField,
  BasicUploadFileField,
  ModelInstanceIcon,
  ProgressMessageBoxState,
  SingleSelectOption,
  SolidButton,
} from "@instill-ai/design-system";

import {
  useCreateArtivcModel,
  useCreateGithubModel,
  useCreateHuggingFaceModel,
  useCreateLocalModel,
  useDeployModelInstance,
  useModelDefinitions,
  useModelInstances,
} from "@/services/model";
import { FormBase, ModelDefinitionIcon } from "@/components/ui";
import {
  CreateArtivcModelPayload,
  CreateGithubModelPayload,
  CreateHuggingFaceModelPayload,
  CreateLocalModelPayload,
  getModelQuery,
  Model,
  validateResourceId,
  checkCreateModelOperationUntilDone,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { AxiosError } from "axios";
import { useQueryClient } from "react-query";

export type CreateModelFormValue = {
  id: Nullable<string>;
  modelDefinition: Nullable<string>;
  modelInstanceTag: Nullable<string>;
  file: Nullable<File>;
  repo: Nullable<string>;
  description: Nullable<string>;
  gcsBucketPath: Nullable<string>;
  credentials: Nullable<string>;
  huggingFaceRepo: Nullable<string>;
};

export const CreateModelForm = () => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const queryClient = useQueryClient();

  // #########################################################################
  // # 1 - Initialize the model definition                                   #
  // #########################################################################
  const modelDefinitions = useModelDefinitions();
  const modelDefinitionOptions = useMemo(() => {
    if (!modelDefinitions.isSuccess) return [];

    return modelDefinitions.data.map((e) => {
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
    });
  }, [modelDefinitions.isSuccess, modelDefinitions.data]);

  const [selectedModelDefinitionOption, setSelectedModelDefinitionOption] =
    useState<Nullable<SingleSelectOption>>(null);

  // #########################################################################
  // # 2 - Initialize State and necessary function                           #
  // #########################################################################
  const [fieldValues, setFieldValues] = useState<CreateModelFormValue>({
    id: null,
    modelDefinition: null,
    modelInstanceTag: null,
    file: null,
    repo: null,
    description: null,
    gcsBucketPath: null,
    credentials: null,
    huggingFaceRepo: null,
  });

  const [fieldErrors, setFieldErrors] = useState<
    Record<string, Nullable<string>>
  >({
    id: null,
    modelDefinition: null,
    modelInstanceTag: null,
    file: null,
    repo: null,
    description: null,
    gcsBucketPath: null,
    credentials: null,
    huggingFaceRepo: null,
  });

  const updateFieldValues = useCallback(
    (field: string, value: Nullable<string | File>) => {
      setFieldValues((prev) => {
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [setFieldValues]
  );

  // #########################################################################
  // # 2 - Create github/local/artivc/huggingface model                      #
  // #########################################################################
  const [modelCreated, setModelCreated] = useState(false);
  const [newModel, setNewModel] = useState<Nullable<Model>>(null);

  const [createModelMessageBoxState, setCreateModelMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const validateCreateModelValue = useCallback(() => {
    if (!fieldValues.modelDefinition || modelCreated || !fieldValues.id) {
      return false;
    }

    if (fieldValues.modelDefinition === "github") {
      if (!fieldValues.repo) {
        return false;
      }
      return true;
    }

    if (fieldValues.modelDefinition === "local") {
      if (!fieldValues.file) {
        return false;
      }
      return true;
    }

    if (fieldValues.modelDefinition === "artivc") {
      if (!fieldValues.gcsBucketPath) {
        return false;
      }

      return true;
    }

    if (!fieldValues.huggingFaceRepo) {
      return false;
    }

    return true;
  }, [modelCreated, fieldValues]);

  const createGithubModel = useCreateGithubModel();
  const createLocalModel = useCreateLocalModel();
  const createArtivcModel = useCreateArtivcModel();
  const createHuggingFaceModel = useCreateHuggingFaceModel();

  const prepareNewModel = useCallback(
    async (modelName: string) => {
      const model = await getModelQuery(modelName);
      setModelCreated(true);
      setNewModel(model);

      queryClient.setQueryData<Model>(["models", model.id], model);
      queryClient.setQueryData<Model[]>(["models"], (old) =>
        old ? [...old, model] : [model]
      );

      setCreateModelMessageBoxState({
        activate: true,
        status: "success",
        description: null,
        message: "Succeed.",
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("create_github_model", {
          type: "critical_action",
          process: "model",
        });
      }
    },
    [amplitudeIsInit, sendAmplitudeData]
  );

  const handelCreateModel = useCallback(async () => {
    if (!fieldValues.id) return;

    // We don't validate the rest of the field if the ID is incorrect
    if (!validateResourceId(fieldValues.id as string)) {
      setFieldErrors((prev) => ({
        ...prev,
        id: "Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum.",
      }));
      return;
    }

    setCreateModelMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Creating...",
    }));

    if (fieldValues.modelDefinition === "github") {
      if (!fieldValues.repo) return;

      const payload: CreateGithubModelPayload = {
        id: fieldValues.id.trim(),
        model_definition: "model-definitions/github",
        description: fieldValues.description ?? null,
        configuration: {
          repository: fieldValues.repo.trim(),
        },
      };

      createGithubModel.mutate(payload, {
        onSuccess: async ({ operation }) => {
          if (!fieldValues.id) return;
          const operationIsDone = await checkCreateModelOperationUntilDone(
            operation.name
          );

          if (operationIsDone) {
            await prepareNewModel(`models/${fieldValues.id.trim()}`);
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: JSON.stringify(
                error.response?.data.details,
                null,
                "\t"
              ),
              message: error.message,
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
    } else if (fieldValues.modelDefinition === "local") {
      if (!fieldValues.id || !fieldValues.file) {
        return;
      }

      const payload: CreateLocalModelPayload = {
        id: fieldValues.id.trim(),
        description: fieldValues.description ? fieldValues.description : "",
        model_definition: "model-definitions/local",
        configuration: {
          content: fieldValues.file,
        },
      };

      createLocalModel.mutate(payload, {
        onSuccess: async ({ operation }) => {
          if (!fieldValues.id) return;
          const operationIsDone = await checkCreateModelOperationUntilDone(
            operation.name
          );

          if (operationIsDone) {
            await prepareNewModel(`models/${fieldValues.id.trim()}`);
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: JSON.stringify(
                error.response?.data.details,
                null,
                "\t"
              ),
              message: error.message,
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
    } else if (fieldValues.modelDefinition === "artivc") {
      if (!fieldValues.gcsBucketPath) return;

      const payload: CreateArtivcModelPayload = {
        id: fieldValues.id,
        model_definition: "model-definitions/artivc",
        description: fieldValues.description ?? null,
        configuration: {
          url: fieldValues.gcsBucketPath.trim(),
          credential: fieldValues.credentials
            ? fieldValues.credentials.trim()
            : null,
        },
      };

      createArtivcModel.mutate(payload, {
        onSuccess: async ({ operation }) => {
          if (!fieldValues.id) return;
          const operationIsDone = await checkCreateModelOperationUntilDone(
            operation.name
          );

          if (operationIsDone) {
            await prepareNewModel(`models/${fieldValues.id.trim()}`);
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: JSON.stringify(
                error.response?.data.details,
                null,
                "\t"
              ),
              message: error.message,
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
      if (!fieldValues.huggingFaceRepo) return;

      const payload: CreateHuggingFaceModelPayload = {
        id: fieldValues.id,
        model_definition: "model-definitions/huggingface",
        description: fieldValues.description ?? null,
        configuration: {
          repo_id: fieldValues.huggingFaceRepo.trim(),
        },
      };

      createHuggingFaceModel.mutate(payload, {
        onSuccess: async ({ operation }) => {
          if (!fieldValues.id) return;
          const operationIsDone = await checkCreateModelOperationUntilDone(
            operation.name
          );

          if (operationIsDone) {
            await prepareNewModel(`models/${fieldValues.id.trim()}`);
          }
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            setCreateModelMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: JSON.stringify(
                error.response?.data.details,
                null,
                "\t"
              ),
              message: error.message,
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
  }, [
    amplitudeIsInit,
    createArtivcModel,
    createGithubModel,
    createLocalModel,
    createHuggingFaceModel,
    fieldValues.credentials,
    fieldValues.description,
    fieldValues.file,
    fieldValues.gcsBucketPath,
    fieldValues.huggingFaceRepo,
    fieldValues.id,
    fieldValues.modelDefinition,
    fieldValues.repo,
  ]);

  // #########################################################################
  // #  3 - Initialize model instances                                       #
  // #########################################################################

  const modelInstances = useModelInstances(newModel ? newModel.name : null);
  const modelInstanceOptions = useMemo(() => {
    if (!modelInstances.isSuccess) return [];

    const options: SingleSelectOption[] = modelInstances.data.map((e) => {
      return {
        label: e.id,
        value: e.id,
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

  const [selectedModelInstanceOption, setSelectedModelInstanceOption] =
    useState<Nullable<SingleSelectOption>>(null);

  // #########################################################################
  // #  4 - Deploy model instances                                           #
  // #########################################################################

  const router = useRouter();
  const [isDeploying, setIsDeploying] = useState(false);

  const [
    deployModelInstanceMessageBoxState,
    setDeployModelInstanceMessageBoxState,
  ] = useState<ProgressMessageBoxState>({
    activate: false,
    message: null,
    description: null,
    status: null,
  });

  const canDisplayDeployModelInstanceSection = useMemo(() => {
    if (!modelCreated || !newModel || !modelInstances.isSuccess) {
      return false;
    }
    return true;
  }, [modelCreated, newModel, modelInstances.isSuccess]);

  const deployModelInstance = useDeployModelInstance();

  const handleDeployModelInstance = async (values: CreateModelFormValue) => {
    if (!values.modelInstanceTag || !values.id) return;

    setDeployModelInstanceMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Deploying...",
    }));

    setIsDeploying(true);

    deployModelInstance.mutate(
      `models/${values.id}/instances/${values.modelInstanceTag}`,
      {
        onSuccess: () => {
          setDeployModelInstanceMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));

          router.push("/models");
        },
        onError: (error) => {
          setIsDeploying(false);
          if (error instanceof AxiosError) {
            setDeployModelInstanceMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.response?.data.message ?? error.message,
            }));
          } else {
            console.log(error);
            setDeployModelInstanceMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when deploy the model instance",
            }));
          }
        },
      }
    );
  };

  const getModelSetupGuide = useCallback((values: CreateModelFormValue) => {
    switch (values.modelDefinition) {
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
  }, []);

  return (
    <FormBase
      padding={null}
      noValidate={true}
      flex1={false}
      marginBottom={null}
    >
      <div className="flex flex-col gap-y-5 mb-10">
        <BasicTextField
          id="modelId"
          label="ID"
          key="id"
          description="Pick a name to help you identify this resource. 
                  The ID conforms to RFC-1034, which restricts to letters, 
                  numbers, and hyphen, with the first character a letter, 
                  the last a letter or a number, and a 63 character maximum."
          required={true}
          disabled={
            modelDefinitions.isSuccess ? (modelCreated ? true : false) : false
          }
          value={fieldValues.id}
          error={fieldErrors.id}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateFieldValues("id", event.target.value.trim())
          }
        />
        <BasicTextArea
          id="description"
          label="Description"
          key="description"
          description="Fill with a short description."
          required={false}
          disabled={
            modelDefinitions.isSuccess ? (modelCreated ? true : false) : false
          }
          error={fieldErrors.description}
          value={fieldValues.description}
          enableCounter={true}
          counterWordLimit={1023}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            updateFieldValues("description", event.target.value)
          }
        />
        <BasicSingleSelect
          id="modelDefinition"
          key="modelDefinition"
          instanceId="modelDefinition"
          menuPlacement="auto"
          label="Model source"
          value={selectedModelDefinitionOption}
          options={modelDefinitionOptions ? modelDefinitionOptions : []}
          error={fieldErrors.modelDefinition || null}
          onChange={(option) => {
            updateFieldValues(
              "modelDefinition",
              (option?.value as string) || null
            );
            setSelectedModelDefinitionOption(option);
          }}
          disabled={
            modelDefinitions.isSuccess ? (modelCreated ? true : false) : false
          }
          required={true}
          description={`<a href="${getModelSetupGuide(
            fieldValues
          )}">Setup Guide</a>`}
        />
        {selectedModelDefinitionOption?.value === "github" ? (
          <>
            <BasicTextField
              id="modelRepo"
              label="GitHub repository"
              description="The name of a public GitHub repository, e.g.
                      `instill-ai/model-mobilenetv2`."
              required={true}
              value={fieldValues.repo}
              error={fieldErrors.repo}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateFieldValues("repo", event.target.value)
              }
              disabled={modelCreated ? true : false}
            />
          </>
        ) : null}
        {selectedModelDefinitionOption?.value === "local" ? (
          <>
            <BasicUploadFileField
              id="file"
              name="file"
              label="Upload a file"
              description="Create and upload a zip file that contains all the model files from your computer"
              error={fieldErrors.file || null}
              placeholder=""
              uploadButtonText="Upload"
              required={true}
              readOnly={false}
              disabled={modelCreated ? true : false}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateFieldValues(
                  "file",
                  event.target.files ? event.target.files[0] : null
                )
              }
            />
          </>
        ) : null}
        {selectedModelDefinitionOption?.value === "artivc" ? (
          <>
            <BasicTextField
              id="gcsBucketPath"
              label="GCS Bucket Path"
              description="The bucket path string of Google Cloud Storage (GCS), e.g. `gs://mybucket/path/to/mymodel/`."
              required={true}
              value={fieldValues.gcsBucketPath}
              error={fieldErrors.gcsBucketPath}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateFieldValues("gcsBucketPath", event.target.value)
              }
            />
            <BasicTextArea
              id="credentials"
              label="Credentials JSON"
              key="credentials"
              description="If the GCS bucket path is private, please provide the Google Cloud Application Default credential or service account credential in its JSON format to get access to the model. See ArtiVC Google Cloud Storage setup guide."
              error={fieldErrors.credentials}
              value={fieldValues.credentials}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                updateFieldValues("credentials", event.target.value)
              }
            />
          </>
        ) : null}
        {selectedModelDefinitionOption?.value === "huggingface" ? (
          <>
            <BasicTextField
              id="huggingFaceRepo"
              label="HuggingFace model ID"
              description="The name of a public HuggingFace model ID, e.g. `google/vit-base-patch16-224`."
              required={true}
              value={fieldValues.huggingFaceRepo}
              error={fieldErrors.huggingFaceRepo}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateFieldValues("huggingFaceRepo", event.target.value)
              }
            />
          </>
        ) : null}
      </div>
      <div className="flex flex-row mb-10">
        <BasicProgressMessageBox
          state={createModelMessageBoxState}
          setState={setCreateModelMessageBoxState}
          width="w-[25vw]"
          closable={true}
        />
        <SolidButton
          disabled={validateCreateModelValue() ? false : true}
          onClickHandler={() => handelCreateModel()}
          position="ml-auto my-auto"
          type="button"
          data-testid="set-up-model-button"
          color="primary"
        >
          Set up
        </SolidButton>
      </div>

      {/*  
        The deploy section will show up once model had been selected and downloaded.
      */}

      {canDisplayDeployModelInstanceSection ? (
        <>
          <div className="flex flex-col mb-10">
            <h3 className="mt-[60px] mb-5 text-black text-instill-h3">
              Deploy a model instance
            </h3>
            <BasicSingleSelect
              id="modelInstanceTag"
              key="modelInstanceTag"
              instanceId="modelInstanceTag"
              menuPlacement="auto"
              label="Model Instances"
              value={selectedModelInstanceOption}
              options={modelInstanceOptions ? modelInstanceOptions : []}
              error={fieldErrors.modelInstanceTag || null}
              onChange={(option) => {
                setSelectedModelInstanceOption(option);
                updateFieldValues("modelInstanceTag", option?.value as string);
              }}
              required={true}
              description={
                "<a href='https://www.instill.tech/docs/core-concepts/model#model-instance'>Setup Guide</a>"
              }
            />
          </div>
          <div className="flex flex-row">
            <BasicProgressMessageBox
              state={deployModelInstanceMessageBoxState}
              setState={setDeployModelInstanceMessageBoxState}
              width="w-[25vw]"
              closable={true}
            />
            <SolidButton
              disabled={
                fieldValues.modelInstanceTag
                  ? isDeploying
                    ? true
                    : false
                  : true
              }
              onClickHandler={() => handleDeployModelInstance(fieldValues)}
              position="ml-auto mb-auto"
              type="button"
              color="primary"
            >
              Deploy
            </SolidButton>
          </div>
        </>
      ) : null}
    </FormBase>
  );
};
