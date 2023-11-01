import cn from "clsx";
import axios from "axios";
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextArea,
  BasicTextField,
  BasicUploadFileField,
  FormRoot,
  ProgressMessageBoxState,
  SingleSelectOption,
  SolidButton,
  getModelDefinitionToolkit,
} from "@instill-ai/design-system";

import {
  validateResourceId,
  useAmplitudeCtx,
  sendAmplitudeData,
  useCreateResourceFormStore,
  getInstillApiErrorMessage,
  useModelDefinitions,
  type Model,
  type Nullable,
  type CreateResourceFormStore,
  useCreateUserModel,
  getUserModelQuery,
  useUser,
  useDeployUserModel,
  CreateUserModelPayload,
  watchUserModel,
} from "../../lib";
import { checkUntilOperationIsDoen } from "../../lib/vdp-sdk/operation";

export type CreateModelFormProps = {
  accessToken: Nullable<string>;
  onCreate: Nullable<(initStore: () => void) => void>;
  disabledCreateModel?: boolean;
  width?: string;
  marginBottom?: string;
  enabledQuery: boolean;
};

const selector = (state: CreateResourceFormStore) => ({
  init: state.init,
  setFieldError: state.setFieldError,
  setFieldValue: state.setFieldValue,
  modelId: state.fields.model.new.id,
  modelIdError: state.errors.model.new.id,
  modelDescription: state.fields.model.new.description,
  modelDescriptionError: state.errors.model.new.description,
  modelDefinition: state.fields.model.new.definition,
  modelDefinitionError: state.errors.model.new.definition,
  modelGithubRepoUrl: state.fields.model.new.github.repoUrl,
  modelGithubRepoUrlError: state.errors.model.new.github.repoUrl,
  modelGithubTag: state.fields.model.new.github.tag,
  modelGithubTagError: state.errors.model.new.github.tag,
  modelLocalFile: state.fields.model.new.local.file,
  modelLocalFileError: state.errors.model.new.local.file,
  modelArtivcGcsBucketPath: state.fields.model.new.artivc.gcsBucketPath,
  modelArtivcGcsBucketPathError: state.errors.model.new.artivc.gcsBucketPath,
  modelArtivcCredentials: state.fields.model.new.artivc.credentials,
  modelArtivcCredentialsError: state.errors.model.new.artivc.credentials,
  modelArtivcTag: state.fields.model.new.artivc.tag,
  modelArtivcTagError: state.errors.model.new.artivc.tag,
  modelHuggingFaceRepoUrl: state.fields.model.new.huggingFace.repoUrl,
  modelHuggingFaceRepoUrlError: state.errors.model.new.huggingFace.repoUrl,
});

