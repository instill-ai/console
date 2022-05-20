import axios from "axios";

export type GetModelResponse = {
  model: {
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
};

export type Model = {
  id: string;
  name: string;
  description: string;
  modelDefinition: string;
  configuration: string;
  visibility: string;
  user: string;
  org: string;
  createTime: string;
  updateTime: string;
};

export const getModelQuery = async (modelId: string): Promise<Model> => {
  try {
    const res = await axios.post<GetModelResponse>("/api/model/get-model", {
      id: modelId,
    });

    return Promise.resolve({
      id: res.data.model.id,
      name: res.data.model.name,
      description: res.data.model.description,
      modelDefinition: res.data.model.model_definition,
      configuration: res.data.model.configuration,
      visibility: res.data.model.visibility,
      user: res.data.model.user,
      org: res.data.model.org,
      createTime: res.data.model.create_time,
      updateTime: res.data.model.update_time,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export type GetModelInstanceResponse = {
  instance: {
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
};

export type ModelState = "STATE_ONLINE" | "STATE_OFFLINE" | "STATE_ERROR";

export type ModelInstance = {
  id: string;
  name: string;
  state: ModelState;
  task: string;
  modelDefinition: string;
  configuration: string;
  createTime: string;
  updateTime: string;
};

export const getModelInstanceQuery = async (
  modelInstanceId: string
): Promise<ModelInstance> => {
  try {
    const res = await axios.post<GetModelInstanceResponse>(
      "/api/model/get-model-instance",
      { id: modelInstanceId }
    );

    return Promise.resolve({
      id: res.data.instance.id,
      name: res.data.instance.name,
      state: res.data.instance.state as ModelState,
      task: res.data.instance.task,
      modelDefinition: res.data.instance.model_definition,
      configuration: res.data.instance.configuration,
      createTime: res.data.instance.create_time,
      updateTime: res.data.instance.update_time,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
