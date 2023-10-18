import { createInstillAxiosClient } from "../helper";
import { Nullable } from "../../type";

export type DeployUserModelResponse = {
  model_id: string;
};

export async function deployUserModelAction({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");

    const { data } = await client.post<DeployUserModelResponse>(
      `/${modelName}/deploy`
    );
    return Promise.resolve(data.model_id);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UndeployUserModelResponse = {
  model_id: string;
};

export async function undeployUserModeleAction({
  modelName,
  accessToken,
}: {
  modelName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "model");

    const { data } = await client.post<UndeployUserModelResponse>(
      `/${modelName}/undeploy`
    );
    return Promise.resolve(data.model_id);
  } catch (err) {
    return Promise.reject(err);
  }
}
