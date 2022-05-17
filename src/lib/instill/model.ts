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
    const res = await axios.get<GetModelResponse>(
      `${process.env.NEXT_PUBLIC_MODEL_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${modelId}`
    );

    return Promise.resolve({
      id: res.data.model.name,
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
