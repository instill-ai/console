import axios from "axios";

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

export const getModelQuery = async (modelId: string): Promise<Model> => {
  try {
    const { data } = await axios.post<GetModelResponse>(
      "/api/model/get-model",
      {
        id: modelId,
      }
    );
    return Promise.resolve(data.model);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetModelInstanceResponse = {
  instance: ModelInstance;
};

export type ModelState = "STATE_ONLINE" | "STATE_OFFLINE" | "STATE_ERROR";

export type ModelInstance = {
  name: string;
  uid: string;
  id: string;
  state: string;
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