export const CreateModelForm = (props: CreateModelFormProps) => {
  const {
    accessToken,
    enabledQuery,
    marginBottom,
    onCreate,
    width,
    disabledCreateModel,
  } = props;

  /* -------------------------------------------------------------------------
   * Initialize form state
   * -----------------------------------------------------------------------*/

  const { amplitudeIsInit } = useAmplitudeCtx();
  const queryClient = useQueryClient();

  const {
    init,
    setFieldError,
    setFieldValue,
    modelId,
    modelIdError,
    modelDescription,
    modelDescriptionError,
    modelDefinition,
    modelDefinitionError,
    modelGithubRepoUrl,
    modelGithubRepoUrlError,
    modelGithubTag,
    modelGithubTagError,
    modelLocalFile,
    modelLocalFileError,
    modelArtivcGcsBucketPath,
    modelArtivcGcsBucketPathError,
    modelArtivcCredentials,
    modelArtivcCredentialsError,
    modelArtivcTag,
    modelArtivcTagError,
    modelHuggingFaceRepoUrl,
    modelHuggingFaceRepoUrlError,
  } = useCreateResourceFormStore(selector, shallow);

  const user = useUser({
    enabled: enabledQuery,
    accessToken,
  });

  /* -------------------------------------------------------------------------
   * Initialize the model definition
   * -----------------------------------------------------------------------*/

  const modelDefinitions = useModelDefinitions({
    enabled: enabledQuery,
    accessToken,
  });

  const modelDefinitionOptions = React.useMemo(() => {
    if (!modelDefinitions.isSuccess) return [];

    return modelDefinitions.data.map((e) => {
      const { getIcon } = getModelDefinitionToolkit(e.name);
      return {
        label: e.title,
        value: e.name,
        startIcon: getIcon({
          width: "w-[30px]",
          height: "h-[30px]",
          color: "fill-instillGrey90",
          position: "my-auto",
        }),
      };
    });
  }, [modelDefinitions]);

  const [selectedModelDefinitionOption, setSelectedModelDefinitionOption] =
    React.useState<Nullable<SingleSelectOption>>(null);

  /* -------------------------------------------------------------------------
   * Create github/local/artivc/huggingface model
   * -----------------------------------------------------------------------*/

  const [modelCreated, setModelCreated] = React.useState(false);

  const [createModelMessageBoxState, setCreateModelMessageBoxState] =
    React.useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const canCreateModel = React.useMemo(() => {
    if (!modelDefinition || modelCreated || !modelId) {
      return false;
    }

    if (modelDefinition === "model-definitions/github") {
      if (!modelGithubRepoUrl || !modelGithubTag) {
        return false;
      }
      return true;
    }

    if (modelDefinition === "model-definitions/local") {
      if (!modelLocalFile) {
        return false;
      }
      return true;
    }

    if (modelDefinition === "model-definitions/artivc") {
      if (!modelArtivcGcsBucketPath || !modelArtivcTag) {
        return false;
      }

      return true;
    }

    if (!modelHuggingFaceRepoUrl) {
      return false;
    }

    return true;
  }, [
    modelCreated,
    modelDefinition,
    modelId,
    modelGithubRepoUrl,
    modelGithubTag,
    modelLocalFile,
    modelArtivcGcsBucketPath,
    modelArtivcTag,
    modelHuggingFaceRepoUrl,
  ]);

  const createUserModel = useCreateUserModel();

  const prepareNewModel = React.useCallback(
    async (modelName: string) => {
      const model = await getUserModelQuery({ modelName, accessToken });
      setModelCreated(true);

      queryClient.setQueryData<Model>(["models", model.name], model);
      queryClient.setQueryData<Model[]>(["models"], (old) =>
        old ? [...old, model] : [model]
      );

      setFieldValue("model.type", "new");
      setFieldValue("model.new.modelIsSet", true);

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
    [amplitudeIsInit, accessToken, queryClient, setFieldValue]
  );

  const deployUserModel = useDeployUserModel();

  const handelCreateModel = React.useCallback(async () => {
    if (!modelId || !user.isSuccess) return;

    // We don't validate the rest of the field if the ID is incorrect
    if (!validateResourceId(modelId as string)) {
      setFieldError(
        "model.new.id",
        "Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum."
      );
      return;
    } else if (modelId) {
      setFieldError("model.new.id", null);
    }

    setCreateModelMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Creating...",
    }));

    if (modelDefinition === "model-definitions/github") {
      if (!modelGithubRepoUrl || !modelGithubTag) return;

      const payload: CreateUserModelPayload = {
        type: "GitHub",
        id: modelId.trim(),
        model_definition: "model-definitions/github",
        description: modelDescription ?? undefined,
        configuration: {
          repository: modelGithubRepoUrl.trim(),
          tag: modelGithubTag.trim(),
        },
      };

      createUserModel.mutate(
        { userName: user.data.name, payload, accessToken },
        {
          onSuccess: async ({ operation }) => {
            if (!modelId) return;
            const operationIsDone = await checkUntilOperationIsDoen({
              operationName: operation.name,
              accessToken,
            });

            if (operationIsDone) {
              const modelName = `${user.data.name}/models/${modelId.trim()}`;
              const modelState = await watchUserModel({
                modelName,
                accessToken,
              });

              if (modelState.state === "STATE_ERROR") {
                setCreateModelMessageBoxState(() => ({
                  activate: true,
                  status: "error",
                  description: "Something went wrong when create the model",
                  message: "Create Model Failed",
                }));
                return;
              }

              await prepareNewModel(modelName);
              deployUserModel.mutate({ modelName, accessToken });

              setCreateModelMessageBoxState({
                activate: true,
                status: "success",
                description: null,
                message: "Succeed.",
              });

              if (onCreate) {
                onCreate(init);
              }
            }
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              setCreateModelMessageBoxState(() => ({
                activate: true,
                status: "error",
                description: getInstillApiErrorMessage(error),
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
        }
      );
    } else if (modelDefinition === "model-definitions/local") {
      if (!modelId || !modelLocalFile) {
        return;
      }

      const payload: CreateUserModelPayload = {
        type: "Local",
        id: modelId.trim(),
        description: modelDescription ?? undefined,
        model_definition: "model-definitions/local",
        configuration: {
          content: modelLocalFile,
        },
      };

      createUserModel.mutate(
        { userName: user.data.name, payload, accessToken },
        {
          onSuccess: async ({ operation }) => {
            if (!modelId) return;
            const operationIsDone = await checkUntilOperationIsDoen({
              operationName: operation.name,
              accessToken,
            });

            if (operationIsDone) {
              const modelName = `${user.data.name}/models/${modelId.trim()}`;
              const modelState = await watchUserModel({
                modelName,
                accessToken,
              });

              if (modelState.state === "STATE_ERROR") {
                setCreateModelMessageBoxState(() => ({
                  activate: true,
                  status: "error",
                  description: "Something went wrong when create the model",
                  message: "Create Model Failed",
                }));
                return;
              }

              await prepareNewModel(modelName);
              deployUserModel.mutate({ modelName, accessToken });

              setCreateModelMessageBoxState({
                activate: true,
                status: "success",
                description: null,
                message: "Succeed.",
              });

              if (onCreate) {
                onCreate(init);
              }
            }
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              setCreateModelMessageBoxState(() => ({
                activate: true,
                status: "error",
                description: getInstillApiErrorMessage(error),
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
        }
      );
    } else if (modelDefinition === "model-definitions/artivc") {
      if (!modelArtivcGcsBucketPath || !modelArtivcTag) return;

      const payload: CreateUserModelPayload = {
        type: "ArtiVC",
        id: modelId.trim(),
        model_definition: "model-definitions/artivc",
        description: modelDescription ?? undefined,
        configuration: {
          url: modelArtivcGcsBucketPath.trim(),
          credential: modelArtivcCredentials
            ? modelArtivcCredentials.trim()
            : null,
          tag: modelArtivcTag.trim(),
        },
      };

      createUserModel.mutate(
        { userName: user.data.name, payload, accessToken },
        {
          onSuccess: async ({ operation }) => {
            if (!modelId) return;
            const operationIsDone = await checkUntilOperationIsDoen({
              operationName: operation.name,
              accessToken,
            });

            if (operationIsDone) {
              const modelName = `${user.data.name}/models/${modelId.trim()}`;
              const modelState = await watchUserModel({
                modelName,
                accessToken,
              });

              if (modelState.state === "STATE_ERROR") {
                setCreateModelMessageBoxState(() => ({
                  activate: true,
                  status: "error",
                  description: "Something went wrong when create the model",
                  message: "Create Model Failed",
                }));
                return;
              }

              await prepareNewModel(modelName);
              deployUserModel.mutate({ modelName, accessToken });

              setCreateModelMessageBoxState({
                activate: true,
                status: "success",
                description: null,
                message: "Succeed.",
              });

              if (onCreate) {
                onCreate(init);
              }
            }
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              setCreateModelMessageBoxState(() => ({
                activate: true,
                status: "error",
                description: getInstillApiErrorMessage(error),
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
        }
      );
    } else {
      if (!modelHuggingFaceRepoUrl) return;

      const payload: CreateUserModelPayload = {
        type: "HuggingFace",
        id: modelId.trim(),
        model_definition: "model-definitions/huggingface",
        description: modelDescription ?? undefined,
        configuration: {
          repo_id: modelHuggingFaceRepoUrl.trim(),
        },
      };

      createUserModel.mutate(
        { userName: user.data.name, payload, accessToken },
        {
          onSuccess: async ({ operation }) => {
            if (!modelId) return;
            const operationIsDone = await checkUntilOperationIsDoen({
              operationName: operation.name,
              accessToken,
            });

            if (operationIsDone) {
              const modelName = `${user.data.name}/models/${modelId.trim()}`;
              const modelState = await watchUserModel({
                modelName,
                accessToken,
              });

              if (modelState.state === "STATE_ERROR") {
                setCreateModelMessageBoxState(() => ({
                  activate: true,
                  status: "error",
                  description: "Something went wrong when create the model",
                  message: "Create Model Failed",
                }));
                return;
              }

              await prepareNewModel(modelName);
              deployUserModel.mutate({ modelName, accessToken });

              setCreateModelMessageBoxState({
                activate: true,
                status: "success",
                description: null,
                message: "Succeed.",
              });

              if (onCreate) {
                onCreate(init);
              }
            }
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              setCreateModelMessageBoxState(() => ({
                activate: true,
                status: "error",
                description: getInstillApiErrorMessage(error),
                message: error.message,
              }));
            } else {
              setCreateModelMessageBoxState(() => ({
                activate: true,
                status: "error",
                description: null,
                message:
                  "Something went wrong when create the HuggingFace model",
              }));
            }
          },
        }
      );
    }
  }, [
    createUserModel,
    deployUserModel,
    user.isSuccess,
    user.data?.name,
    modelArtivcCredentials,
    modelArtivcGcsBucketPath,
    modelArtivcTag,
    modelDefinition,
    modelDescription,
    modelHuggingFaceRepoUrl,
    modelId,
    modelLocalFile,
    modelGithubRepoUrl,
    modelGithubTag,
    accessToken,
    init,
    onCreate,
    prepareNewModel,
    setFieldError,
  ]);

  const getModelSetupGuide = React.useCallback((modelDefinition: string) => {
    switch (modelDefinition) {
      case "model-definitions/github":
        return "https://www.instill.tech/docs/import-models/github";
      case "model-definitions/artivc":
        return "https://www.instill.tech/docs/import-models/artivc";
      case "model-definitions/local":
        return "https://www.instill.tech/docs/import-models/local";
      case "model-definitions/huggingface":
        return "https://www.instill.tech/docs/import-models/huggingface";
      default:
        return "https://www.instill.tech/docs/import-models/overview";
    }
  }, []);

  if (disabledCreateModel) {
    return (
      <div className={cn("h-full flex-1", width || "w-full")}>
        <p className="m-auto w-2/3 text-center font-sans text-sm font-normal">
          Model creation is currently disabled, Please use our pre-deployed
          models
        </p>
      </div>
    );
  }

  return (
    <FormRoot marginBottom={marginBottom} width={width}>
      <div className="mb-10 flex flex-col gap-y-5">
        <BasicTextField
          id="model-id"
          label="ID"
          key="id"
          description="Pick a name to help you identify this resource. 
                  The ID conforms to RFC-1034, which restricts to letters, 
                  numbers, and hyphen, with the first character a letter, 
                  the last a letter or a number, and a 63 character maximum."
          required={true}
          disabled={modelDefinitions ? (modelCreated ? true : false) : false}
          value={modelId}
          error={modelIdError}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (!event.target.value) {
              setFieldValue("model.new.id", null);
              setFieldError("model.new.id", null);
              return;
            }

            const value = event.target.value.trim();

            if (validateResourceId(value)) {
              setFieldValue("model.new.id", value);
              setFieldError("model.new.id", null);
            } else {
              setFieldValue("model.new.id", value);
              setFieldError(
                "model.new.id",
                "Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum."
              );
            }
          }}
        />
        <BasicTextArea
          id="model-description"
          label="Description"
          key="description"
          description="Fill with a short description."
          required={false}
          disabled={modelDefinitions ? (modelCreated ? true : false) : false}
          value={modelDescription}
          error={modelDescriptionError}
          enableCounter={true}
          counterWordLimit={1023}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFieldValue("model.new.description", event.target.value)
          }
        />
        <BasicSingleSelect
          id="model-definition"
          key="modelDefinition"
          label="Model source"
          value={selectedModelDefinitionOption}
          options={modelDefinitionOptions ? modelDefinitionOptions : []}
          error={modelDefinitionError}
          onChange={(option) => {
            setFieldValue("model.new.definition", option?.value);
            setSelectedModelDefinitionOption(option);
          }}
          disabled={modelDefinitions ? (modelCreated ? true : false) : false}
          required={true}
          description={`<a href="${getModelSetupGuide(
            modelDefinition || ""
          )}">Setup Guide</a>`}
        />
        {selectedModelDefinitionOption?.value === "model-definitions/github" ? (
          <>
            <BasicTextField
              id="model-github-repo-url"
              label="GitHub repository"
              description="The name of a public GitHub repository, e.g.
                      `instill-ai/model-mobilenetv2-dvc`."
              required={true}
              value={modelGithubRepoUrl}
              error={modelGithubRepoUrlError}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue("model.new.github.repoUrl", event.target.value)
              }
              disabled={modelCreated ? true : false}
            />
            <BasicTextField
              id="model-github-tag"
              label="GitHub repository tag"
              description="The tag of the public GitHub repository, e.g. `v1.0-cpu`."
              required={true}
              value={modelGithubTag}
              error={modelGithubTagError}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue("model.new.github.tag", event.target.value)
              }
              disabled={modelCreated ? true : false}
            />
          </>
        ) : null}
        {selectedModelDefinitionOption?.value === "model-definitions/local" ? (
          <>
            <BasicUploadFileField
              id="model-local-file"
              name="file"
              label="Upload a file"
              description="Create and upload a zip file that contains all the model files from your computer"
              error={modelLocalFileError}
              placeholder=""
              uploadButtonText="Upload"
              required={true}
              readOnly={false}
              disabled={modelCreated ? true : false}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue(
                  "model.new.local.file",
                  event.target.files ? event.target.files[0] : null
                )
              }
            />
          </>
        ) : null}
        {selectedModelDefinitionOption?.value === "model-definitions/artivc" ? (
          <>
            <BasicTextField
              id="model-artivc-gcs-bucket-path"
              label="GCS Bucket Path"
              description="The bucket path string of Google Cloud Storage (GCS), e.g. `gs://mybucket/path/to/mymodel/`."
              required={true}
              value={modelArtivcGcsBucketPath}
              error={modelArtivcGcsBucketPathError}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue(
                  "model.new.artivc.gcsBucketPath",
                  event.target.value
                )
              }
            />
            <BasicTextField
              id="model-artivc-tag"
              label="ArtiVC Tag"
              description="The tag name of ArtiVC source commit, e.g. `v1.0-cpu`."
              required={true}
              value={modelArtivcTag}
              error={modelArtivcTagError}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue("model.new.artivc.tag", event.target.value)
              }
            />
            <BasicTextArea
              id="model-artivc-credentials"
              label="Credentials JSON"
              key="credentials"
              description="If the GCS bucket path is private, please provide the Google Cloud Application Default credential or service account credential in its JSON format to get access to the model. See ArtiVC Google Cloud Storage setup guide."
              value={modelArtivcCredentials}
              error={modelArtivcCredentialsError}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFieldValue(
                  "model.new.artivc.credentials",
                  event.target.value
                )
              }
            />
          </>
        ) : null}
        {selectedModelDefinitionOption?.value ===
        "model-definitions/huggingface" ? (
          <>
            <BasicTextField
              id="model-huggingface-repo-url"
              label="HuggingFace model ID"
              description="The name of a public HuggingFace model ID, e.g. `google/vit-base-patch16-224`."
              required={true}
              value={modelHuggingFaceRepoUrl}
              error={modelHuggingFaceRepoUrlError}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue(
                  "model.new.huggingFace.repoUrl",
                  event.target.value
                )
              }
            />
          </>
        ) : null}
      </div>
      <div className="mb-10 flex flex-row">
        <BasicProgressMessageBox
          state={createModelMessageBoxState}
          setActivate={(activate) =>
            setCreateModelMessageBoxState((prev) => ({ ...prev, activate }))
          }
          width="w-[25vw]"
          closable={true}
        />
        <SolidButton
          disabled={canCreateModel ? false : true}
          onClickHandler={() => handelCreateModel()}
          position="ml-auto my-auto"
          type="button"
          data-testid="set-up-model-button"
          color="primary"
        >
          Set up
        </SolidButton>
      </div>
    </FormRoot>
  );
};
