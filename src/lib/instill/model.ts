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

// - Becasuse model itself doesn't have state, we have to conclude model
// state using model_instance state.
// - model_instance.error > model_instance.online > model_instance.offline
// - Model state will be error if there exist a error model_insance

export type ModelWithInstance = Model & {
  instances: ModelInstance[];
  state: ModelState;
};

export const getModelQuery = async (modelName: string): Promise<Model> => {
  try {
    const { data } = await axios.get<GetModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelName}?view=VIEW_FULL`
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
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/models?view=VIEW_FULL`
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

export const getModelDefinitionQuery = async (modelDefinitionName: string) => {
  try {
    const { data } = await axios.get<GetModelDefinitionResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelDefinitionName}`
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
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/model-definitions`
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
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/models`,
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
    formData.append("description", payload.desctiption);
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

export type UpdateModelPayload = Partial<Model> & {
  name: string;
};

export type UpdateModelResponse = {
  model: Model;
};

export const updateModelMutation = async (
  payload: UpdateModelPayload
): Promise<Model> => {
  try {
    const { data } = await axios.patch<UpdateModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${payload.name}`,
      payload
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

export const deployModelInstanceAction = async (modelInstanceName: string) => {
  try {
    const { data } = await axios.post<DeployModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelInstanceName}:deploy`
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
  modelInstanceName: string
): Promise<ModelInstance> => {
  try {
    const { data } = await axios.get<GetModelInstanceResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelInstanceName}`
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
    const { data } = await axios.get<ListModelInstancesResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelName}/instances?view=VIEW_FULL`
    );
    return Promise.resolve(data.instances);
  } catch (err) {
    return Promise.reject(err);
  }
};
