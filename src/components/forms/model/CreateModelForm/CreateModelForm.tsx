import { FC, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import {
  BasicProgressMessageBox,
  ModelInstanceIcon,
  ProgressMessageBoxState,
  SingleSelectOption,
} from "@instill-ai/design-system";

import {
  FormikFormBase,
  SingleSelect,
  TextArea,
  TextField,
  UploadFileField,
} from "../../../formik";
import {
  useCreateArtivcModel,
  useCreateGithubModel,
  useCreateHuggingFaceModel,
  useCreateLocalModel,
  useDeployModelInstance,
  useModelDefinitions,
  useModelInstances,
} from "@/services/model";
import { ModelDefinitionIcon, PrimaryButton } from "@/components/ui";
import {
  CreateArtivcModelPayload,
  CreateGithubModelPayload,
  CreateHuggingFaceModelPayload,
  CreateLocalModelPayload,
  Model,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { AxiosError } from "axios";
import { ErrorDetails } from "@/lib/instill/types";

export type CreateModelFormValue = {
  id: Nullable<string>;
  modelDefinition: Nullable<string>;
  modelInstanceId: Nullable<string>;
  file: Nullable<File>;
  repo: Nullable<string>;
  description: Nullable<string>;
  gcsBucketPath: Nullable<string>;
  credentials: Nullable<string>;
  huggingFaceRepo: Nullable<string>;
};

const CreateNewModelFlow: FC = () => {
  const { amplitudeIsInit } = useAmplitudeCtx();

  // ###################################################################
  // #                                                                 #
  // # 1 - Initialize the model definition                             #
  // #                                                                 #
  // ###################################################################

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

  const modelDefinitionOnChangeCb = useCallback(
    (option: SingleSelectOption) => {
      setSelectedModelDefinitionOption(option);
    },
    []
  );

  // ###################################################################
  // #                                                                 #
  // # 2 - Create github/local/artivc model                            #
  // #                                                                 #
  // ###################################################################

  const [modelCreated, setModelCreated] = useState(false);
  const [newModel, setNewModel] = useState<Nullable<Model>>(null);

  const [createModelMessageBoxState, setCreateModelMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const validateCreateModelValue = useCallback(
    (values: CreateModelFormValue) => {
      if (!values.modelDefinition || modelCreated) return false;

      if (values.modelDefinition === "github") {
        if (!values.repo || !values.id) {
          return false;
        }
        return true;
      }

      if (values.modelDefinition === "local") {
        if (!values.file || !values.id) {
          return false;
        }
        return true;
      }

      if (values.modelDefinition === "artivc") {
        if (!values.gcsBucketPath || !values.id) {
          return false;
        }

        return true;
      }

      if (!values.huggingFaceRepo) {
        return false;
      }

      return true;
    },
    [modelCreated]
  );

  const createGithubModel = useCreateGithubModel();
  const createLocalModel = useCreateLocalModel();
  const createArtivcModel = useCreateArtivcModel();
  const createHuggingFaceModel = useCreateHuggingFaceModel();

  const handelCreateModel = useCallback(
    async (values: CreateModelFormValue) => {
      if (!values.id) return;

      setCreateModelMessageBoxState(() => ({
        activate: true,
        status: "progressing",
        description: null,
        message: "Creating...",
      }));

      if (values.modelDefinition === "github") {
        if (!values.repo) return;

        const payload: CreateGithubModelPayload = {
          id: values.id,
          model_definition: "model-definitions/github",
          description: values.description ?? null,
          configuration: {
            repository: values.repo,
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
                process: "model",
              });
            }
          },
          onError: (error) => {
            if (error instanceof AxiosError) {
              setCreateModelMessageBoxState(() => ({
                activate: true,
                status: "error",
                description:
                  (error.response?.data.details as ErrorDetails[])[0]
                    .description ?? null,
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
      } else if (values.modelDefinition === "local") {
        if (!values.id || !values.file) {
          return;
        }

        const payload: CreateLocalModelPayload = {
          id: values.id,
          description: values.description ? values.description : "",
          model_definition: "model-definitions/local",
          configuration: {
            content: values.file,
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
              message: "Succeed",
            }));
            if (amplitudeIsInit) {
              sendAmplitudeData("create_local_model", {
                type: "critical_action",
              });
            }
          },
          onError: (error) => {
            if (error instanceof AxiosError) {
              setCreateModelMessageBoxState(() => ({
                activate: true,
                status: "error",
                description:
                  (error.response?.data.details as ErrorDetails[])[0]
                    .description ?? null,
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
      } else if (values.modelDefinition === "artivc") {
        if (!values.gcsBucketPath) return;

        const payload: CreateArtivcModelPayload = {
          id: values.id,
          model_definition: "model-definitions/artivc",
          description: values.description ?? null,
          configuration: {
            url: values.gcsBucketPath,
            credential: values.credentials,
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
                description:
                  (error.response?.data.details as ErrorDetails[])[0]
                    .description ?? null,
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
        if (!values.huggingFaceRepo) return;

        const payload: CreateHuggingFaceModelPayload = {
          id: values.id,
          model_definition: "model-definitions/huggingface",
          description: values.description ?? null,
          configuration: {
            repo_id: values.huggingFaceRepo,
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
                description:
                  (error.response?.data.details as ErrorDetails[])[0]
                    .description ?? null,
                message: error.response?.data.message ?? error.message,
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
        });
      }
    },
    [
      amplitudeIsInit,
      createArtivcModel,
      createGithubModel,
      createLocalModel,
      createHuggingFaceModel,
    ]
  );

  // ###################################################################
  // #                                                                 #
  // #  3 - Initialize model instances                                 #
  // #                                                                 #
  // ###################################################################

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

  const modelInstanceOnChangeCb = useCallback((option: SingleSelectOption) => {
    setSelectedModelInstanceOption(option);
  }, []);

  // ###################################################################
  // #                                                                 #
  // #  4 - Deploy model instances                                     #
  // #                                                                 #
  // ###################################################################

  const router = useRouter();

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
    if (!values.modelInstanceId || !values.id) return;

    setDeployModelInstanceMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Deploying...",
    }));

    deployModelInstance.mutate(
      `models/${values.id}/instances/${values.modelInstanceId}`,
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
          if (error instanceof AxiosError) {
            setDeployModelInstanceMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.response?.data.message ?? error.message,
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
    <Formik
      initialValues={
        {
          id: null,
          modelDefinition: null,
          modelInstanceId: null,
          file: null,
          repo: null,
          description: null,
          gcsBucketPath: null,
          credentials: null,
          huggingFaceRepo: null,
        } as CreateModelFormValue
      }
      onSubmit={() => {
        console.log("submit");
      }}
    >
      {({ errors, values }) => {
        return (
          <FormikFormBase
            marginBottom={null}
            gapY="gap-y-5"
            padding={null}
            minWidth={null}
          >
            <TextField
              id="modelId"
              name="id"
              label="ID"
              description={
                "Pick a name to help you identify this resource. The ID conforms to RFC-1034, " +
                "which restricts to letters, numbers, and hyphen, with the first character a letter," +
                "the last a letter or a number, and a 63 character maximum."
              }
              value={values.id}
              error={errors.id || null}
              disabled={modelCreated ? true : false}
              required={true}
            />
            <TextArea
              id="description"
              name="description"
              label="Description"
              description="Fill with a short description."
              value={values.description}
              error={errors.description || null}
              disabled={modelCreated ? true : false}
              enableCounter={true}
              counterWordLimit={1023}
            />
            <SingleSelect
              name="modelDefinition"
              id="modelDefinition"
              label="Model source"
              description={`<a href="${getModelSetupGuide(
                values
              )}">Setup Guide</a>`}
              value={selectedModelDefinitionOption}
              options={modelDefinitionOptions ? modelDefinitionOptions : []}
              error={errors.modelDefinition || null}
              additionalOnChangeCb={modelDefinitionOnChangeCb}
              disabled={modelCreated ? true : false}
              required={true}
            />
            {values.modelDefinition === "github" ? (
              <>
                <TextField
                  id="modelRepo"
                  name="repo"
                  label="GitHub repository"
                  description="The name of a public GitHub repository, e.g. `instill-ai/model-yolov7`."
                  value={values.repo}
                  error={errors.repo || null}
                  disabled={modelCreated ? true : false}
                  required={true}
                />
              </>
            ) : null}
            {values.modelDefinition === "local" ? (
              <>
                <UploadFileField
                  id="file"
                  name="file"
                  label="Upload a file"
                  additionalMessageOnLabel={null}
                  description="Create and upload a zip file that contains all the model files from your computer"
                  error={errors.file || null}
                  additionalOnChangeCb={null}
                  placeholder=""
                  uploadButtonText="Upload"
                  required={true}
                  readOnly={false}
                  disabled={modelCreated ? true : false}
                />
              </>
            ) : null}
            {values.modelDefinition === "artivc" ? (
              <>
                <TextField
                  id="gcsBucketPath"
                  name="gcsBucketPath"
                  label="GCS Bucket Path"
                  description="The bucket path string of Google Cloud Storage (GCS), e.g. `gs://mybucket/path/to/mymodel/`."
                  value={values.gcsBucketPath}
                  error={errors.gcsBucketPath || null}
                  required={true}
                />
                <TextArea
                  id="credentials"
                  name="credentials"
                  label="Credentials JSON"
                  description="If the GCS bucket path is private, please provide the Google Cloud Application Default credential or service account credential in its JSON format to get access to the model. See ArtiVC Google Cloud Storage setup guide."
                  value={values.credentials}
                  error={errors.credentials || null}
                />
              </>
            ) : null}
            {values.modelDefinition === "huggingface" ? (
              <>
                <TextField
                  id="huggingFaceRepo"
                  name="huggingFaceRepo"
                  label="HuggingFace model ID"
                  description="The name of a public HuggingFace model ID, e.g. `google/vit-base-patch16-224`."
                  value={values.huggingFaceRepo}
                  error={errors.huggingFaceRepo || null}
                  disabled={modelCreated ? true : false}
                  required={true}
                />
              </>
            ) : null}
            <div className="flex flex-row">
              <BasicProgressMessageBox
                state={createModelMessageBoxState}
                setState={setCreateModelMessageBoxState}
                width="w-[25vw]"
                closable={true}
              />
              <PrimaryButton
                disabled={validateCreateModelValue(values) ? false : true}
                onClickHandler={() => handelCreateModel(values)}
                position="ml-auto my-auto"
                type="button"
              >
                Set up
              </PrimaryButton>
            </div>
            {canDisplayDeployModelInstanceSection ? (
              <>
                <h3 className="mt-[60px] mb-5 text-black text-instill-h3">
                  Deploy a model instance
                </h3>
                <SingleSelect
                  id="modelInstanceId"
                  name="modelInstanceId"
                  label="Model Instances"
                  options={modelInstanceOptions ? modelInstanceOptions : []}
                  value={selectedModelInstanceOption}
                  error={errors.modelInstanceId || null}
                  additionalOnChangeCb={modelInstanceOnChangeCb}
                  required={true}
                  description={
                    "<a href='https://www.instill.tech/docs/core-concepts/model#model-instance'>Setup Guide</a>"
                  }
                />
                <div className="flex flex-row">
                  <BasicProgressMessageBox
                    state={deployModelInstanceMessageBoxState}
                    setState={setDeployModelInstanceMessageBoxState}
                    width="w-[25vw]"
                    closable={true}
                  />
                  <PrimaryButton
                    disabled={values.modelInstanceId ? false : true}
                    onClickHandler={() => handleDeployModelInstance(values)}
                    position="ml-auto my-auto"
                    type="button"
                  >
                    Deploy
                  </PrimaryButton>
                </div>
              </>
            ) : null}
          </FormikFormBase>
        );
      }}
    </Formik>
  );
};

export default CreateNewModelFlow;
