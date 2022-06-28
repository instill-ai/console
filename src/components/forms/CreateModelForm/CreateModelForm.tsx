import { FC, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import {
  BasicProgressMessageBox,
  ModelInstanceIcon,
  SingleSelectOption,
} from "@instill-ai/design-system";

import {
  FormBase,
  SingleSelect,
  TextArea,
  TextField,
  UploadFileField,
} from "../../formik";
import {
  useCreateArtivcModel,
  useCreateGithubModel,
  useCreateLocalModel,
  useDeployModelInstance,
  useModelDefinitions,
  useModelInstances,
} from "@/services/model";
import { ModelDefinitionIcon, PrimaryButton } from "@/components/ui";
import {
  CreateArtivcModelPayload,
  CreateGithubModelPayload,
  CreateLocalModelPayload,
  Model,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";

type CreateModelFormValue = {
  id: Nullable<string>;
  modelDefinition: Nullable<string>;
  modelInstanceId: Nullable<string>;
  file: Nullable<string>;
  repo: Nullable<string>;
  description: Nullable<string>;
  gcsBucketPath: Nullable<string>;
  credentials: Nullable<string>;
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
  // # 2 - Set up github/local model                                   #
  // #                                                                 #
  // ###################################################################

  const [modelCreated, setModelCreated] = useState(false);
  const [newModel, setNewModel] = useState<Nullable<Model>>(null);
  const [isSettingModel, setIsSettingModel] = useState(false);
  const [setupModelError, setSetupModelError] =
    useState<Nullable<string>>(null);

  const validateSetupModelValue = useCallback(
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

      if (!values.gcsBucketPath || !values.id) {
        return false;
      }

      return true;
    },
    [modelCreated]
  );

  const createGithubModel = useCreateGithubModel();
  const createLocalModel = useCreateLocalModel();
  const createArtivcModel = useCreateArtivcModel();

  const handelCreateModel = async (values: CreateModelFormValue) => {
    if (!values.id) return;

    setIsSettingModel(true);
    setSetupModelError(null);

    if (values.modelDefinition === "github") {
      const configuration = {
        repository: values.repo,
      };
      const payload: CreateGithubModelPayload = {
        id: values.id,
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
              process: "model",
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
    } else if (values.modelDefinition === "local") {
      if (!values.id || !values.file) {
        return;
      }

      const payload: CreateLocalModelPayload = {
        id: values.id,
        desctiption: values.description ? values.description : "",
        model_definition: "model-definitions/local",
        content: values.file,
      };

      createLocalModel.mutate(payload, {
        onSuccess: (newModel) => {
          setModelCreated(true);
          setNewModel(newModel);
          setIsSettingModel(false);
          if (amplitudeIsInit) {
            sendAmplitudeData("create_local_model", {
              type: "critical_action",
            });
          }
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
    } else {
      if (!values.gcsBucketPath) return;

      const payload: CreateArtivcModelPayload = {
        id: values.id,
        model_definition: "model-definitions/artivc",
        configuration: {
          url: values.gcsBucketPath,
          credential: values.credentials,
        },
      };

      createArtivcModel.mutate(payload, {
        onSuccess: (newModel) => {
          setModelCreated(true);
          setNewModel(newModel);
          setIsSettingModel(false);
          if (amplitudeIsInit) {
            sendAmplitudeData("create_artivc_model", {
              type: "critical_action",
            });
          }
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
  const [isDeployingModel, setIsDeployingModel] = useState(false);
  const [deployModelError, setDeployModelError] =
    useState<Nullable<string>>(null);

  const canDisplayDeployModelSection = useMemo(() => {
    if (!modelCreated || !newModel || !modelInstances.isSuccess) {
      return false;
    }
    return true;
  }, [modelCreated, newModel, modelInstances.isSuccess]);

  const deployModelInstance = useDeployModelInstance();

  const handleDeployModel = async (values: CreateModelFormValue) => {
    if (!values.modelInstanceId || !values.id) return;

    setIsDeployingModel(true);
    deployModelInstance.mutate(
      `models/${values.id}/instances/${values.modelInstanceId}`,
      {
        onSuccess: () => {
          setIsDeployingModel(false);
          router.push("/models");
        },
        onError: (error) => {
          if (error instanceof Error) {
            setDeployModelError(error.message);
            setIsDeployingModel(false);
          } else {
            setDeployModelError("Something went wrong when deploying model");
            setIsDeployingModel(false);
          }
        },
      }
    );
  };

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
        } as CreateModelFormValue
      }
      onSubmit={async (values) => {
        if (!modelCreated) {
          await handelCreateModel(values);
        } else {
          await handleDeployModel(values);
        }
      }}
    >
      {({ errors, values }) => {
        return (
          <FormBase marginBottom={null} gapY="gap-y-5" padding={null}>
            <TextField
              id="modelId"
              name="id"
              label="Id"
              additionalMessageOnLabel={null}
              description="Pick a name to help you identify this source in Instill"
              value={values.id}
              error={errors.id || null}
              additionalOnChangeCb={null}
              disabled={modelCreated ? true : false}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
            />
            <SingleSelect
              name="modelDefinition"
              id="modelDefinition"
              label="Model type"
              additionalMessageOnLabel={null}
              description={"Setup Guide"}
              value={selectedModelDefinitionOption}
              options={modelDefinitionOptions ? modelDefinitionOptions : []}
              error={errors.modelDefinition || null}
              additionalOnChangeCb={modelDefinitionOnChangeCb}
              disabled={modelCreated ? true : false}
              readOnly={false}
              required={true}
              menuPlacement="auto"
            />
            {values.modelDefinition === "github" ? (
              <TextField
                id="modelRepo"
                name="repo"
                label="GitHub repository"
                additionalMessageOnLabel={null}
                description="The name of a public GitHub repository, e.g. `instill-ai/yolov4`."
                value={values.repo}
                error={errors.repo || null}
                additionalOnChangeCb={null}
                disabled={modelCreated ? true : false}
                readOnly={false}
                required={true}
                placeholder=""
                type="text"
                autoComplete="off"
              />
            ) : null}
            {values.modelDefinition === "local" ? (
              <>
                <TextArea
                  id="description"
                  name="description"
                  label="Description"
                  additionalMessageOnLabel={null}
                  description="Fill with a short description of your new model"
                  value={values.description}
                  error={errors.description || null}
                  additionalOnChangeCb={null}
                  disabled={modelCreated ? true : false}
                  readOnly={false}
                  required={false}
                  autoComplete="off"
                  placeholder=""
                  enableCounter={false}
                  counterWordLimit={0}
                />
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
                  additionalMessageOnLabel={null}
                  description="The bucket path string of Google Cloud Storage (GCS), e.g. `gs://mybucket/path/to/mymodel/`."
                  value={values.gcsBucketPath}
                  error={errors.gcsBucketPath || null}
                  additionalOnChangeCb={null}
                  disabled={false}
                  readOnly={false}
                  required={true}
                  placeholder=""
                  type="text"
                  autoComplete="off"
                />
                <TextArea
                  id="credentials"
                  name="credentials"
                  label="Credentials JSON"
                  additionalMessageOnLabel={null}
                  description="If the GCS bucket path is private, please provide the Google Cloud Application Default credential or service account credential in its JSON format to get access to the model. See ArtiVC Google Cloud Storage setup guide."
                  value={values.credentials}
                  error={errors.credentials || null}
                  additionalOnChangeCb={null}
                  disabled={false}
                  readOnly={false}
                  required={false}
                  autoComplete="off"
                  placeholder=""
                  enableCounter={false}
                  counterWordLimit={0}
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
                disabled={validateSetupModelValue(values) ? false : true}
                onClickHandler={() => handelCreateModel(values)}
                position="ml-auto my-auto"
                type="button"
              >
                Setup new model
              </PrimaryButton>
            </div>
            {canDisplayDeployModelSection ? (
              <>
                <h3 className="mt-[60px] mb-5 text-black text-instill-h3">
                  Deploy a model instance
                </h3>
                <SingleSelect
                  id="modelInstanceId"
                  name="modelInstanceId"
                  label="Source type"
                  additionalMessageOnLabel={null}
                  options={modelInstanceOptions ? modelInstanceOptions : []}
                  value={selectedModelInstanceOption}
                  error={errors.modelInstanceId || null}
                  additionalOnChangeCb={modelInstanceOnChangeCb}
                  disabled={false}
                  readOnly={false}
                  required={true}
                  description={"Setup Guide"}
                  menuPlacement="auto"
                />
                <div className="flex flex-row">
                  {deployModelError ? (
                    <BasicProgressMessageBox width="w-[216px]" status="error">
                      {deployModelError}
                    </BasicProgressMessageBox>
                  ) : isDeployingModel ? (
                    <BasicProgressMessageBox
                      width="w-[216px]"
                      status="progressing"
                    >
                      Deploying model...
                    </BasicProgressMessageBox>
                  ) : null}
                  <PrimaryButton
                    disabled={values.modelInstanceId ? false : true}
                    onClickHandler={() => handleDeployModel(values)}
                    position="ml-auto my-auto"
                    type="button"
                  >
                    Deploy
                  </PrimaryButton>
                </div>
              </>
            ) : null}
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default CreateNewModelFlow;
