import axios from "axios";

// ###################################################################
// #                                                                 #
// # [Query] Model                                                   #
// #                                                                 #
// ###################################################################

export type GetModelResponse = {
  model: Model;
};

export type Model = {
  name: string;
  uid: string;
  id: string;
  description: string;
  model_definition: string;
  configuration: string;
  visibility: string;
  user: string;
  org: string;
  create_time: string;
  update_time: string;
};

export type ModelWithInstance = Model & {
  instances: ModelInstance[];
};

export const getModelQuery = async (modelName: string): Promise<Model> => {
  try {
    const { data } = await axios.post<GetModelResponse>(
      "/api/model/get-model",
      {
        name: modelName,
      }
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type ListModelsResponse = {
  models: Model[];
  next_page_token: string;
  total_size: string;
};

export const listModelsQuery = async (): Promise<Model[]> => {
  try {
    const { data } = await axios.get<ListModelsResponse>(
      "/api/model/list-models"
    );
    return Promise.resolve(data.models);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Query] Model Definition                                        #
// #                                                                 #
// ###################################################################

export type ModelDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentation_url: string;
  icon: string;
  model_spec: Record<string, any>;
  model_instance_spec: Record<string, any>;
  create_time: string;
  update_time: string;
};

export type GetModelDefinitionResponse = {
  model_definition: ModelDefinition;
};

export const getModelDefinitionQuery = async (modelDefinitionId: string) => {
  try {
    const { data } = await axios.post<GetModelDefinitionResponse>(
      "/api/model/get-model-definition",
      { id: modelDefinitionId }
    );
    return Promise.resolve(data.model_definition);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type ListModelDefinitionsResponse = {
  model_definitions: ModelDefinition[];
  next_page_token: string;
  total_size: string;
};

export const listModelDefinitionsQuery = async (): Promise<
  ModelDefinition[]
> => {
  try {
    const { data } = await axios.get<ListModelDefinitionsResponse>(
      "/api/model/list-model-definitions"
    );
    return Promise.resolve(data.model_definitions);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Mutation] Model                                                #
// #                                                                 #
// ###################################################################

export type CreateGithubModelPayload = {
  id: string;
  model_definition: string;
  configuration: string;
};

export type CreateGithubModelResponse = {
  model: Model;
};

export const createGithubModelMutation = async (
  payload: CreateGithubModelPayload
): Promise<Model> => {
  try {
    const { data } = await axios.post<CreateGithubModelResponse>(
      "/api/model/create-github-model",
      payload
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type CreateLocalModelPayload = {
  id: string;
  desctiption: string;
  model_definition: string;
  content: string;
};

export type CreateLocalModelResponse = {
  model: Model;
};

export const createLocalModelMutation = async (
  payload: CreateLocalModelPayload
) => {
  try {
    const formData = new FormData();
    formData.append("id", payload.id);
    formData.append("desctiption", payload.desctiption);
    formData.append("model_definition", payload.model_definition);
    formData.append("content", payload.content);

    const { data } = await axios.post<CreateGithubModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/models:multipart`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Action] Model                                                  #
// #                                                                 #
// ###################################################################

export type DeployModelResponse = {
  instance: ModelInstance;
};

export const deployModelAction = async (modelInstanceName: string) => {
  try {
    const { data } = await axios.post<DeployModelResponse>(
      "/api/model/deploy-model",
      {
        name: modelInstanceName,
      }
    );
    return Promise.resolve(data.instance);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Query] Model Instance                                          #
// #                                                                 #
// ###################################################################

export type GetModelInstanceResponse = {
  instance: ModelInstance;
};

export type ModelState = "STATE_ONLINE" | "STATE_OFFLINE" | "STATE_ERROR";

export type ModelInstance = {
  name: string;
  uid: string;
  id: string;
  state: ModelState;
  task: string;
  model_definition: string;
  configuration: string;
  create_time: string;
  update_time: string;
};

export const getModelInstanceQuery = async (
  modelInstanceId: string
): Promise<ModelInstance> => {
  try {
    const { data } = await axios.post<GetModelInstanceResponse>(
      "/api/model/get-model-instance",
      { id: modelInstanceId }
    );

    return Promise.resolve(data.instance);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type ListModelInstancesResponse = {
  instances: ModelInstance[];
  next_page_token: string;
  total_size: string;
};

export const listModelInstancesQuery = async (
  modelName: string
): Promise<ModelInstance[]> => {
  try {
    const { data } = await axios.post<ListModelInstancesResponse>(
      "/api/model/list-model-instances",
      {
        name: modelName,
      }
    );
    return Promise.resolve(data.instances);
  } catch (err) {
    return Promise.reject(err);
  }
};
