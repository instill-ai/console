import axios from "axios";
import { Model, ModelDefinition, ModelInstance } from "./types";

// ###################################################################
// #                                                                 #
// # Model Definition                                                #
// #                                                                 #
// ###################################################################

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
// # Model                                                           #
// #                                                                 #
// ###################################################################

export type GetModelResponse = {
  model: Model;
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
// # Model Instance                                                  #
// #                                                                 #
// ###################################################################

export type GetModelInstanceResponse = {
  instance: ModelInstance;
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
